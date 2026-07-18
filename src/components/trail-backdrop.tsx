"use client";

import { motion, useReducedMotion } from "motion/react";

const MAIN_PATH =
  "M-50 380C150 380 250 260 420 260C590 260 640 140 820 140C1000 140 1080 40 1250 40";
const SECONDARY_PATH =
  "M-50 320C180 320 300 200 470 220C640 240 720 100 900 110C1030 117 1120 60 1250 80";

const PARTICLES = [
  { cx: 180, cy: 330, r: 2, duration: 4.2, delay: 0 },
  { cx: 340, cy: 210, r: 1.6, duration: 5.1, delay: 0.8 },
  { cx: 560, cy: 250, r: 2.2, duration: 4.6, delay: 1.4 },
  { cx: 700, cy: 120, r: 1.5, duration: 5.6, delay: 0.4 },
  { cx: 960, cy: 90, r: 2, duration: 4.9, delay: 1.9 },
  { cx: 1100, cy: 160, r: 1.4, duration: 5.4, delay: 1.1 },
];

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
        d={MAIN_PATH}
        stroke="var(--accent)"
        strokeOpacity="0.55"
        strokeWidth="2.5"
        strokeDasharray="7 11"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          reduce
            ? undefined
            : {
                pathLength: 1,
                strokeDashoffset: [0, -36],
                opacity: [0.5, 0.9, 0.5],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                pathLength: { duration: 2, ease: [0.16, 1, 0.3, 1] },
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
        d={SECONDARY_PATH}
        stroke="var(--accent)"
        strokeOpacity="0.28"
        strokeWidth="2"
        strokeDasharray="3 14"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          reduce
            ? undefined
            : {
                pathLength: 1,
                strokeDashoffset: [0, 28],
                opacity: [0.2, 0.45, 0.2],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                pathLength: { duration: 2.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
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

      {!reduce && (
        <>
          <circle
            r="5.5"
            fill="var(--accent)"
            style={{ filter: "drop-shadow(0 0 8px var(--accent))" }}
          >
            <animateMotion
              dur="9s"
              repeatCount="indefinite"
              path={MAIN_PATH}
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.45 0 0.55 1"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;1;0"
              keyTimes="0;0.08;0.5;0.92;1"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            r="11"
            fill="none"
            stroke="var(--accent)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          >
            <animateMotion
              dur="9s"
              repeatCount="indefinite"
              path={MAIN_PATH}
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.45 0 0.55 1"
            />
            <animate
              attributeName="opacity"
              values="0;0.6;0.6;0.6;0"
              keyTimes="0;0.08;0.5;0.92;1"
              dur="9s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="9;13;9"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="3" fill="var(--accent)" opacity="0.7">
            <animateMotion
              dur="13s"
              begin="2.5s"
              repeatCount="indefinite"
              path={SECONDARY_PATH}
            />
            <animate
              attributeName="opacity"
              values="0;0.7;0.7;0"
              keyTimes="0;0.1;0.9;1"
              dur="13s"
              begin="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

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
        cx="420"
        cy="260"
        r="5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
        initial={false}
        animate={
          reduce
            ? undefined
            : { scale: [1, 3.2], opacity: [0.5, 0] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.2, repeat: Infinity, ease: "easeOut" }
        }
        style={{ transformOrigin: "420px 260px" }}
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
      <motion.circle
        cx="820"
        cy="140"
        r="5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
        initial={false}
        animate={
          reduce
            ? undefined
            : { scale: [1, 3.2], opacity: [0.5, 0] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.6, delay: 0.4, repeat: Infinity, ease: "easeOut" }
        }
        style={{ transformOrigin: "820px 140px" }}
      />

      {!reduce &&
        PARTICLES.map((particle) => (
          <motion.circle
            key={`${particle.cx}-${particle.cy}`}
            cx={particle.cx}
            cy={particle.cy}
            r={particle.r}
            fill="var(--accent)"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.55, 0],
              y: [0, -14, -26],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
    </motion.svg>
  );
}
