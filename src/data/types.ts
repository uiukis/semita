export type Locale = "en" | "pt-br";

export type ModelProvider =
  | "OpenAI"
  | "Anthropic"
  | "Google"
  | "Meta"
  | "Mistral"
  | "xAI"
  | "DeepSeek"
  | "Other";

export type Modality = "text" | "vision" | "audio" | "code";

export type UseCase =
  | "coding"
  | "writing"
  | "research"
  | "reasoning"
  | "vision"
  | "cost-effective";

export type SourceKind = "pricing";

export interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
  currency: "USD";
}

export interface Benchmark {
  name: string;
  score: string;
  sourceUrl: string;
}

export interface SourceRef {
  kind: SourceKind;
  url: string;
}

export interface LocalizedModelContent {
  summary: string;
  goodFor: string;
  strengths: string[];
  communityNotes: string;
}

export interface LlmModel {
  slug: string;
  name: string;
  provider: ModelProvider;
  releaseDate: string;
  contextWindow: number;
  maxOutputTokens: number;
  pricing: ModelPricing;
  modalities: Modality[];
  useCases: UseCase[];
  communityScore: number;
  benchmarks: Benchmark[];
  sources: SourceRef[];
  content: Record<Locale, LocalizedModelContent>;
  lastUpdated: string;
}
