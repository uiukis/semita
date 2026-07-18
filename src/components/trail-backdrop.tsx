"use client";

import { motion, useReducedMotion } from "motion/react";

export function TrailBackdrop() {
  const reduce = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 1200 400"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      animate={
        reduce
          ? undefined
          : {
              x: [0, 8, 2, -5, 0],
              y: [0, -4, 3, -2, 0],
              rotate: [0, 0.2, 0, -0.15, 0],
              scale: [1, 1.008, 1.004, 1.01, 1],
            }
      }
      transition={
        reduce
          ? undefined
          : {
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
      style={{ transformOrigin: "50% 50%" }}
    >
      <motion.path
        d="M-50 380C150 380 250 260 420 260C590 260 640 140 820 140C1000 140 1080 40 1250 40"
        stroke="var(--accent)"
        strokeOpacity="0.28"
        strokeWidth="2"
        strokeDasharray="6 10"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={
          reduce
            ? undefined
            : {
                pathLength: 1,
                opacity: [0.2, 0.45, 0.2],
                strokeDashoffset: [0, -24],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                pathLength: { duration: 1.6, ease: "easeOut" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                strokeDashoffset: {
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "linear",
                },
              }
        }
      />
      <motion.path
        d="M-50 320C180 320 300 200 470 220C640 240 720 100 900 110C1030 117 1120 60 1250 80"
        stroke="var(--accent)"
        strokeOpacity="0.12"
        strokeWidth="2"
        strokeDasharray="2 12"
        initial={reduce ? false : { pathLength: 0 }}
        animate={reduce ? undefined : { pathLength: 1 }}
        transition={
          reduce ? undefined : { duration: 2, delay: 0.2, ease: "easeOut" }
        }
      />
      <motion.circle
        cx="420"
        cy="260"
        r="4"
        fill="var(--accent)"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={
          reduce
            ? undefined
            : { scale: 1, opacity: [0.4, 0.8, 0.4] }
        }
        transition={
          reduce
            ? undefined
            : {
                scale: { duration: 0.4, delay: 0.9 },
                opacity: {
                  duration: 2.4,
                  delay: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      />
      <motion.circle
        cx="820"
        cy="140"
        r="4"
        fill="var(--accent)"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={
          reduce
            ? undefined
            : { scale: 1, opacity: [0.4, 0.8, 0.4] }
        }
        transition={
          reduce
            ? undefined
            : {
                scale: { duration: 0.4, delay: 1.2 },
                opacity: {
                  duration: 2.4,
                  delay: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      />
    </motion.svg>
  );
}
