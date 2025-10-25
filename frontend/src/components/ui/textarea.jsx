import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-[96px] rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-400 outline-none transition-colors duration-200",
        "focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea }
