import type { DeterministicTask } from "./types";

export const tasksV1: DeterministicTask[] = [
  {
    id: "coding-off-by-one",
    category: "coding",
    title: {
      en: "Find the off-by-one bug",
      "pt-br": "Encontre o bug off-by-one",
    },
    prompt: `You are reviewing TypeScript. Reply with ONLY the corrected function body (no markdown fences, no explanation).

function sumFirstN(nums: number[], n: number): number {
  let total = 0;
  for (let i = 0; i <= n; i++) {
    total += nums[i];
  }
  return total;
}

The function should sum the first n elements of nums (indexes 0..n-1). Fix the loop bound.`,
    expected: `let total = 0;
  for (let i = 0; i < n; i++) {
    total += nums[i];
  }
  return total;`,
    requiresHumanReview: false,
    humanWeight: 0,
  },
  {
    id: "coding-complexity",
    category: "coding",
    title: {
      en: "Big-O of nested loops",
      "pt-br": "Big-O de loops aninhados",
    },
    prompt: `What is the time complexity of this function in Big-O notation? Reply with ONLY the Big-O expression (example: O(n) or O(n^2)).

function pairs(arr: number[]): number {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      count += 1;
    }
  }
  return count;
}`,
    expected: "O(n^2)",
    requiresHumanReview: false,
    humanWeight: 0,
  },
  {
    id: "reasoning-apples",
    category: "reasoning",
    title: {
      en: "Multi-step arithmetic",
      "pt-br": "Aritmética multi-etapa",
    },
    prompt: `A store sells apples for $2 each. Maya buys 7 apples, then uses a coupon that gives $3 off the total, then tips 10% of the discounted total (round to nearest cent). What is her final payment in USD? Reply with ONLY the number with two decimals, no currency symbol.`,
    expected: "12.10",
    numericTolerance: 0.001,
    requiresHumanReview: false,
    humanWeight: 0,
  },
  {
    id: "reasoning-logic",
    category: "reasoning",
    title: {
      en: "Who owns the laptop",
      "pt-br": "Quem é dono do laptop",
    },
    prompt: `Three people: Ada, Bea, and Cai. Exactly one owns a laptop.
1) Ada says: "I do not own it."
2) Bea says: "Cai owns it."
3) Cai says: "Bea is lying."
Exactly two statements are true. Who owns the laptop? Reply with ONLY one name: Ada, Bea, or Cai.`,
    expected: "Ada",
    requiresHumanReview: false,
    humanWeight: 0,
  },
  {
    id: "extraction-invoice",
    category: "extraction",
    title: {
      en: "Extract invoice fields",
      "pt-br": "Extrair campos de fatura",
    },
    prompt: `Extract fields from this text into a single JSON object with keys exactly: invoice_id, customer, total_usd, due_date (YYYY-MM-DD). No markdown.

Text:
Invoice INV-2048 for Acme Robotics.
Amount due: 1499.50 USD
Payment due on 2026-08-01.`,
    expectedJson: {
      invoice_id: "INV-2048",
      customer: "Acme Robotics",
      total_usd: 1499.5,
      due_date: "2026-08-01",
    },
    requiresHumanReview: false,
    humanWeight: 0,
  },
  {
    id: "extraction-meeting",
    category: "extraction",
    title: {
      en: "Extract meeting details",
      "pt-br": "Extrair detalhes da reunião",
    },
    prompt: `Extract a JSON object with keys exactly: title, date (YYYY-MM-DD), start_time (24h HH:MM), attendees (array of strings). No markdown.

Text:
Kickoff for Semita Mini Benchmark on July 20, 2026 at 15:30 with Wilker and Ana.`,
    expectedJson: {
      title: "Kickoff for Semita Mini Benchmark",
      date: "2026-07-20",
      start_time: "15:30",
      attendees: ["Wilker", "Ana"],
    },
    requiresHumanReview: false,
    humanWeight: 0,
  },
  {
    id: "writing-leverage",
    category: "writing",
    title: {
      en: "Leverage vs replace explanation",
      "pt-br": "Explicação alavanca vs substitui",
    },
    prompt: `Write an English explanation (80-120 words) of how a junior developer can use an LLM to leverage learning rather than replace it. Requirements:
- Include the exact phrase "leverages, not replaces"
- Mention "code review" once
- Do not mention brand names of AI vendors
- End with a question for the junior developer`,
    requiredPhrases: ["leverages, not replaces", "code review"],
    forbiddenPhrases: ["openai", "anthropic", "google", "chatgpt", "claude", "gemini"],
    minWords: 80,
    maxWords: 120,
    requiresHumanReview: true,
    humanWeight: 0.6,
  },
  {
    id: "writing-compare-brief",
    category: "writing",
    title: {
      en: "Model comparison brief",
      "pt-br": "Brief de comparação de modelos",
    },
    prompt: `Write a 60-90 word English product brief recommending when to pick a cheap model vs a flagship model for production. Requirements:
- Include the exact phrase "cost per token"
- Include the exact phrase "context window"
- Do not use the words "always" or "never"
- Use exactly 2 short paragraphs`,
    requiredPhrases: ["cost per token", "context window"],
    forbiddenPhrases: ["always", "never"],
    minWords: 60,
    maxWords: 90,
    requiresHumanReview: true,
    humanWeight: 0.6,
  },
  {
    id: "ptbr-explain-llm",
    category: "pt-br",
    title: {
      en: "Explain LLM in Portuguese",
      "pt-br": "Explicar LLM em português",
    },
    prompt: `Escreva em português do Brasil (70-110 palavras) explicando o que é um LLM para uma pessoa leiga. Requisitos:
- Inclua a frase exata "modelo de linguagem"
- Inclua a frase exata "não substitui"
- Não use anglicismos desnecessários como "prompt engineering"
- Termine com uma pergunta em português`,
    requiredPhrases: ["modelo de linguagem", "não substitui"],
    forbiddenPhrases: ["prompt engineering"],
    minWords: 70,
    maxWords: 110,
    requiresHumanReview: true,
    humanWeight: 0.6,
  },
  {
    id: "ptbr-study-plan",
    category: "pt-br",
    title: {
      en: "Study plan in Portuguese",
      "pt-br": "Plano de estudos em português",
    },
    prompt: `Monte um plano de estudos em português do Brasil (80-120 palavras) para alguém que quer comparar LLMs com critérios honestos. Requisitos:
- Inclua a frase exata "custo por token"
- Inclua a frase exata "fonte oficial"
- Liste exatamente 3 passos numerados (1., 2., 3.)
- Não mencione nomes de empresas de IA`,
    requiredPhrases: ["custo por token", "fonte oficial"],
    forbiddenPhrases: ["openai", "anthropic", "google", "meta", "mistral", "deepseek"],
    minWords: 80,
    maxWords: 120,
    requiresHumanReview: true,
    humanWeight: 0.6,
  },
];
