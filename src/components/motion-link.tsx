"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

type Href = ComponentProps<typeof Link>["href"];

export function MotionLink({
  href,
  className,
  children,
  ...rest
}: {
  href: Href;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-flex">
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    </motion.div>
  );
}

export function MotionCardLink({
  href,
  className,
  children,
  style,
}: {
  href: Href;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Link href={href} className={className} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.012 }}
      whileTap={{ scale: 0.992 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="h-full"
    >
      <Link href={href} className={className} style={style}>
        {children}
      </Link>
    </motion.div>
  );
}
