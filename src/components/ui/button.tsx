import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-[#06130a] hover:bg-accent-dim hover:shadow-lg hover:shadow-accent/20",
        outline:
          "border-line bg-surface text-foreground hover:border-accent/40 hover:bg-surface-raised",
        secondary:
          "border-line bg-surface-raised text-foreground hover:border-accent/40",
        ghost:
          "text-muted hover:bg-surface-raised hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "rounded-none text-muted underline-offset-4 hover:text-accent hover:underline",
      },
      size: {
        default: "h-auto gap-1.5 px-4 py-2",
        xs: "h-auto gap-1 px-2.5 py-1 text-xs",
        sm: "h-auto gap-1 px-3 py-1.5 text-sm",
        lg: "h-auto gap-1.5 px-6 py-3 text-sm font-semibold",
        icon: "size-8",
        "icon-xs": "size-6",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
