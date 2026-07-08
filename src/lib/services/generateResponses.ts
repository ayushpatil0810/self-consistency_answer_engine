import { ModelResponse } from "../types/models";
import { generateOpenAIResponse } from "../ai/openai";
import { generateGrokResponse } from "../ai/grok";
import { generateGeminiResponse } from "../ai/gemini";

export async function executeAllModels(prompt: string): Promise<ModelResponse[]> {
  const results = await Promise.all([
    generateOpenAIResponse(prompt),
    generateGrokResponse(prompt),
    generateGeminiResponse(prompt),
  ]);

  return results;
}
