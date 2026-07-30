export type Locale = "en" | "pt-br";

export type ModelProvider =
  | "OpenAI"
  | "Anthropic"
  | "Google"
  | "Meta"
  | "Mistral"
  | "xAI"
  | "DeepSeek"
  | "Alibaba"
  | "Microsoft"
  | "IBM"
  | "Cohere"
  | "01.AI"
  | "Other";

export type Modality = "text" | "vision" | "audio" | "code";

export type UseCase =
  | "coding"
  | "writing"
  | "research"
  | "reasoning"
  | "vision"
  | "cost-effective"
  | "local";

export type SourceKind = "pricing" | "weights" | "docs";

export type DeploymentMode = "api" | "local" | "both";

export type LocalRuntime =
  | "ollama"
  | "lmstudio"
  | "llamacpp"
  | "mlx"
  | "vllm"
  | "other";

export type HardwareTier = "entry" | "mid" | "heavy";

export type HardwarePlatform = "nvidia" | "amd" | "apple" | "cpu";

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

export interface LocalizedText {
  en: string;
  "pt-br": string;
}

export interface LocalHardwareGuide {
  tier: HardwareTier;
  platform: HardwarePlatform;
  minVramGb?: number;
  minUnifiedMemoryGb?: number;
  minRamGb: number;
  exampleDevices: string[];
  notes?: LocalizedText;
}

export interface LocalDeployment {
  parameterCount: string;
  quantization: string;
  runtimes: LocalRuntime[];
  ollamaTag?: string;
  weightsUrl: string;
  comfortTiers: HardwareTier[];
  hardware: LocalHardwareGuide[];
  tips: LocalizedText;
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
  deployment: DeploymentMode;
  local?: LocalDeployment;
}
