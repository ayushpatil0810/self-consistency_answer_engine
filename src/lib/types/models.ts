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

export interface CustomConfig {
  openaiKey?: string;
  openaiUrl?: string;
  openaiModel?: string;
  claudeKey?: string;
  claudeUrl?: string;
  claudeModel?: string;
  grokKey?: string;
  grokUrl?: string;
  grokModel?: string;
  geminiKey?: string;
  geminiUrl?: string;
  geminiModel?: string;
}

export interface EvaluationRequest {
  prompt: string;
  responses: ModelResponse[];
  config?: CustomConfig;
}
