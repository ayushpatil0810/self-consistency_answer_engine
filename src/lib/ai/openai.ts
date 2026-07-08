import OpenAI from "openai";
import { ModelResponse } from "../types/models";
import { measureLatency } from "../utils/latency";
import { withTimeout } from "../utils/timeout";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key",
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function generateOpenAIResponse(prompt: string): Promise<ModelResponse> {
  const modelName = process.env.OPENAI_MODEL || "gpt-4o";

  try {
    const { result, latency } = await measureLatency(() =>
      withTimeout(
        openaiClient.chat.completions.create({
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
        "OpenAI request timed out"
      )
    );

    console.log(`[OpenAI] Call completed successfully in ${latency}ms`);

    const answer = result.choices[0]?.message?.content || null;
    const usage = result.usage
      ? {
          promptTokens: result.usage.prompt_tokens,
          completionTokens: result.usage.completion_tokens,
          totalTokens: result.usage.total_tokens,
        }
      : null;

    return {
      model: "OpenAI",
      success: true,
      answer,
      latency,
      usage,
    };
  } catch (error: unknown) {
    console.log(`[OpenAI] Call failed`);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      model: "OpenAI",
      success: false,
      answer: null,
      error: errorMessage || "Unknown error",
      latency: 0,
      usage: null,
    };
  }
}
