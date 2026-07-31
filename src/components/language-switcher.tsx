"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();

  function switchTo(next: string) {
    if (next === locale) {
      return;
    }
    const query = Object.fromEntries(searchParams.entries());
    router.replace({ pathname, query }, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="relative flex items-center rounded-full border border-line bg-surface p-0.5 text-xs font-medium"
    >
      {routing.locales.map((option) => {
        const isActive = option === locale;
        return (
          <Button
            key={option}
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => switchTo(option)}
            aria-pressed={isActive}
            className={[
              "relative z-10 uppercase",
              isActive
                ? "text-[#06130a] hover:bg-transparent hover:text-[#06130a]"
                : "text-muted hover:bg-transparent hover:text-foreground",
            ].join(" ")}
          >
            {isActive && !reduce ? (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            {isActive && reduce ? (
              <span className="absolute inset-0 -z-10 rounded-full bg-accent" />
            ) : null}
            {option === "pt-br" ? t("pt-br") : t("en")}
          </Button>
        );
      })}
    </div>
  );
}
