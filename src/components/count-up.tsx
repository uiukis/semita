"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export function CountUp({
  to,
  suffix = "",
  duration = 1.6,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce || !ref.current) {
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(value)}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {to}
      {suffix}
    </span>
  );
}
