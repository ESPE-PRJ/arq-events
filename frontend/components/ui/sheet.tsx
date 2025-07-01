"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => {
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SheetTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, { onClick: () => onOpenChange?.(true) })
        }
        if (React.isValidElement(child) && child.type === SheetContent && open) {
          return (
            <div className="fixed inset-0 z-50">
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

const SheetTrigger = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  if (!React.isValidElement(children)) return null;
  const existingOnClick = (children.props as any).onClick;
  return React.cloneElement(
    children as React.ReactElement<any>,
    {
      onClick: (e: React.MouseEvent) => {
        existingOnClick?.(e);
        onClick?.();
      },
    }
  );
}

const SheetContent = ({
  className,
  children,
  onClose,
  side = "right",
}: {
  className?: string
  children: React.ReactNode
  onClose?: () => void
  side?: "left" | "right" | "top" | "bottom"
}) => {
  const sideClasses = {
    left: "left-0 top-0 h-full w-3/4 max-w-sm",
    right: "right-0 top-0 h-full w-3/4 max-w-sm",
    top: "top-0 left-0 w-full h-3/4 max-h-sm",
    bottom: "bottom-0 left-0 w-full h-3/4 max-h-sm",
  }

  return (
    <div className={cn("fixed z-50 bg-white shadow-lg", sideClasses[side], className)}>
      <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
      {children}
    </div>
  )
}

export { Sheet, SheetTrigger, SheetContent }
