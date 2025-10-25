import * as React from "react"
import { cn } from "@/lib/utils"

function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-neutral-300",
        className
      )}
      {...props}
    />
  )
}

export { Label }
