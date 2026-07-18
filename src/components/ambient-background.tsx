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
        className="absolute -left-[20%] -top-[25%] h-[70rem] w-[70rem] rounded-full bg-accent/[0.07] blur-[140px]"
        animate={
          reduce
            ? undefined
            : {
                x: [0, 70, 15, 0],
                y: [0, 35, 80, 0],
                scale: [1, 1.08, 0.96, 1],
              }
        }
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -right-[25%] top-[30%] h-[62rem] w-[62rem] rounded-full bg-emerald-300/[0.045] blur-[150px]"
        animate={
          reduce
            ? undefined
            : {
                x: [0, -65, -20, 0],
                y: [0, -50, 60, 0],
                scale: [0.95, 1.05, 1, 0.95],
              }
        }
        transition={{
          duration: 29,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-35%] left-[20%] h-[55rem] w-[55rem] rounded-full bg-accent/[0.035] blur-[160px]"
        animate={
          reduce
            ? undefined
            : {
                x: [0, 80, -30, 0],
                y: [0, -70, -20, 0],
              }
        }
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
    </div>
  );
}
