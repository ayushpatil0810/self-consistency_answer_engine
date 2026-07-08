import { ModelResponse, CustomConfig } from "../types/models";
import { generateOpenAIResponse } from "../ai/openai";
import { generateGrokResponse } from "../ai/grok";
import { generateGeminiResponse } from "../ai/gemini";

export async function executeAllModels(prompt: string, config?: CustomConfig): Promise<ModelResponse[]> {
  const results = await Promise.all([
    generateOpenAIResponse(prompt, config),
    generateGrokResponse(prompt, config),
    generateGeminiResponse(prompt, config),
  ]);

  return results;
}
