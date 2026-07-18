"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export function ShareCompareButton() {
  const t = useTranslations("compare");
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
    >
      {copied ? t("copied") : t("share")}
    </button>
  );
}
