"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  ),
)
Select.displayName = "Select"

const SelectGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-1", className)} {...props}>
      {children}
    </div>
  ),
)
SelectGroup.displayName = "SelectGroup"

const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <option value="" disabled hidden>
    {placeholder}
  </option>
)

const SelectTrigger = Select

const SelectScrollUpButton = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
      {/* Placeholder for scroll up button icon */}
    </button>
  ),
)
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
      {/* Placeholder for scroll down button icon */}
    </button>
  ),
)
SelectScrollDownButton.displayName = "SelectScrollDownButton"

const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>

const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
  ({ className, ...props }, ref) => (
    <option
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
SelectItem.displayName = "SelectItem"

const SelectSeparator = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("-mx-1 my-1 h-px bg-gray-200", className)} {...props} />
  ),
)
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
