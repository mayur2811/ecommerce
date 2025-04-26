import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputOTPVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        outline: "border-2 border-input",
        filled: "border-0 bg-muted",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const InputOTP = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="\d{6}"
      maxLength={6}
      className={cn(inputOTPVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-10 w-10 text-center text-sm",
      "flex items-center justify-center",
      "rounded-md border border-input bg-background",
      "transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {props.children}
    {index === 0 && (
      <span className="absolute right-0 top-0 -mr-1 -mt-1 h-2 w-2 rounded-full bg-primary" />
    )}
  </div>
))
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot } 