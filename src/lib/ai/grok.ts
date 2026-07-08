import OpenAI from "openai";
import { ModelResponse, CustomConfig } from "../types/models";
import { measureLatency } from "../utils/latency";
import { withTimeout } from "../utils/timeout";

const globalGrokClient = new OpenAI({
  apiKey: process.env.GROK_API_KEY || "dummy_key",
  baseURL: process.env.GROK_BASE_URL,
});

export async function generateGrokResponse(prompt: string, config?: CustomConfig): Promise<ModelResponse> {
  const modelName = config?.grokModel || process.env.GROK_MODEL || "grok-beta";

  const client = config?.grokKey
    ? new OpenAI({ apiKey: config.grokKey, baseURL: config.grokUrl || undefined })
    : globalGrokClient;

  try {
    const { result, latency } = await measureLatency(() =>
      withTimeout(
        client.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: "system",
              content: "You are a helpful and highly capable AI assistant. Answer the user's prompt thoughtfully and accurately.",
            },
            { role: "user", content: prompt },
          ],
        }),
        30000,
        "Grok request timed out"
      )
    );

    console.log(`[Grok] Call completed successfully in ${latency}ms`);

    const answer = result.choices[0]?.message?.content || null;
    const usage = result.usage
      ? {
          promptTokens: result.usage.prompt_tokens,
          completionTokens: result.usage.completion_tokens,
          totalTokens: result.usage.total_tokens,
        }
      : null;

    return {
      model: "Grok",
      success: true,
      answer,
      latency,
      usage,
    };
  } catch (error: unknown) {
    console.log(`[Grok] Call failed`);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      model: "Grok",
      success: false,
      answer: null,
      error: errorMessage || "Unknown error",
      latency: 0,
      usage: null,
    };
  }
}
