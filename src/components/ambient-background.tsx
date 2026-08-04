"use client";

import { motion, useReducedMotion } from "motion/react";

export function AmbientBackground() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute -left-[20%] -top-[25%] h-[70rem] w-[70rem] rounded-full bg-accent/[0.11] blur-[140px]"
        animate={
          reduce
            ? undefined
            : {
                x: [0, 90, 20, 0],
                y: [0, 45, 95, 0],
                scale: [1, 1.12, 0.94, 1],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -right-[25%] top-[30%] h-[62rem] w-[62rem] rounded-full bg-emerald-300/[0.08] blur-[150px]"
        animate={
          reduce
            ? undefined
            : {
                x: [0, -80, -25, 0],
                y: [0, -60, 70, 0],
                scale: [0.94, 1.08, 1, 0.94],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-35%] left-[20%] h-[55rem] w-[55rem] rounded-full bg-accent/[0.07] blur-[160px]"
        animate={
          reduce
            ? undefined
            : {
                x: [0, 95, -40, 0],
                y: [0, -85, -25, 0],
              }
        }
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
    </div>
  );
}
