"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Option = { slug: string; name: string; provider: string };

const MAX_SELECTION = 4;

export function CompareSelector({ options }: { options: Option[] }) {
  const t = useTranslations("compare");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();

  const selected = (searchParams.get("models") ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  function toggle(slug: string) {
    const isSelected = selected.includes(slug);
    let next: string[];
    if (isSelected) {
      next = selected.filter((item) => item !== slug);
    } else {
      if (selected.length >= MAX_SELECTION) {
        return;
      }
      next = [...selected, slug];
    }
    const params = new URLSearchParams(searchParams.toString());
    if (next.length > 0) {
      params.set("models", next.join(","));
    } else {
      params.delete("models");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t("selectorLabel")}>
      {options.map((option, index) => {
        const isSelected = selected.includes(option.slug);
        const isDisabled = !isSelected && selected.length >= MAX_SELECTION;
        const className = cn(
          buttonVariants({
            variant: isSelected ? "default" : "outline",
            size: "default",
          }),
          isDisabled ? "cursor-not-allowed opacity-40" : "",
        );

        if (reduce) {
          return (
            <Button
              key={option.slug}
              type="button"
              variant={isSelected ? "default" : "outline"}
              onClick={() => toggle(option.slug)}
              disabled={isDisabled}
              aria-pressed={isSelected}
            >
              {option.name}
            </Button>
          );
        }

        return (
          <motion.button
            key={option.slug}
            type="button"
            onClick={() => toggle(option.slug)}
            disabled={isDisabled}
            aria-pressed={isSelected}
            className={className}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, scale: isSelected ? 1.03 : 1 }}
            whileHover={isDisabled ? undefined : { y: -2 }}
            whileTap={isDisabled ? undefined : { scale: 0.97 }}
            transition={{
              delay: index * 0.035,
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
              scale: { type: "spring", stiffness: 420, damping: 28 },
            }}
          >
            {option.name}
          </motion.button>
        );
      })}
    </div>
  );
}
