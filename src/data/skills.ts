import type { Locale } from "./types";

export type SkillEntry = {
  id: string;
  kind: "workflow" | "mcp" | "runtime";
  audience: "builder" | "writer" | "lead" | "private" | "student";
  href: string;
  modelSlugs: string[];
  content: Record<
    Locale,
    {
      title: string;
      summary: string;
      when: string;
    }
  >;
};

export const skillEntries: SkillEntry[] = [
  {
    id: "cursor-agent",
    kind: "workflow",
    audience: "builder",
    href: "/apply",
    modelSlugs: ["claude-sonnet-5", "gpt-5", "qwen3-coder-30b"],
    content: {
      en: {
        title: "IDE agent loop",
        summary:
          "Scoped edits, tests first, no secrets in chat — the Apply coding recipe.",
        when: "Daily shipping in Cursor / VS Code.",
      },
      "pt-br": {
        title: "Loop de agent na IDE",
        summary:
          "Edições focadas, testes primeiro, sem segredos no chat — receita Apply de código.",
        when: "Entrega diária no Cursor / VS Code.",
      },
    },
  },
  {
    id: "ollama-runtime",
    kind: "runtime",
    audience: "private",
    href: "/hardware",
    modelSlugs: ["gemma3-12b", "qwen3-8b", "phi4-mini"],
    content: {
      en: {
        title: "Ollama local runtime",
        summary:
          "Pull a Semita ollamaTag, match hardware tier, keep sensitive drafts offline.",
        when: "Privacy-first chat and notes on your laptop.",
      },
      "pt-br": {
        title: "Runtime local Ollama",
        summary:
          "Puxe a ollamaTag do Semita, combine o tier de hardware, mantenha rascunhos sensíveis offline.",
        when: "Chat e notas com privacidade no notebook.",
      },
    },
  },
  {
    id: "filesystem-mcp",
    kind: "mcp",
    audience: "builder",
    href: "/apply",
    modelSlugs: ["gpt-4.1", "claude-sonnet-5"],
    content: {
      en: {
        title: "Filesystem MCP (pattern)",
        summary:
          "Let an agent read/write project files through a controlled MCP instead of pasting whole repos.",
        when: "Repo-aware assistants with explicit allowlists.",
      },
      "pt-br": {
        title: "MCP de filesystem (padrão)",
        summary:
          "Deixe um agent ler/escrever arquivos via MCP controlado em vez de colar o repo inteiro.",
        when: "Assistentes cientes do repo com allowlists explícitas.",
      },
    },
  },
  {
    id: "browser-mcp",
    kind: "mcp",
    audience: "builder",
    href: "/models?use=vision&sort=recommended",
    modelSlugs: ["gpt-4.1", "gemini-2-5-flash"],
    content: {
      en: {
        title: "Browser / screenshot MCP (pattern)",
        summary:
          "Capture UI state for vision models — schema-first extraction beats “describe this”.",
        when: "QA, design QA and doc extraction from live pages.",
      },
      "pt-br": {
        title: "MCP de browser / screenshot (padrão)",
        summary:
          "Capture estado de UI para modelos de visão — extração com schema bate “descreva isto”.",
        when: "QA, design QA e extração de docs em páginas ao vivo.",
      },
    },
  },
  {
    id: "cheap-router",
    kind: "workflow",
    audience: "lead",
    href: "/models?host=api&use=cost-effective&sort=cheapest",
    modelSlugs: ["gpt-4o-mini", "gemini-2-5-flash"],
    content: {
      en: {
        title: "Cheap default + escalate",
        summary:
          "Route routine jobs to cost-effective models; escalate only low-confidence cases.",
        when: "High-volume ops and internal bots.",
      },
      "pt-br": {
        title: "Default barato + escalar",
        summary:
          "Encaminhe jobs rotineiros a modelos baratos; escale só casos de baixa confiança.",
        when: "Ops de alto volume e bots internos.",
      },
    },
  },
  {
    id: "writing-critique",
    kind: "workflow",
    audience: "writer",
    href: "/models?use=writing&sort=recommended",
    modelSlugs: ["claude-sonnet-5", "gpt-5"],
    content: {
      en: {
        title: "Draft → critique passes",
        summary:
          "Separate outline, draft and harsh editor roles so the model never owns the byline.",
        when: "Articles, docs and customer-facing copy.",
      },
      "pt-br": {
        title: "Passagens rascunho → crítica",
        summary:
          "Separe papéis de outline, rascunho e editor duro para o modelo nunca assinar no seu lugar.",
        when: "Artigos, docs e copy para cliente.",
      },
    },
  },
  {
    id: "study-quiz",
    kind: "workflow",
    audience: "student",
    href: "/learn/first-useful-prompt",
    modelSlugs: ["gpt-4o-mini", "gemma3-12b"],
    content: {
      en: {
        title: "Quiz yourself loop",
        summary:
          "Concept map → quiz → answer without looking — never submit unreworked AI prose.",
        when: "Exams, certifications and deep reading.",
      },
      "pt-br": {
        title: "Loop de se autoavaliar",
        summary:
          "Mapa de conceitos → quiz → responder sem olhar — nunca entregue prosa de IA sem reescrever.",
        when: "Provas, certificações e leitura profunda.",
      },
    },
  },
  {
    id: "eval-harness",
    kind: "workflow",
    audience: "lead",
    href: "/learn/tiny-eval-set",
    modelSlugs: ["gpt-5", "claude-sonnet-5", "gpt-4o-mini"],
    content: {
      en: {
        title: "Tiny eval harness",
        summary:
          "Freeze 10–30 real tasks; compare quality, latency and cost like Mini Benchmark.",
        when: "Choosing or changing a default model for a team.",
      },
      "pt-br": {
        title: "Harness de eval mínimo",
        summary:
          "Congele 10–30 tarefas reais; compare qualidade, latência e custo como o Mini Benchmark.",
        when: "Escolher ou trocar o modelo padrão de um time.",
      },
    },
  },
];

export function getSkillContent(entry: SkillEntry, locale: Locale) {
  return entry.content[locale] ?? entry.content.en;
}
