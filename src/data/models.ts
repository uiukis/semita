import type { LlmModel, Locale, LocalizedModelContent, ModelProvider, UseCase } from "./types";

export const models: LlmModel[] = [
  {
    slug: "gpt-5",
    name: "GPT-5",
    provider: "OpenAI",
    releaseDate: "2025-08-07",
    contextWindow: 400000,
    maxOutputTokens: 128000,
    pricing: { inputPerMillion: 1.25, outputPerMillion: 10, currency: "USD" },
    modalities: ["text", "vision", "code"],
    useCases: ["coding", "writing", "reasoning", "research"],
    communityScore: 4.8,
    benchmarks: [
      {
        name: "Frontier generalist",
        score: "Flagship tier",
        sourceUrl: "https://openai.com/index/introducing-gpt-5/",
      },
    ],
    sources: [{ kind: "pricing", url: "https://developers.openai.com/api/docs/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "OpenAI's current flagship generalist — strong coding, agents and long-form reasoning at competitive frontier pricing.",
        goodFor:
          "Production apps that need a single default model for coding, writing and complex multi-step work.",
        strengths: [
          "Strong all-around frontier quality",
          "Competitive input pricing for a flagship",
          "Mature tooling and API ecosystem",
        ],
        communityNotes: "Default OpenAI pick when you want the current flagship without overpaying for pro tiers.",
      },
      "pt-br": {
        summary:
          "Carro-chefe atual da OpenAI — forte em código, agents e raciocínio longo com preço frontier competitivo.",
        goodFor:
          "Apps em produção que precisam de um modelo padrão para código, escrita e trabalho multi-etapa.",
        strengths: [
          "Qualidade frontier versátil",
          "Preço de input competitivo para flagship",
          "Ecossistema e APIs maduros",
        ],
        communityNotes: "Escolha padrão OpenAI quando você quer o flagship atual sem pagar tiers pro.",
      },
    },
  },
  {
    slug: "gpt-4.1",
    name: "GPT-4.1",
    provider: "OpenAI",
    releaseDate: "2025-04-14",
    contextWindow: 1048576,
    maxOutputTokens: 32768,
    pricing: { inputPerMillion: 2, outputPerMillion: 8, currency: "USD" },
    modalities: ["text", "vision", "code"],
    useCases: ["coding", "writing", "reasoning", "vision"],
    communityScore: 4.6,
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: "~54.6%",
        sourceUrl: "https://openai.com/index/gpt-4-1/",
      },
    ],
    sources: [{ kind: "pricing", url: "https://developers.openai.com/api/docs/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "OpenAI's long-context workhorse — 1M tokens, strong instruction following and coding without a reasoning-model tax.",
        goodFor:
          "Agents, IDE tooling and large-document work where latency and instruction precision matter.",
        strengths: [
          "1M-token context window",
          "Excellent instruction following and tool use",
          "Cheaper than GPT-4o on list price",
        ],
        communityNotes: "Best OpenAI pick for long-context coding and agents before jumping to GPT-5.",
      },
      "pt-br": {
        summary:
          "Cavalo de batalha de contexto longo da OpenAI — 1M tokens, forte em instruções e código sem o custo de reasoning models.",
        goodFor:
          "Agents, ferramentas de IDE e documentos grandes onde latência e precisão de instrução importam.",
        strengths: [
          "Janela de contexto de 1M tokens",
          "Excelente seguimento de instruções e tool use",
          "Mais barato que o GPT-4o no preço de lista",
        ],
        communityNotes: "Melhor escolha OpenAI para código e agents de contexto longo antes do GPT-5.",
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
          "Still one of the cheapest solid multimodal options in the OpenAI lineup for high-volume workloads.",
        goodFor:
          "Classification, extraction, routing and cheap prototyping at scale.",
        strengths: [
          "Very low cost per token",
          "Fast for high-volume tasks",
          "Same ecosystem and APIs as larger OpenAI models",
        ],
        communityNotes: "Best OpenAI value for volume when GPT-5 quality is overkill.",
      },
      "pt-br": {
        summary:
          "Ainda uma das opções multimodais sólidas mais baratas da linha OpenAI para alto volume.",
        goodFor:
          "Classificação, extração, roteamento e prototipagem barata em escala.",
        strengths: [
          "Custo por token muito baixo",
          "Rápido para tarefas de alto volume",
          "Mesmo ecossistema e APIs dos modelos maiores",
        ],
        communityNotes: "Melhor custo-benefício OpenAI para volume quando GPT-5 é overkill.",
      },
    },
  },
  {
    slug: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    releaseDate: "2026-05-22",
    contextWindow: 200000,
    maxOutputTokens: 64000,
    pricing: { inputPerMillion: 2, outputPerMillion: 10, currency: "USD" },
    modalities: ["text", "vision", "code"],
    useCases: ["coding", "writing", "reasoning"],
    communityScore: 4.8,
    benchmarks: [
      {
        name: "Coding / agents",
        score: "High-performance tier",
        sourceUrl: "https://www.anthropic.com/news/claude-sonnet-5",
      },
    ],
    sources: [{ kind: "pricing", url: "https://www.anthropic.com/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "Anthropic's current high-performance Sonnet for coding and agents. Introductory API pricing $2/$10 through Aug 31, 2026 ($3/$15 thereafter).",
        goodFor:
          "Coding assistants, agent loops and instruction-heavy writing that benefit from Claude's careful style.",
        strengths: [
          "Strong coding and agent performance",
          "Introductory pricing undercuts prior Sonnet list rates",
          "200k context with solid instruction adherence",
        ],
        communityNotes: "Top Anthropic pick for day-to-day coding while intro pricing lasts.",
      },
      "pt-br": {
        summary:
          "Sonnet de alta performance da Anthropic para código e agents. Preço introdutório de API $2/$10 até 31/ago/2026 ($3/$15 depois).",
        goodFor:
          "Assistentes de código, loops de agents e escrita com instruções complexas no estilo cuidadoso do Claude.",
        strengths: [
          "Forte em código e agents",
          "Preço introdutório abaixo do Sonnet anterior",
          "Contexto de 200k com boa aderência a instruções",
        ],
        communityNotes: "Melhor escolha Anthropic para código do dia a dia enquanto o preço intro durar.",
      },
    },
  },
  {
    slug: "claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    releaseDate: "2025-10-15",
    contextWindow: 200000,
    maxOutputTokens: 64000,
    pricing: { inputPerMillion: 1, outputPerMillion: 5, currency: "USD" },
    modalities: ["text", "vision", "code"],
    useCases: ["cost-effective", "coding", "writing"],
    communityScore: 4.4,
    benchmarks: [
      {
        name: "Latency / cost",
        score: "Fastest Claude tier",
        sourceUrl: "https://www.anthropic.com/pricing",
      },
    ],
    sources: [{ kind: "pricing", url: "https://www.anthropic.com/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "Anthropic's fastest, most cost-efficient Claude — solid quality for low-latency and high-volume paths.",
        goodFor:
          "Pipelines that need fast Claude-quality responses without Sonnet pricing.",
        strengths: [
          "Lowest latency in the Claude family",
          "200k context at Haiku pricing",
          "Good value for straightforward coding and chat",
        ],
        communityNotes: "The affordable Claude when Sonnet 5 is more than you need.",
      },
      "pt-br": {
        summary:
          "Claude mais rápido e econômico da Anthropic — boa qualidade para baixa latência e alto volume.",
        goodFor:
          "Fluxos que precisam de respostas rápidas no estilo Claude sem o preço do Sonnet.",
        strengths: [
          "Menor latência da família Claude",
          "Contexto de 200k no preço Haiku",
          "Bom custo para código e chat diretos",
        ],
        communityNotes: "O Claude acessível quando Sonnet 5 é mais do que você precisa.",
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
    slug: "o4-mini",
    name: "o4-mini",
    provider: "OpenAI",
    releaseDate: "2025-04-16",
    contextWindow: 200000,
    maxOutputTokens: 100000,
    pricing: { inputPerMillion: 1.1, outputPerMillion: 4.4, currency: "USD" },
    modalities: ["text", "code"],
    useCases: ["reasoning", "coding"],
    communityScore: 4.6,
    benchmarks: [
      {
        name: "AIME / STEM",
        score: "Strong reasoning tier",
        sourceUrl: "https://openai.com/index/introducing-o3-and-o4-mini/",
      },
    ],
    sources: [{ kind: "pricing", url: "https://developers.openai.com/api/docs/pricing" }],
    lastUpdated: "2026-07-18",
    content: {
      en: {
        summary:
          "OpenAI's cost-efficient reasoning model — successor spirit to o1-mini for math, coding and multi-step problem solving.",
        goodFor:
          "Hard reasoning tasks, STEM problems and coding challenges where chain-of-thought quality matters.",
        strengths: [
          "Strong multi-step reasoning",
          "Excellent at math and coding contests",
          "Cheaper than full o-series flagships",
        ],
        communityNotes: "Go-to when you need reasoning without full o3/o1 cost.",
      },
      "pt-br": {
        summary:
          "Modelo de raciocínio econômico da OpenAI — sucessor do espírito do o1-mini para matemática, código e multi-etapa.",
        goodFor:
          "Tarefas difíceis de raciocínio, STEM e desafios de código onde a qualidade do raciocínio importa.",
        strengths: [
          "Raciocínio multi-etapa forte",
          "Excelente em matemática e contests de código",
          "Mais barato que os flagships da série o",
        ],
        communityNotes: "Escolha quando precisa de raciocínio sem o custo do o3/o1 full.",
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
