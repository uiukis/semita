import type { Locale } from "./types";

export type LearnArticle = {
  slug: string;
  level: "beginner" | "intermediate" | "advanced";
  leverages: boolean;
  relatedHref: string;
  content: Record<
    Locale,
    {
      title: string;
      summary: string;
      body: string[];
      takeaway: string;
    }
  >;
};

export const learnArticles: LearnArticle[] = [
  {
    slug: "first-useful-prompt",
    level: "beginner",
    leverages: true,
    relatedHref: "/recommend",
    content: {
      en: {
        title: "Your first useful prompt",
        summary:
          "Goal, audience, constraints, format — four lines beat a vague “be smart”.",
        body: [
          "Start with what done looks like: a checklist, a JSON shape, or a short reply.",
          "Name the audience and tone so the model stops guessing.",
          "Add hard constraints (length, must-include facts, what to avoid).",
          "Ask for one example, then do a tiny version yourself before scaling up.",
        ],
        takeaway:
          "AI drafts; you own the brief. If you cannot explain the ask, do not ship the answer.",
      },
      "pt-br": {
        title: "Seu primeiro prompt útil",
        summary:
          "Objetivo, público, restrições, formato — quatro linhas batem um “seja inteligente” vago.",
        body: [
          "Comece pelo que é “pronto”: checklist, shape JSON ou resposta curta.",
          "Nomeie público e tom para o modelo parar de adivinhar.",
          "Coloque restrições duras (tamanho, fatos obrigatórios, o que evitar).",
          "Peça um exemplo e faça uma versão pequena você mesmo antes de escalar.",
        ],
        takeaway:
          "A IA rascunha; o brief é seu. Se você não explica o pedido, não publique a resposta.",
      },
    },
  },
  {
    slug: "verify-before-ship",
    level: "beginner",
    leverages: true,
    relatedHref: "/guide#topics",
    content: {
      en: {
        title: "Verify before you ship",
        summary:
          "Treat model output as a draft. Facts, code and tone still need a human gate.",
        body: [
          "For facts: check dates, numbers and citations outside the chat.",
          "For code: run tests or a minimal repro before merging.",
          "For writing: read aloud — if it is not your voice, rewrite.",
          "Keep a short failure log; it becomes your personal eval set.",
        ],
        takeaway:
          "Leverage means faster loops with clearer ownership — not skipping the last look.",
      },
      "pt-br": {
        title: "Verifique antes de publicar",
        summary:
          "Trate a saída do modelo como rascunho. Fatos, código e tom ainda pedem um gate humano.",
        body: [
          "Para fatos: confira datas, números e citações fora do chat.",
          "Para código: rode testes ou um repro mínimo antes do merge.",
          "Para escrita: leia em voz alta — se não for sua voz, reescreva.",
          "Mantenha um log curto de falhas; vira seu eval pessoal.",
        ],
        takeaway:
          "Alavancar é acelerar o loop com responsabilidade clara — não pular a última olhada.",
      },
    },
  },
  {
    slug: "cloud-vs-local",
    level: "intermediate",
    leverages: true,
    relatedHref: "/hardware",
    content: {
      en: {
        title: "When cloud wins vs when local wins",
        summary:
          "Peak quality and easy updates vs privacy, offline and predictable spend after hardware.",
        body: [
          "Use cloud APIs for hard reasoning, polish under deadline and non-sensitive exploration.",
          "Use local models when the topic is private, regulated or high-volume after you own the GPU/RAM.",
          "Match Semita hardware recipes before jumping model size — OOM is not a quality problem.",
          "A hybrid habit works: local draft → cloud critique for sensitive-but-important work (without pasting secrets).",
        ],
        takeaway:
          "Hosting is a product decision. Filter the catalog by host and tier instead of chasing hype names.",
      },
      "pt-br": {
        title: "Quando a nuvem ganha vs quando o local ganha",
        summary:
          "Pico de qualidade e updates fáceis vs privacidade, offline e gasto previsível depois do hardware.",
        body: [
          "Use APIs na nuvem para raciocínio duro, polir sob prazo e exploração não sensível.",
          "Use modelos locais quando o tema for privado, regulado ou de alto volume depois que você tiver GPU/RAM.",
          "Combine com as receitas de hardware do Semita antes de subir o tamanho — OOM não é problema de qualidade.",
          "Hábito híbrido: rascunho local → crítica na nuvem (sem colar segredos) em trabalho sensível mas importante.",
        ],
        takeaway:
          "Hospedagem é decisão de produto. Filtre o catálogo por host e tier em vez de perseguir hype.",
      },
    },
  },
  {
    slug: "cost-per-token-trap",
    level: "intermediate",
    leverages: true,
    relatedHref: "/models?host=api&sort=cheapest",
    content: {
      en: {
        title: "The cost-per-token trap",
        summary:
          "Cheap models that fail twice are expensive. Separate quality, latency and spend.",
        body: [
          "Input and output prices differ — verbose answers dominate the bill.",
          "Long system prompts and huge pastes multiply cost on every call.",
          "Route easy jobs to cheap models; escalate hard cases to a flagship.",
          "Re-check provider list prices; Semita numbers are references with lastUpdated dates.",
        ],
        takeaway:
          "Optimize the path (routing + brevity), not only the sticker price of one model.",
      },
      "pt-br": {
        title: "A armadilha do custo por token",
        summary:
          "Modelo barato que falha duas vezes sai caro. Separe qualidade, latência e gasto.",
        body: [
          "Preços de entrada e saída diferem — respostas verbosas dominam a conta.",
          "System prompts longos e colagens enormes multiplicam custo em toda chamada.",
          "Mande jobs fáceis para modelos baratos; escale os difíceis para um flagship.",
          "Reconfira preços de lista do provedor; números do Semita são referência com lastUpdated.",
        ],
        takeaway:
          "Otimize o caminho (roteamento + brevidade), não só o preço de etiqueta de um modelo.",
      },
    },
  },
  {
    slug: "tiny-eval-set",
    level: "advanced",
    leverages: true,
    relatedHref: "/benchmark",
    content: {
      en: {
        title: "Build a tiny eval set that is yours",
        summary:
          "Ten to thirty real tasks beat a public leaderboard you do not trust.",
        body: [
          "Collect failures from your week: a buggy function, a messy email, a bad extraction.",
          "Freeze the prompts and expected shape; re-run when you switch models.",
          "Score quality, latency and cost separately — like the Semita Mini Benchmark.",
          "Publish internal notes, not vanity rankings. Change the stack only when the eval moves.",
        ],
        takeaway:
          "Judgment scales when evidence is repeatable. Your tasks are the exam.",
      },
      "pt-br": {
        title: "Monte um eval mínimo que é seu",
        summary:
          "Dez a trinta tarefas reais batem um leaderboard público em que você não confia.",
        body: [
          "Colete falhas da semana: função bugada, e-mail confuso, extração ruim.",
          "Congele prompts e o formato esperado; rode de novo ao trocar de modelo.",
          "Pontue qualidade, latência e custo separados — como o Mini Benchmark do Semita.",
          "Publique notas internas, não rankings de vaidade. Mude a stack só quando o eval mexer.",
        ],
        takeaway:
          "Julgamento escala quando a evidência se repete. Suas tarefas são a prova.",
      },
    },
  },
];

export function getLearnArticle(slug: string): LearnArticle | undefined {
  return learnArticles.find((article) => article.slug === slug);
}

export function getLearnArticleContent(article: LearnArticle, locale: Locale) {
  return article.content[locale] ?? article.content.en;
}
