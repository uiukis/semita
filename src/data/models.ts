import type { LlmModel, Locale, LocalizedModelContent, ModelProvider, UseCase } from "./types";

export const models: LlmModel[] = [
  {
    slug: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    releaseDate: "2024-05-13",
    contextWindow: 128000,
    maxOutputTokens: 16384,
    pricing: { inputPerMillion: 2.5, outputPerMillion: 10, currency: "USD" },
    modalities: ["text", "vision", "audio", "code"],
    useCases: ["coding", "writing", "reasoning", "vision"],
    communityScore: 4.6,
    benchmarks: [
      { name: "MMLU", score: "~88.7%", sourceUrl: "https://openai.com/index/hello-gpt-4o/" },
    ],
    sources: [{ kind: "pricing", url: "https://developers.openai.com/api/docs/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "OpenAI's multimodal generalist, balancing quality, speed and native support for text, image and audio.",
        goodFor:
          "Applications that need a versatile, multimodal model with a good balance between cost and capability.",
        strengths: [
          "Natively multimodal (text, image and audio)",
          "Strong all-around reasoning and coding performance",
          "Mature ecosystem and tooling",
        ],
        communityNotes: "A safe pick for general-purpose and multimodal workloads.",
      },
      "pt-br": {
        summary:
          "Generalista multimodal da OpenAI, equilibrando qualidade, velocidade e suporte nativo a texto, imagem e áudio.",
        goodFor:
          "Aplicações que precisam de um modelo versátil e multimodal com bom equilíbrio entre custo e capacidade.",
        strengths: [
          "Multimodal nativo (texto, imagem e áudio)",
          "Boa performance geral em raciocínio e código",
          "Ecossistema e ferramentas maduras",
        ],
        communityNotes: "Escolha segura para uso geral e multimodal.",
      },
    },
  },
  {
    slug: "gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    releaseDate: "2024-07-18",
    contextWindow: 128000,
    maxOutputTokens: 16384,
    pricing: { inputPerMillion: 0.15, outputPerMillion: 0.6, currency: "USD" },
    modalities: ["text", "vision", "code"],
    useCases: ["cost-effective", "writing", "coding"],
    communityScore: 4.4,
    benchmarks: [
      {
        name: "MMLU",
        score: "~82%",
        sourceUrl:
          "https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/",
      },
    ],
    sources: [{ kind: "pricing", url: "https://developers.openai.com/api/docs/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "The budget version of GPT-4o, built for high-volume workloads at very low cost while keeping solid quality.",
        goodFor:
          "Simple tasks at scale: classification, extraction and cheap prototyping.",
        strengths: [
          "Very low cost per token",
          "Fast for high-volume tasks",
          "Same ecosystem and APIs as GPT-4o",
        ],
        communityNotes: "Best value in the OpenAI lineup for volume workloads.",
      },
      "pt-br": {
        summary:
          "A versão econômica do GPT-4o, feita para alto volume a custo muito baixo mantendo boa qualidade.",
        goodFor:
          "Tarefas simples em escala: classificação, extração e prototipagem barata.",
        strengths: [
          "Custo por token muito baixo",
          "Rápido para tarefas de alto volume",
          "Mesmo ecossistema e APIs do GPT-4o",
        ],
        communityNotes: "Melhor custo-benefício da linha OpenAI para volume.",
      },
    },
  },
  {
    slug: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    releaseDate: "2024-06-20",
    contextWindow: 200000,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 3, outputPerMillion: 15, currency: "USD" },
    modalities: ["text", "vision", "code"],
    useCases: ["coding", "writing", "reasoning"],
    communityScore: 4.7,
    benchmarks: [
      { name: "HumanEval", score: "~92%", sourceUrl: "https://www.anthropic.com/news/claude-3-5-sonnet" },
    ],
    sources: [{ kind: "pricing", url: "https://www.anthropic.com/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "Anthropic's flagship for coding, instruction following and high-quality writing.",
        goodFor:
          "Coding assistants, long-document analysis and tasks that demand careful reasoning.",
        strengths: [
          "Excellent at coding and refactoring",
          "200k-token context window",
          "Strong adherence to complex instructions",
        ],
        communityNotes: "The dev community favorite for code.",
      },
      "pt-br": {
        summary:
          "O carro-chefe da Anthropic para programação, seguimento de instruções e escrita de alta qualidade.",
        goodFor:
          "Assistentes de código, análise de documentos longos e tarefas que exigem raciocínio cuidadoso.",
        strengths: [
          "Excelente em programação e refatoração",
          "Janela de contexto de 200k tokens",
          "Ótima aderência a instruções complexas",
        ],
        communityNotes: "O favorito da comunidade dev para código.",
      },
    },
  },
  {
    slug: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    releaseDate: "2024-11-04",
    contextWindow: 200000,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.8, outputPerMillion: 4, currency: "USD" },
    modalities: ["text", "code"],
    useCases: ["cost-effective", "coding", "writing"],
    communityScore: 4.3,
    benchmarks: [
      {
        name: "HumanEval",
        score: "~88%",
        sourceUrl: "https://www.anthropic.com/news/3-5-models-and-computer-use",
      },
    ],
    sources: [{ kind: "pricing", url: "https://www.anthropic.com/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "Anthropic's fast and affordable model, with solid quality for low-latency tasks.",
        goodFor:
          "Pipelines that need fast, cheap responses while keeping decent quality.",
        strengths: [
          "Low latency",
          "200k-token context window",
          "Good value for straightforward coding",
        ],
        communityNotes: "The fast and affordable option in the Claude family.",
      },
      "pt-br": {
        summary:
          "O modelo rápido e acessível da Anthropic, com boa qualidade para tarefas de baixa latência.",
        goodFor:
          "Fluxos que precisam de respostas rápidas e baratas mantendo qualidade decente.",
        strengths: [
          "Baixa latência",
          "Janela de contexto de 200k tokens",
          "Bom custo para programação direta",
        ],
        communityNotes: "A opção rápida e acessível da família Claude.",
      },
    },
  },
  {
    slug: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    releaseDate: "2025-03-25",
    contextWindow: 1048576,
    maxOutputTokens: 65536,
    pricing: { inputPerMillion: 1.25, outputPerMillion: 10, currency: "USD" },
    modalities: ["text", "vision", "audio", "code"],
    useCases: ["research", "reasoning", "coding", "vision"],
    communityScore: 4.5,
    benchmarks: [
      {
        name: "GPQA",
        score: "Strong frontier",
        sourceUrl: "https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/",
      },
    ],
    sources: [{ kind: "pricing", url: "https://ai.google.dev/gemini-api/docs/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "Google's multipurpose frontier model for coding and complex reasoning, with a 1M-token context window.",
        goodFor:
          "Deep research, long-context analysis and coding tasks that need strong multimodal reasoning.",
        strengths: [
          "1M-token context window",
          "Strong coding and complex reasoning",
          "Multimodal inputs (text, image, audio, video)",
        ],
        communityNotes: "A top pick when Google's long-context stack is the fit.",
      },
      "pt-br": {
        summary:
          "Modelo frontier multipropósito do Google para código e raciocínio complexo, com janela de 1M tokens.",
        goodFor:
          "Pesquisa profunda, análise de contexto longo e código que exige raciocínio multimodal forte.",
        strengths: [
          "Janela de contexto de 1M tokens",
          "Forte em código e raciocínio complexo",
          "Entradas multimodais (texto, imagem, áudio, vídeo)",
        ],
        communityNotes: "Ótima escolha quando o stack de contexto longo do Google encaixa.",
      },
    },
  },
  {
    slug: "gemini-2-5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    releaseDate: "2025-04-17",
    contextWindow: 1048576,
    maxOutputTokens: 65536,
    pricing: { inputPerMillion: 0.3, outputPerMillion: 2.5, currency: "USD" },
    modalities: ["text", "vision", "audio", "code"],
    useCases: ["cost-effective", "research", "vision", "coding"],
    communityScore: 4.3,
    benchmarks: [
      {
        name: "Latency / cost",
        score: "Hybrid reasoning",
        sourceUrl: "https://developers.googleblog.com/en/start-building-with-gemini-25-flash/",
      },
    ],
    sources: [{ kind: "pricing", url: "https://ai.google.dev/gemini-api/docs/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "Google's hybrid reasoning Flash model — 1M context with strong speed and cost efficiency.",
        goodFor:
          "High-volume multimodal workloads that still need solid reasoning without Pro pricing.",
        strengths: [
          "1M-token context at Flash pricing",
          "Thinking budgets for controllable reasoning",
          "Fast multimodal throughput",
        ],
        communityNotes: "Best Google value when you need speed and long context together.",
      },
      "pt-br": {
        summary:
          "Modelo Flash híbrido do Google — contexto de 1M com boa velocidade e custo-benefício.",
        goodFor:
          "Cargas multimodais em alto volume que ainda precisam de raciocínio sólido sem o preço do Pro.",
        strengths: [
          "Contexto de 1M tokens no preço Flash",
          "Budgets de thinking para raciocínio controlável",
          "Alto throughput multimodal",
        ],
        communityNotes: "Melhor custo-benefício Google quando velocidade e contexto longo importam juntos.",
      },
    },
  },

  {
    slug: "o1-mini",
    name: "o1-mini",
    provider: "OpenAI",
    releaseDate: "2024-09-12",
    contextWindow: 128000,
    maxOutputTokens: 65536,
    pricing: { inputPerMillion: 1.1, outputPerMillion: 4.4, currency: "USD" },
    modalities: ["text", "code"],
    useCases: ["reasoning", "coding"],
    communityScore: 4.5,
    benchmarks: [
      {
        name: "AIME",
        score: "~70%",
        sourceUrl: "https://openai.com/index/openai-o1-mini-advancing-cost-efficient-reasoning/",
      },
    ],
    sources: [{ kind: "pricing", url: "https://developers.openai.com/api/docs/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "OpenAI's cost-efficient reasoning model — strong at math, coding and multi-step problem solving.",
        goodFor:
          "Hard reasoning tasks, STEM problems and coding challenges where chain-of-thought quality matters.",
        strengths: [
          "Strong multi-step reasoning",
          "Excellent at math and coding contests",
          "Cheaper than full o1 for many workloads",
        ],
        communityNotes: "Go-to when you need reasoning without full o1 cost.",
      },
      "pt-br": {
        summary:
          "Modelo de raciocínio econômico da OpenAI — forte em matemática, código e resolução multi-etapa.",
        goodFor:
          "Tarefas difíceis de raciocínio, STEM e desafios de código onde a qualidade do raciocínio importa.",
        strengths: [
          "Raciocínio multi-etapa forte",
          "Excelente em matemática e contests de código",
          "Mais barato que o o1 completo em muitos casos",
        ],
        communityNotes: "Escolha quando precisa de raciocínio sem o custo do o1 full.",
      },
    },
  },
  {
    slug: "deepseek-v3",
    name: "DeepSeek-V3",
    provider: "DeepSeek",
    releaseDate: "2024-12-26",
    contextWindow: 128000,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.28, outputPerMillion: 0.42, currency: "USD" },
    modalities: ["text", "code"],
    useCases: ["coding", "reasoning", "cost-effective"],
    communityScore: 4.4,
    benchmarks: [
      {
        name: "MMLU",
        score: "~87.1%",
        sourceUrl: "https://github.com/deepseek-ai/DeepSeek-V3",
      },
    ],
    sources: [{ kind: "pricing", url: "https://api-docs.deepseek.com/quick_start/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "Open-weight MoE model with flagship-level coding and reasoning at a fraction of the cost.",
        goodFor:
          "Teams that want strong coding/reasoning quality on a tight API budget.",
        strengths: [
          "Very strong price-to-performance",
          "Competitive coding and math scores",
          "Open weights available for self-hosting",
        ],
        communityNotes: "Breakout open-weight option for cost-conscious builders.",
      },
      "pt-br": {
        summary:
          "Modelo MoE open-weight com qualidade de ponta em código e raciocínio a uma fração do custo.",
        goodFor:
          "Times que querem qualidade forte em código/raciocínio com orçamento apertado de API.",
        strengths: [
          "Excelente relação preço/performance",
          "Scores competitivos em código e matemática",
          "Pesos abertos para self-hosting",
        ],
        communityNotes: "Opção open-weight em destaque para quem prioriza custo.",
      },
    },
  },
  {
    slug: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta",
    releaseDate: "2024-12-06",
    contextWindow: 128000,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.4, outputPerMillion: 0.4, currency: "USD" },
    modalities: ["text", "code"],
    useCases: ["writing", "coding", "cost-effective"],
    communityScore: 4.2,
    benchmarks: [
      {
        name: "MMLU",
        score: "~86%",
        sourceUrl: "https://ai.meta.com/blog/llama-3-3/",
      },
    ],
    sources: [{ kind: "pricing", url: "https://www.llama.com/" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "Meta's open Llama 3.3 70B — strong multilingual chat and instruction following, free to self-host.",
        goodFor:
          "Self-hosted assistants, fine-tuning and apps that need an open, capable 70B-class model.",
        strengths: [
          "Open weights with commercial-friendly license",
          "Strong chat and instruction quality for the size",
          "Easy to run via major cloud inference APIs",
        ],
        communityNotes: "The practical open model many teams actually ship with.",
      },
      "pt-br": {
        summary:
          "Llama 3.3 70B da Meta — forte em chat multilíngue e seguimento de instruções, free para self-host.",
        goodFor:
          "Assistentes self-hosted, fine-tuning e apps que precisam de um modelo open capaz na classe 70B.",
        strengths: [
          "Pesos abertos com licença amigável a uso comercial",
          "Boa qualidade de chat e instruções para o tamanho",
          "Fácil de rodar via APIs de inferência nas clouds",
        ],
        communityNotes: "O modelo open que muitos times realmente colocam em produção.",
      },
    },
  },
  {
    slug: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    releaseDate: "2024-11-18",
    contextWindow: 128000,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.5, outputPerMillion: 1.5, currency: "USD" },
    modalities: ["text", "code"],
    useCases: ["writing", "reasoning", "coding"],
    communityScore: 4.1,
    benchmarks: [
      {
        name: "MMLU",
        score: "~84%",
        sourceUrl: "https://mistral.ai/news/mistral-large-2407/",
      },
    ],
    sources: [{ kind: "pricing", url: "https://mistral.ai/products/la-plateforme/" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "Mistral's flagship API model — strong multilingual writing, solid coding and EU-friendly hosting options.",
        goodFor:
          "European teams and multilingual products that need a capable commercial API outside the US majors.",
        strengths: [
          "Strong multilingual performance",
          "Competitive coding and agentic tool use",
          "EU data residency options",
        ],
        communityNotes: "Solid European alternative when US provider lock-in is a concern.",
      },
      "pt-br": {
        summary:
          "Carro-chefe da Mistral via API — forte em escrita multilíngue, bom em código e opções de hosting amigáveis à UE.",
        goodFor:
          "Times europeus e produtos multilíngues que precisam de API comercial fora dos big techs dos EUA.",
        strengths: [
          "Performance multilíngue forte",
          "Código e tool use competitivos",
          "Opções de residência de dados na UE",
        ],
        communityNotes: "Boa alternativa europeia quando lock-in de provedor americano preocupa.",
      },
    },
  },
  {
    slug: "grok-2",
    name: "Grok 2",
    provider: "xAI",
    releaseDate: "2024-08-13",
    contextWindow: 131072,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 2, outputPerMillion: 10, currency: "USD" },
    modalities: ["text", "vision", "code"],
    useCases: ["writing", "reasoning", "vision"],
    communityScore: 3.9,
    benchmarks: [
      {
        name: "MMLU",
        score: "~87.5%",
        sourceUrl: "https://x.ai/blog/grok-2",
      },
    ],
    sources: [{ kind: "pricing", url: "https://x.ai/api" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "xAI's Grok 2 — competitive generalist with vision, known for a more conversational, less filtered style.",
        goodFor:
          "Chatty assistants and products that want a capable multimodal model outside the usual suspects.",
        strengths: [
          "Competitive general benchmarks",
          "Native vision support",
          "Distinct conversational personality",
        ],
        communityNotes: "Interesting alternative if you want a different house style.",
      },
      "pt-br": {
        summary:
          "Grok 2 da xAI — generalista competitivo com visão, conhecido por um estilo mais conversacional e menos filtrado.",
        goodFor:
          "Assistentes conversacionais e produtos que querem um multimodal capaz fora dos suspeitos de sempre.",
        strengths: [
          "Benchmarks gerais competitivos",
          "Suporte nativo a visão",
          "Personalidade conversacional distinta",
        ],
        communityNotes: "Alternativa interessante se você quer um estilo de casa diferente.",
      },
    },
  },
  {
    slug: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    releaseDate: "2024-03-04",
    contextWindow: 200000,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 15, outputPerMillion: 75, currency: "USD" },
    modalities: ["text", "vision", "code"],
    useCases: ["reasoning", "writing", "research"],
    communityScore: 4.3,
    benchmarks: [
      {
        name: "MMLU",
        score: "~86.8%",
        sourceUrl: "https://www.anthropic.com/news/claude-3-family",
      },
    ],
    sources: [{ kind: "pricing", url: "https://www.anthropic.com/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "Anthropic's earlier flagship — still preferred for deep analysis, careful writing and complex research briefs.",
        goodFor:
          "High-stakes writing, research synthesis and tasks where nuance and reliability beat raw speed.",
        strengths: [
          "Excellent long-form writing quality",
          "Careful, nuanced reasoning",
          "200k context for large briefs",
        ],
        communityNotes: "Still loved for quality writing even after Sonnet 3.5 took the coding crown.",
      },
      "pt-br": {
        summary:
          "Ex-carro-chefe da Anthropic — ainda preferido para análise profunda, escrita cuidadosa e briefs de pesquisa complexos.",
        goodFor:
          "Escrita de alto risco, síntese de pesquisa e tarefas em que nuance e confiabilidade batem velocidade.",
        strengths: [
          "Excelente qualidade de escrita longa",
          "Raciocínio cuidadoso e nuançado",
          "Contexto de 200k para briefs grandes",
        ],
        communityNotes: "Ainda amado para escrita de qualidade mesmo após o Sonnet 3.5 dominar código.",
      },
    },
  },
];

export function getAllModels(): LlmModel[] {
  return models;
}

export function getModelBySlug(slug: string): LlmModel | undefined {
  return models.find((model) => model.slug === slug);
}

export function getModelContent(
  model: LlmModel,
  locale: Locale,
): LocalizedModelContent {
  return model.content[locale] ?? model.content.en;
}

export function getProviders(): ModelProvider[] {
  return Array.from(new Set(models.map((model) => model.provider))).sort();
}

export function getUseCases(): UseCase[] {
  return Array.from(new Set(models.flatMap((model) => model.useCases)));
}
