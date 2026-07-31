import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-auto w-full min-w-0 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-foreground transition-colors outline-none placeholder:text-muted hover:border-accent/40 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
