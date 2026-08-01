import type { Locale } from "./types";

export type SkillEntry = {
  id: string;
  kind: "workflow" | "mcp" | "runtime";
  audience: "builder" | "writer" | "lead" | "private" | "student";
  href: string;
  installUrl?: string;
  modelSlugs: string[];
  content: Record<
    Locale,
    {
      title: string;
      summary: string;
      when: string;
      install?: string;
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
    installUrl: "https://ollama.com/download",
    modelSlugs: ["gemma3-12b", "qwen3-8b", "phi4-mini"],
    content: {
      en: {
        title: "Ollama local runtime",
        summary:
          "Pull a Semita ollamaTag, match hardware tier, keep sensitive drafts offline.",
        when: "Privacy-first chat and notes on your laptop.",
        install: "Install Ollama, then pull tags from model pages.",
      },
      "pt-br": {
        title: "Runtime local Ollama",
        summary:
          "Puxe a ollamaTag do Semita, combine o tier de hardware, mantenha rascunhos sensíveis offline.",
        when: "Chat e notas com privacidade no notebook.",
        install: "Instale o Ollama e puxe as tags das páginas dos modelos.",
      },
    },
  },
  {
    id: "filesystem-mcp",
    kind: "mcp",
    audience: "builder",
    href: "/models?use=coding&sort=recommended",
    installUrl:
      "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    modelSlugs: ["gpt-4.1", "claude-sonnet-5"],
    content: {
      en: {
        title: "Filesystem MCP",
        summary:
          "Official MCP server for controlled read/write — prefer allowlists over pasting whole repos.",
        when: "Repo-aware assistants with explicit paths.",
        install: "Add @modelcontextprotocol/server-filesystem to your MCP client config.",
      },
      "pt-br": {
        title: "MCP de filesystem",
        summary:
          "Server MCP oficial de leitura/escrita controlada — prefira allowlists a colar o repo inteiro.",
        when: "Assistentes cientes do repo com caminhos explícitos.",
        install: "Adicione @modelcontextprotocol/server-filesystem na config do cliente MCP.",
      },
    },
  },
  {
    id: "github-mcp",
    kind: "mcp",
    audience: "builder",
    href: "/models?use=coding&sort=recommended",
    installUrl:
      "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
    modelSlugs: ["gpt-5", "claude-sonnet-5"],
    content: {
      en: {
        title: "GitHub MCP",
        summary:
          "Issues, PRs and repo metadata through MCP — keep tokens out of chat prompts.",
        when: "Agents that open PRs or triage issues.",
        install: "Configure @modelcontextprotocol/server-github with a fine-scoped PAT.",
      },
      "pt-br": {
        title: "MCP do GitHub",
        summary:
          "Issues, PRs e metadados do repo via MCP — mantenha tokens fora do prompt.",
        when: "Agents que abrem PRs ou fazem triagem de issues.",
        install: "Configure @modelcontextprotocol/server-github com um PAT de escopo fino.",
      },
    },
  },
  {
    id: "memory-mcp",
    kind: "mcp",
    audience: "lead",
    href: "/apply",
    installUrl:
      "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
    modelSlugs: ["gpt-4.1", "gemini-2-5-flash"],
    content: {
      en: {
        title: "Memory MCP",
        summary:
          "Persist small knowledge graphs for recurring projects — still verify before you ship.",
        when: "Long-running ops / research threads.",
        install: "Add @modelcontextprotocol/server-memory to the MCP client.",
      },
      "pt-br": {
        title: "MCP de memória",
        summary:
          "Persista grafos pequenos de conhecimento em projetos recorrentes — ainda assim verifique antes de publicar.",
        when: "Threads longas de ops / pesquisa.",
        install: "Adicione @modelcontextprotocol/server-memory no cliente MCP.",
      },
    },
  },
  {
    id: "playwright-mcp",
    kind: "mcp",
    audience: "builder",
    href: "/models?use=vision&sort=recommended",
    installUrl: "https://github.com/microsoft/playwright-mcp",
    modelSlugs: ["gpt-4.1", "gemini-2-5-flash"],
    content: {
      en: {
        title: "Playwright MCP",
        summary:
          "Browse and snapshot pages for vision / QA agents — schema-first beats “describe this”.",
        when: "UI QA, design checks and live-page extraction.",
        install: "Follow the Playwright MCP install guide for your client.",
      },
      "pt-br": {
        title: "MCP Playwright",
        summary:
          "Navegue e capture páginas para agents de visão / QA — schema primeiro bate “descreva isto”.",
        when: "QA de UI, checagens de design e extração em páginas ao vivo.",
        install: "Siga o guia de install do Playwright MCP no seu cliente.",
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
