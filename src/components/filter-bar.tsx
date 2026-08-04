"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type {
  DeploymentMode,
  HardwarePlatform,
  HardwareTier,
  ModelProvider,
  UseCase,
} from "@/data/types";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "recommended" | "cheapest" | "context" | "recent";

const ALL_OPTIONS_VALUE = "__all__";

interface FilterOption {
  label: string;
  value: string;
}

function FilterSelect({
  ariaLabel,
  value,
  placeholder,
  options,
  onValueChange,
  hasAllOption = true,
}: {
  ariaLabel: string;
  value: string;
  placeholder: string;
  options: FilterOption[];
  onValueChange: (value: string) => void;
  hasAllOption?: boolean;
}) {
  return (
    <Select
      value={value || (hasAllOption ? ALL_OPTIONS_VALUE : undefined)}
      onValueChange={(nextValue) =>
        onValueChange(nextValue === ALL_OPTIONS_VALUE ? "" : nextValue)
      }
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-auto w-full rounded-full border-line bg-surface px-4 py-2 text-foreground shadow-none transition-all hover:border-accent/50 hover:bg-surface-raised focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 sm:w-auto"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="start"
        className="min-w-[var(--radix-select-trigger-width)] rounded-xl border border-line bg-surface-raised p-1 text-foreground shadow-2xl shadow-black/40"
      >
        {hasAllOption ? (
          <SelectItem
            value={ALL_OPTIONS_VALUE}
            className="rounded-lg px-3 py-2 pr-9 focus:bg-accent-soft focus:text-foreground data-[state=checked]:text-accent"
          >
            {placeholder}
          </SelectItem>
        ) : null}
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="rounded-lg px-3 py-2 pr-9 focus:bg-accent-soft focus:text-foreground data-[state=checked]:text-accent"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FilterBar({
  providers,
  useCases,
}: {
  providers: ModelProvider[];
  useCases: UseCase[];
}) {
  const t = useTranslations("models");
  const tu = useTranslations("useCases");
  const th = useTranslations("hardware");
  const td = useTranslations("deployment");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentProvider = searchParams.get("provider") ?? "";
  const currentUseCase = searchParams.get("use") ?? "";
  const currentSort = (searchParams.get("sort") as SortOption) ?? "recommended";
  const currentQuery = searchParams.get("q") ?? "";
  const currentHost = searchParams.get("host") ?? "";
  const currentTier = searchParams.get("tier") ?? "";
  const currentPlatform = searchParams.get("platform") ?? "";
  const currentSuite = searchParams.get("suite") ?? "";
  const [query, setQuery] = useState(currentQuery);

  const sortLabels: Record<SortOption, string> = {
    recommended: t("sortRecommended"),
    cheapest: t("sortCheapest"),
    context: t("sortContext"),
    recent: t("sortRecent"),
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

  const hasFilters =
    currentProvider ||
    currentUseCase ||
    currentSort !== "recommended" ||
    currentQuery ||
    currentHost ||
    currentTier ||
    currentPlatform ||
    currentSuite;

  const hostOptions: Array<DeploymentMode | ""> = ["", "local", "api", "both"];
  const tierOptions: Array<HardwareTier | ""> = ["", "entry", "mid", "heavy"];
  const platformOptions: Array<HardwarePlatform | ""> = [
    "",
    "nvidia",
    "amd",
    "apple",
    "cpu",
  ];

  return (
    <div className="flex flex-col gap-3">
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <FilterSelect
          ariaLabel={t("filterHost")}
          value={currentHost}
          placeholder={t("allHosts")}
          options={hostOptions.filter(Boolean).map((host) => ({
            value: host,
            label: td(host),
          }))}
          onValueChange={(value) => updateParam("host", value)}
        />

        <FilterSelect
          ariaLabel={t("filterTier")}
          value={currentTier}
          placeholder={t("allTiers")}
          options={tierOptions.filter(Boolean).map((tier) => ({
            value: tier,
            label: th(`tiers.${tier}`),
          }))}
          onValueChange={(value) => updateParam("tier", value)}
        />

        <FilterSelect
          ariaLabel={t("filterPlatform")}
          value={currentPlatform}
          placeholder={t("allPlatforms")}
          options={platformOptions.filter(Boolean).map((platform) => ({
            value: platform,
            label: th(`platforms.${platform}`),
          }))}
          onValueChange={(value) => updateParam("platform", value)}
        />

        <FilterSelect
          ariaLabel={t("filterProvider")}
          value={currentProvider}
          placeholder={t("allProviders")}
          options={providers.map((provider) => ({
            value: provider,
            label: provider,
          }))}
          onValueChange={(value) => updateParam("provider", value)}
        />

        <FilterSelect
          ariaLabel={t("filterUseCase")}
          value={currentUseCase}
          placeholder={t("allUseCases")}
          options={useCases.map((useCase) => ({
            value: useCase,
            label: tu(useCase),
          }))}
          onValueChange={(value) => updateParam("use", value)}
        />

        <FilterSelect
          ariaLabel={t("filterSuite")}
          value={currentSuite}
          placeholder={t("allSuites")}
          options={[{ value: "mini", label: t("suiteMini") }]}
          onValueChange={(value) => updateParam("suite", value)}
        />

        <FilterSelect
          ariaLabel={t("sortBy")}
          value={currentSort}
          placeholder={sortLabels.recommended}
          options={(Object.keys(sortLabels) as SortOption[]).map((option) => ({
            value: option,
            label: sortLabels[option],
          }))}
          onValueChange={(value) => updateParam("sort", value)}
          hasAllOption={false}
        />

        {hasFilters ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="self-start sm:self-auto"
            onClick={() => {
              setQuery("");
              startTransition(() => {
                router.replace(pathname, { scroll: false });
              });
            }}
          >
            {t("clearFilters")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
