"use client";

import { motion, useReducedMotion } from "motion/react";

type Word = { text: string; accent: boolean };

function buildWords(lead: string, accent: string, tail: string): Word[] {
  const leadWords = lead
    .split(" ")
    .filter(Boolean)
    .map((text) => ({ text, accent: false }));
  const accentWords = accent
    .split(" ")
    .filter(Boolean)
    .map((text) => ({ text, accent: true }));

  let rest = tail;
  const punct = tail.match(/^[,.;:!?]+/)?.[0] ?? "";
  if (punct && accentWords.length > 0) {
    accentWords[accentWords.length - 1].text += punct;
    rest = tail.slice(punct.length);
  }
  const tailWords = rest
    .split(" ")
    .filter(Boolean)
    .map((text) => ({ text, accent: false }));

  return [...leadWords, ...accentWords, ...tailWords];
}

export function HeroTitle({
  lead,
  accent,
  tail,
  className,
}: {
  lead: string;
  accent: string;
  tail: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = buildWords(lead, accent, tail);

  if (reduce) {
    return (
      <h1 className={className}>
        {lead}{" "}
        <span className="text-gradient-animated">{accent}</span>
        {tail}
      </h1>
    );
  }

  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word.text}-${index}`}
          className={[
            "inline-block will-change-transform",
            word.accent ? "text-gradient-animated" : "",
          ].join(" ")}
          variants={{
            hidden: { opacity: 0, y: "0.55em", rotateX: 45 },
            show: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: { type: "spring", stiffness: 320, damping: 26 },
            },
          }}
        >
          {word.text}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.h1>
  );
}
