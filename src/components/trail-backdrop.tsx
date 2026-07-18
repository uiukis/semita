"use client";

import { motion, useReducedMotion } from "motion/react";

export function TrailBackdrop() {
  const reduce = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 1200 400"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[min(100%,28rem)] w-full opacity-90"
      preserveAspectRatio="xMidYMid slice"
      initial={false}
      animate={
        reduce
          ? undefined
          : {
              x: [0, 14, 4, -10, 0],
              y: [0, -8, 6, -4, 0],
              rotate: [0, 0.35, 0, -0.25, 0],
              scale: [1, 1.015, 1.008, 1.02, 1],
            }
      }
      transition={
        reduce
          ? undefined
          : {
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
      style={{ transformOrigin: "50% 45%" }}
    >
      <motion.path
        d="M-50 380C150 380 250 260 420 260C590 260 640 140 820 140C1000 140 1080 40 1250 40"
        stroke="var(--accent)"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeDasharray="7 11"
        initial={false}
        animate={
          reduce
            ? undefined
            : {
                strokeDashoffset: [0, -36],
                opacity: [0.35, 0.7, 0.35],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                strokeDashoffset: {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "linear",
                },
                opacity: {
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      />
      <motion.path
        d="M-50 320C180 320 300 200 470 220C640 240 720 100 900 110C1030 117 1120 60 1250 80"
        stroke="var(--accent)"
        strokeOpacity="0.2"
        strokeWidth="2"
        strokeDasharray="3 14"
        initial={false}
        animate={
          reduce
            ? undefined
            : {
                strokeDashoffset: [0, 28],
                opacity: [0.15, 0.35, 0.15],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                strokeDashoffset: {
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "linear",
                },
                opacity: {
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      />
      <motion.circle
        cx="420"
        cy="260"
        r="5"
        fill="var(--accent)"
        initial={false}
        animate={
          reduce
            ? undefined
            : {
                scale: [1, 1.35, 1],
                opacity: [0.45, 0.95, 0.45],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      />
      <motion.circle
        cx="820"
        cy="140"
        r="5"
        fill="var(--accent)"
        initial={false}
        animate={
          reduce
            ? undefined
            : {
                scale: [1, 1.4, 1],
                opacity: [0.4, 0.9, 0.4],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.6,
                delay: 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      />
    </motion.svg>
  );
}
