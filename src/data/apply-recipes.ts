import type { Locale } from "./types";

export type ApplyRecipe = {
  id: string;
  audience: "builder" | "writer" | "lead" | "private" | "student";
  modelSlugs: string[];
  catalogHref: string;
  content: Record<
    Locale,
    {
      title: string;
      summary: string;
      steps: string[];
      tip: string;
    }
  >;
};

export const applyRecipes: ApplyRecipe[] = [
  {
    id: "cursor-coding",
    audience: "builder",
    modelSlugs: ["claude-sonnet-5", "gpt-5", "qwen3-coder-30b"],
    catalogHref: "/models?use=coding&sort=recommended",
    content: {
      en: {
        title: "Ship code with an IDE assistant",
        summary:
          "Use a strong coding model in Cursor/VS Code for diffs, tests and refactors — then verify with your own suite.",
        steps: [
          "Pick a coding-strong model (cloud for peak quality, local coder for privacy).",
          "Keep prompts scoped: one file or failing test at a time.",
          "Require tests or a repro before accepting large edits.",
          "Never paste secrets or production credentials into the chat.",
        ],
        tip: "Compare two coding models on the same bug before standardizing the team default.",
      },
      "pt-br": {
        title: "Entregar código com assistente na IDE",
        summary:
          "Use um modelo forte em código no Cursor/VS Code para diffs, testes e refactors — e valide com sua suíte.",
        steps: [
          "Escolha um modelo forte em código (nuvem para pico de qualidade, coder local para privacidade).",
          "Mantenha o prompt focado: um arquivo ou teste falhando por vez.",
          "Exija testes ou um repro antes de aceitar edições grandes.",
          "Nunca cole segredos ou credenciais de produção no chat.",
        ],
        tip: "Compare dois modelos de código no mesmo bug antes de padronizar o default do time.",
      },
    },
  },
  {
    id: "ollama-local",
    audience: "private",
    modelSlugs: ["gemma3-12b", "qwen3-8b", "phi4-mini"],
    catalogHref: "/models?host=local&tier=entry&sort=recommended",
    content: {
      en: {
        title: "Private chat on your machine (Ollama)",
        summary:
          "Run an entry-tier open model locally for notes, brainstorming and drafts that should not leave the laptop.",
        steps: [
          "Install Ollama, then pull a tag from the model page (e.g. gemma3:12b).",
          "Match the Semita hardware recipe for your RAM/VRAM before going bigger.",
          "Start with short tasks; raise context only when needed.",
          "Keep cloud APIs for non-sensitive, high-stakes quality bursts.",
        ],
        tip: "Filter Models by host=local and your hardware tier to avoid OOM surprises.",
      },
      "pt-br": {
        title: "Chat privado na sua máquina (Ollama)",
        summary:
          "Rode um modelo open de faixa entry localmente para notas, brainstorm e rascunhos que não devem sair do notebook.",
        steps: [
          "Instale o Ollama e puxe a tag da página do modelo (ex.: gemma3:12b).",
          "Combine com a receita de hardware do Semita para sua RAM/VRAM antes de subir de tamanho.",
          "Comece com tarefas curtas; aumente o contexto só quando precisar.",
          "Reserve APIs na nuvem para picos de qualidade sem dados sensíveis.",
        ],
        tip: "Filtre Modelos por host=local e seu tier de hardware para evitar OOM.",
      },
    },
  },
  {
    id: "cheap-api",
    audience: "lead",
    modelSlugs: ["gpt-4o-mini", "gemini-2-5-flash"],
    catalogHref: "/models?host=api&use=cost-effective&sort=cheapest",
    content: {
      en: {
        title: "High-volume API without burning budget",
        summary:
          "Route routine classification, extraction and short drafts to cost-effective cloud models; escalate only hard cases.",
        steps: [
          "List the top 3 automated jobs and estimate tokens per day.",
          "Pick a cheap default from the catalog; pin the model ID.",
          "Add a quality gate: escalate to a flagship when confidence is low.",
          "Re-check list prices on the provider page before locking spend.",
        ],
        tip: "Input and output are priced differently — verbose answers get expensive fast.",
      },
      "pt-br": {
        title: "API em volume sem queimar orçamento",
        summary:
          "Encaminhe classificação, extração e rascunhos curtos a modelos cloud baratos; escale só os casos difíceis.",
        steps: [
          "Liste as 3 automações principais e estime tokens por dia.",
          "Escolha um default barato no catálogo; fixe o ID do modelo.",
          "Adicione um gate de qualidade: escale para flagship quando a confiança for baixa.",
          "Reconfira preços de lista na página do provedor antes de travar o gasto.",
        ],
        tip: "Entrada e saída têm preços diferentes — respostas verbosas encarecem rápido.",
      },
    },
  },
  {
    id: "writing-loop",
    audience: "writer",
    modelSlugs: ["claude-sonnet-5", "gpt-5", "gemma3-12b"],
    catalogHref: "/models?use=writing&sort=recommended",
    content: {
      en: {
        title: "Draft → critique → own voice",
        summary:
          "Split writing into research, outline, draft and critique passes so the model never owns the byline.",
        steps: [
          "Brief: audience, tone, length, must-include facts.",
          "Ask for an outline first; approve structure before prose.",
          "Draft, then run a second pass as a harsh editor.",
          "Rewrite in your voice; fact-check every claim.",
        ],
        tip: "Local models are great for private journals; cloud flagships for polish under deadline.",
      },
      "pt-br": {
        title: "Rascunho → crítica → sua voz",
        summary:
          "Separe escrita em pesquisa, outline, rascunho e crítica para o modelo nunca assinar no seu lugar.",
        steps: [
          "Brief: público, tom, tamanho, fatos obrigatórios.",
          "Peça um outline primeiro; aprove a estrutura antes da prosa.",
          "Rascunhe e rode uma segunda passagem como editor duro.",
          "Reescreva na sua voz; confira cada afirmação.",
        ],
        tip: "Modelos locais vão bem em diários privados; flagships na nuvem para polir sob prazo.",
      },
    },
  },
  {
    id: "study-coach",
    audience: "student",
    modelSlugs: ["gpt-4o-mini", "gemma3-12b", "qwen3-8b"],
    catalogHref: "/models?use=research&sort=recommended",
    content: {
      en: {
        title: "Learn faster without outsourcing exams",
        summary:
          "Turn dense material into quizzes and analogies — then close the book and explain it yourself.",
        steps: [
          "Paste a section (not a whole book) and ask for a concept map.",
          "Generate 5 quiz questions; answer without looking.",
          "Ask for a counter-argument to your summary.",
          "Never submit AI prose as graded work you have not rewritten.",
        ],
        tip: "Cheap or local models are enough for study loops; save frontier spend for hard proofs.",
      },
      "pt-br": {
        title: "Aprender mais rápido sem terceirizar provas",
        summary:
          "Transforme material denso em quizzes e analogias — depois feche o livro e explique com as suas palavras.",
        steps: [
          "Cole uma seção (não o livro inteiro) e peça um mapa de conceitos.",
          "Gere 5 perguntas de quiz; responda sem olhar.",
          "Peça um contra-argumento do seu resumo.",
          "Nunca entregue prosa de IA como trabalho avaliado sem reescrever.",
        ],
        tip: "Modelos baratos ou locais bastam para estudar; reserve frontier para provas difíceis.",
      },
    },
  },
  {
    id: "vision-extract",
    audience: "builder",
    modelSlugs: ["gpt-4.1", "qwen2-5vl-7b", "gemini-2-5-flash"],
    catalogHref: "/models?use=vision&sort=recommended",
    content: {
      en: {
        title: "Extract structure from images & PDFs",
        summary:
          "Use vision-capable models to pull tables, UI copy or diagram labels into JSON you can validate.",
        steps: [
          "Prefer models tagged vision in the catalog.",
          "Ask for a strict schema (JSON keys) before free-form prose.",
          "Spot-check extractions against the source image.",
          "For sensitive scans, prefer a local vision model when VRAM allows.",
        ],
        tip: "Schema-first prompts beat “describe this image” for production pipelines.",
      },
      "pt-br": {
        title: "Extrair estrutura de imagens e PDFs",
        summary:
          "Use modelos com visão para puxar tabelas, copy de UI ou rótulos de diagramas para JSON validável.",
        steps: [
          "Prefira modelos com tag vision no catálogo.",
          "Peça um schema estrito (chaves JSON) antes de prosa livre.",
          "Faça amostragem das extrações contra a imagem original.",
          "Em scans sensíveis, prefira visão local quando a VRAM permitir.",
        ],
        tip: "Prompts com schema batem “descreva esta imagem” em pipelines de produção.",
      },
    },
  },
  {
    id: "decision-memo",
    audience: "lead",
    modelSlugs: ["gpt-5", "claude-sonnet-5", "gemini-2-5-pro"],
    catalogHref: "/models?use=reasoning&sort=recommended",
    content: {
      en: {
        title: "Decision memos with explicit trade-offs",
        summary:
          "Force options, risks, costs and a recommendation — then you make the call.",
        steps: [
          "State the decision, constraints and what “good” looks like.",
          "Ask for 3 options with pros/cons and estimated cost/risk.",
          "Request what evidence is missing before deciding.",
          "Keep customer data out of the prompt unless policy allows it.",
        ],
        tip: "Use Compare on two flagships for high-stakes memos; do not trust a single pass.",
      },
      "pt-br": {
        title: "Memos de decisão com trade-offs explícitos",
        summary:
          "Force opções, riscos, custos e uma recomendação — a decisão final é sua.",
        steps: [
          "Declare a decisão, restrições e o que é “bom”.",
          "Peça 3 opções com prós/contras e custo/risco estimado.",
          "Peça que evidência ainda falta antes de decidir.",
          "Mantenha dados de cliente fora do prompt, salvo se a política permitir.",
        ],
        tip: "Use Comparar em dois flagships para memos críticos; não confie numa única passagem.",
      },
    },
  },
  {
    id: "rag-lite",
    audience: "builder",
    modelSlugs: ["gpt-4.1", "gemini-2-5-flash", "qwen3-8b"],
    catalogHref: "/models?use=research&sort=recommended",
    content: {
      en: {
        title: "Lightweight RAG / “chat with docs”",
        summary:
          "Retrieve a few chunks, cite them, and keep the model honest about missing context.",
        steps: [
          "Chunk docs; retrieve top-k before prompting.",
          "Instruct: answer only from provided excerpts; say when unknown.",
          "Prefer long-context models when chunking is immature.",
          "Log failures into a tiny eval set before changing models.",
        ],
        tip: "Long context is not a substitute for retrieval quality — measure both.",
      },
      "pt-br": {
        title: "RAG leve / “chat com docs”",
        summary:
          "Recupere poucos chunks, cite-os e mantenha o modelo honesto sobre contexto faltante.",
        steps: [
          "Faça chunk dos docs; recupere top-k antes do prompt.",
          "Instrua: responda só com os trechos; diga quando não souber.",
          "Prefira modelos de contexto longo quando o chunking ainda for frágil.",
          "Registre falhas num eval mínimo antes de trocar de modelo.",
        ],
        tip: "Contexto longo não substitui qualidade de retrieval — meça os dois.",
      },
    },
  },
];

export function getApplyRecipeContent(recipe: ApplyRecipe, locale: Locale) {
  return recipe.content[locale] ?? recipe.content.en;
}
