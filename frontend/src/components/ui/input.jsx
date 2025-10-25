import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-400 outline-none transition-colors duration-200",
        "focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
