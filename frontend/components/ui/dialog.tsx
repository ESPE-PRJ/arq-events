"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DialogTrigger) {
          return React.cloneElement(child as React.ReactElement<{ onClick?: () => void }>, { onClick: () => onOpenChange?.(true) })
        }
        if (React.isValidElement(child) && child.type === DialogContent && open) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
              {React.cloneElement(child as React.ReactElement<{ onClose?: () => void }>, { onClose: () => onOpenChange?.(false) })}
            </div>
          )
        }
        return null
      })}
    </>
  )
}

const DialogTrigger = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { onClick })
  }
  return null
}

const DialogContent = ({
  className,
  children,
  onClose,
}: {
  className?: string
  children: React.ReactNode
  onClose?: () => void
}) => (
  <div className={cn("relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4", className)}>
    <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
      <X className="h-4 w-4" />
    </button>
    {children}
  </div>
)

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />,
)
DialogDescription.displayName = "DialogDescription"

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
