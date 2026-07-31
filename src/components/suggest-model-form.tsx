"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ISSUE_BASE =
  "https://github.com/uiukis/semita/issues/new?template=data_update.md";

type Kind = "new-local" | "cloud-pricing" | "local-hardware" | "other";

export function SuggestModelForm() {
  const t = useTranslations("suggest");
  const [name, setName] = useState("");
  const [ollamaTag, setOllamaTag] = useState("");
  const [kind, setKind] = useState<Kind>("new-local");
  const [notes, setNotes] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const href = useMemo(() => {
    const title = name.trim()
      ? `Data update: ${name.trim()}`
      : "Data update: new / missing model";
    const body = [
      `### Model`,
      `- Name / slug: ${name.trim() || "(fill)"}`,
      `- Ollama tag: ${ollamaTag.trim() || "n/a"}`,
      `- Kind: ${kind}`,
      ``,
      `### What is wrong / missing`,
      notes.trim() || "(describe)",
      ``,
      `### Official source`,
      `- URL: ${sourceUrl.trim() || "(required)"}`,
      `- Checked: ${new Date().toISOString().slice(0, 10)}`,
    ].join("\n");

    const params = new URLSearchParams({
      title,
      body,
    });
    return `${ISSUE_BASE}&${params.toString()}`;
  }, [kind, name, notes, ollamaTag, sourceUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="block space-y-1.5 text-sm">
          <span className="text-muted">{t("nameLabel")}</span>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("namePlaceholder")}
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-muted">{t("tagLabel")}</span>
          <Input
            value={ollamaTag}
            onChange={(event) => setOllamaTag(event.target.value)}
            placeholder="gemma3:12b"
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-muted">{t("kindLabel")}</span>
          <select
            className="flex h-9 w-full rounded-md border border-line bg-background px-3 text-sm"
            value={kind}
            onChange={(event) => setKind(event.target.value as Kind)}
          >
            <option value="new-local">{t("kinds.newLocal")}</option>
            <option value="cloud-pricing">{t("kinds.cloudPricing")}</option>
            <option value="local-hardware">{t("kinds.localHardware")}</option>
            <option value="other">{t("kinds.other")}</option>
          </select>
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-muted">{t("notesLabel")}</span>
          <textarea
            className="min-h-24 w-full rounded-md border border-line bg-background px-3 py-2 text-sm"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t("notesPlaceholder")}
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-muted">{t("sourceLabel")}</span>
          <Input
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            placeholder="https://ollama.com/library/..."
          />
        </label>
        <Button asChild className="w-full sm:w-auto">
          <a href={href} target="_blank" rel="noopener noreferrer">
            {t("submit")}
          </a>
        </Button>
        <p className="text-xs text-muted">{t("disclaimer")}</p>
      </CardContent>
    </Card>
  );
}
