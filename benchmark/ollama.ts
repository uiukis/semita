import {
  configLocalV1,
  ollamaTagFromGatewayId,
} from "../src/data/benchmark/config-local-v1";

export type OllamaGenerateResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
};

export async function assertOllamaReady(baseUrl = configLocalV1.ollamaBaseUrl) {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) {
      throw new Error(`Ollama responded ${response.status}`);
    }
  } catch {
    throw new Error(
      `Ollama not reachable at ${baseUrl}. Install from https://ollama.com/download (macOS / Windows / Linux), then start the app or run: ollama serve`,
    );
  }
}

export async function listOllamaTags(
  baseUrl = configLocalV1.ollamaBaseUrl,
): Promise<string[]> {
  const response = await fetch(`${baseUrl}/api/tags`, {
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    throw new Error(`Failed to list Ollama tags (${response.status})`);
  }
  const data = (await response.json()) as {
    models?: Array<{ name: string }>;
  };
  return (data.models ?? []).map((model) => model.name);
}

export function resolveInstalledTag(
  wanted: string,
  installed: string[],
): string | null {
  if (installed.includes(wanted)) {
    return wanted;
  }
  const wantedBase = wanted.split(":")[0] ?? wanted;
  const prefix = installed.find(
    (name) => name === wantedBase || name.startsWith(`${wantedBase}:`),
  );
  return prefix ?? null;
}

export async function generateWithOllama(options: {
  gatewayModelId: string;
  prompt: string;
  temperature: number;
  maxOutputTokens: number;
  timeoutMs: number;
  baseUrl?: string;
}): Promise<OllamaGenerateResult> {
  const baseUrl = options.baseUrl ?? configLocalV1.ollamaBaseUrl;
  const tag = ollamaTagFromGatewayId(options.gatewayModelId);
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(options.timeoutMs),
    body: JSON.stringify({
      model: tag,
      stream: false,
      messages: [{ role: "user", content: options.prompt }],
      options: {
        temperature: options.temperature,
        num_predict: options.maxOutputTokens,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama ${tag} failed (${response.status}): ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    message?: { content?: string };
    prompt_eval_count?: number;
    eval_count?: number;
  };

  return {
    text: data.message?.content ?? "",
    inputTokens: data.prompt_eval_count ?? 0,
    outputTokens: data.eval_count ?? 0,
  };
}
