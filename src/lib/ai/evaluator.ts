import { EvaluationRequest } from "../types/models";
import { claudeClient } from "./claude";

function buildEvaluatorPrompt(request: EvaluationRequest): string {
  const responsesXml = request.responses
    .filter((res) => res.success && res.answer)
    .map(
      (res) => `<response model="${res.model}">
${res.answer}
</response>`
    )
    .join("\n\n");

  return `You are an expert AI evaluator and master synthesizer of information.

The user asked the following question:
<user_question>
${request.prompt}
</user_question>

Multiple AI models provided the following answers:
<responses>
${responsesXml}
</responses>

Your task:
1. Internally evaluate each answer using the following criteria: Accuracy, Completeness, Clarity, Reasoning quality, and Helpfulness.
2. Compare every answer to detect factual mistakes and contradictions.
3. Ignore hallucinations and prefer consensus when possible.
4. Merge complementary information from all valid answers.
5. Produce one single, highly accurate, and beautifully formatted final answer for the user.

CRITICAL INSTRUCTIONS:
- DO NOT expose your internal scores or evaluation thought process.
- DO NOT explicitly state "Model X said Y".
- The final output you generate should ONLY contain the final synthesized response to the user's question.`;
}

export async function evaluateResponsesStream(request: EvaluationRequest) {
  const modelName = request.config?.claudeModel || process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest";

  console.log(`[Claude] About to call evaluateResponsesStream with model: ${modelName}`);

  const client = request.config?.claudeKey
    ? new (require("openai").default)({ apiKey: request.config.claudeKey, baseURL: request.config.claudeUrl || undefined })
    : claudeClient;

  const stream = await client.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: "system",
        content: "You are a master synthesizer of information.",
      },
      {
        role: "user",
        content: buildEvaluatorPrompt(request),
      },
    ],
    stream: true,
  });

  console.log(`[Claude] Streaming call started successfully`);

  return stream;
}
