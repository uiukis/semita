import type { Locale } from "@/data/types";

function intlLocale(locale: Locale): string {
  return locale === "pt-br" ? "pt-BR" : "en-US";
}

export function formatUsdPerMillion(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(value);
}

export function formatContextWindow(tokens: number, locale: Locale): string {
  const numberLocale = intlLocale(locale);
  if (tokens >= 1000000) {
    const millions = tokens / 1000000;
    return `${new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 1 }).format(millions)}M tokens`;
  }
  if (tokens >= 1000) {
    return `${Math.round(tokens / 1000)}k tokens`;
  }
  return `${tokens} tokens`;
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle: "medium",
  }).format(date);
}
