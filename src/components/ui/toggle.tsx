"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-full text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border border-line bg-surface text-muted hover:border-accent/40 hover:text-foreground data-[state=on]:border-accent data-[state=on]:bg-accent data-[state=on]:text-[#06130a] data-[state=on]:shadow-lg data-[state=on]:shadow-accent/20",
        outline:
          "border border-line bg-transparent text-muted hover:border-accent/40 hover:text-foreground data-[state=on]:border-accent data-[state=on]:bg-accent data-[state=on]:text-[#06130a]",
      },
      size: {
        default: "h-auto min-w-0 px-4 py-2",
        sm: "h-auto min-w-0 px-2.5 py-1 text-xs",
        lg: "h-auto min-w-0 px-5 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
