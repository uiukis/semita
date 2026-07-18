"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { ModelProvider, UseCase } from "@/data/types";
import { usePathname, useRouter } from "@/i18n/navigation";

type SortOption = "recommended" | "cheapest" | "context";

export function FilterBar({
  providers,
  useCases,
}: {
  providers: ModelProvider[];
  useCases: UseCase[];
}) {
  const t = useTranslations("models");
  const tu = useTranslations("useCases");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentProvider = searchParams.get("provider") ?? "";
  const currentUseCase = searchParams.get("use") ?? "";
  const currentSort = (searchParams.get("sort") as SortOption) ?? "recommended";
  const currentQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(currentQuery);

  const sortLabels: Record<SortOption, string> = {
    recommended: t("sortRecommended"),
    cheapest: t("sortCheapest"),
    context: t("sortContext"),
  };

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = query.trim();
      if (next === currentQuery) {
        return;
      }
      updateParam("q", next);
    }, 250);
    return () => window.clearTimeout(handle);
    // Intentionally sync draft → URL only; clear/reset handled by the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const selectClass =
    "w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-foreground outline-none transition-colors hover:border-accent/40 focus:border-accent sm:w-auto";

  const hasFilters =
    currentProvider ||
    currentUseCase ||
    currentSort !== "recommended" ||
    currentQuery;

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="w-full rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted hover:border-accent/40 focus:border-accent"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          aria-label={t("filterProvider")}
          value={currentProvider}
          onChange={(event) => updateParam("provider", event.target.value)}
          className={selectClass}
        >
          <option value="">{t("allProviders")}</option>
          {providers.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>

        <select
          aria-label={t("filterUseCase")}
          value={currentUseCase}
          onChange={(event) => updateParam("use", event.target.value)}
          className={selectClass}
        >
          <option value="">{t("allUseCases")}</option>
          {useCases.map((useCase) => (
            <option key={useCase} value={useCase}>
              {tu(useCase)}
            </option>
          ))}
        </select>

        <select
          aria-label={t("sortBy")}
          value={currentSort}
          onChange={(event) => updateParam("sort", event.target.value)}
          className={selectClass}
        >
          {(Object.keys(sortLabels) as SortOption[]).map((option) => (
            <option key={option} value={option}>
              {sortLabels[option]}
            </option>
          ))}
        </select>

        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              startTransition(() => {
                router.replace(pathname, { scroll: false });
              });
            }}
            className="self-start rounded-full px-3 py-1.5 text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline sm:self-auto"
          >
            {t("clearFilters")}
          </button>
        ) : null}
      </div>
    </div>
  );
}
