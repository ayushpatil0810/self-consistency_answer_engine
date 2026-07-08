# Real Fiesta
**Not the German one**

Real Fiesta is a GenAI application that leverages the self-consistency technique to provide highly refined, high-quality answers. It consults multiple AI models (OpenAI, Grok, and Gemini) in parallel, and then synthesizes a masterfully crafted final response using Claude as the evaluator.

## Getting Started

First, rename or ensure your `.env` file is populated with the correct API keys and base URLs:

```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_BASE_URL=https://api.anthropic.com/v1
GROK_API_KEY=your_grok_api_key_here
GROK_BASE_URL=https://api.x.ai/v1
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
