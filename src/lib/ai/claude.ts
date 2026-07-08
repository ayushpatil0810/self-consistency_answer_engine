import OpenAI from "openai";

export const claudeClient = new OpenAI({
  apiKey: process.env.CLAUDE_API_KEY || "dummy_key",
  baseURL: process.env.CLAUDE_BASE_URL,
});
