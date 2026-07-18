"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { MouseEvent, ReactNode } from "react";

export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), {
    stiffness: 240,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), {
    stiffness: 240,
    damping: 22,
  });
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${px}px ${py}px, rgba(74, 222, 128, 0.1), transparent 70%)`;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    px.set(x);
    py.set(y);
    mx.set(x / rect.width);
    my.set(y / rect.height);
  }

  function handleMouseLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      {children}
    </motion.div>
  );
}
