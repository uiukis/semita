"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useReducedMotion } from "motion/react";

export function LottiePlayer({
  src,
  className,
  loop = true,
  label,
}: {
  src: string;
  className?: string;
  loop?: boolean;
  label?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        aria-hidden={label ? undefined : true}
        aria-label={label}
        className={className}
        style={{
          background:
            "radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 68%)",
        }}
      />
    );
  }

  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay
      className={className}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
