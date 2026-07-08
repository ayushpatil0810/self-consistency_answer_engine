import OpenAI from "openai";
import { ModelResponse } from "../types/models";
import { measureLatency } from "../utils/latency";
import { withTimeout } from "../utils/timeout";

const geminiClient = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy_key",
  baseURL: process.env.GEMINI_BASE_URL,
});

export async function generateGeminiResponse(prompt: string): Promise<ModelResponse> {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-pro-latest";

  try {
    const { result, latency } = await measureLatency(() =>
      withTimeout(
        geminiClient.chat.completions.create({
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
        "Gemini request timed out"
      )
    );

    console.log(`[Gemini] Call completed successfully in ${latency}ms`);

    const answer = result.choices[0]?.message?.content || null;
    const usage = result.usage
      ? {
          promptTokens: result.usage.prompt_tokens,
          completionTokens: result.usage.completion_tokens,
          totalTokens: result.usage.total_tokens,
        }
      : null;

    return {
      model: "Gemini",
      success: true,
      answer,
      latency,
      usage,
    };
  } catch (error: unknown) {
    console.log(`[Gemini] Call failed`);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      model: "Gemini",
      success: false,
      answer: null,
      error: errorMessage || "Unknown error",
      latency: 0,
      usage: null,
    };
  }
}
