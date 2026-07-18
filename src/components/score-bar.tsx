"use client";

import { motion, useReducedMotion } from "motion/react";

export function ScoreBar({
  value,
  label,
  delay = 0,
}: {
  value: number;
  label: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const pct = Math.max(0, Math.min(100, value * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-foreground">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-raised">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={reduce ? false : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  );
}
