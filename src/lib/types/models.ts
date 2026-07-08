export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ModelResponse {
  model: string;
  success: boolean;
  answer: string | null;
  error?: string;
  latency: number;
  usage: TokenUsage | null;
}

export interface EvaluationRequest {
  prompt: string;
  responses: ModelResponse[];
}
