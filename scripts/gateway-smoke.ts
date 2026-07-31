import { readFileSync } from "node:fs";
import { generateText } from "ai";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    continue;
  }
  const eq = trimmed.indexOf("=");
  if (eq === -1) {
    continue;
  }
  const key = trimmed.slice(0, eq).trim();
  const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  if (!(key in process.env)) {
    process.env[key] = value;
  }
}

async function main() {
  const hasAuth = Boolean(
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  );
  if (!hasAuth) {
    throw new Error("No AI Gateway auth in env");
  }
  const result = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: "Reply with exactly: ok",
    maxOutputTokens: 8,
    temperature: 0,
  });
  console.log(
    "OK",
    JSON.stringify(result.text),
    "in",
    result.usage?.inputTokens,
    "out",
    result.usage?.outputTokens,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
