# Real Fiesta: Self-Consistency Answer Engine

Real Fiesta is a powerful, retro-modern GenAI web application that leverages the **self-consistency technique** to deliver highly refined, high-quality answers. It consults multiple leading AI models simultaneously and synthesizes their insights into a single, masterfully crafted final response.

## How It Works

1. **Parallel Inference**: The engine takes your prompt and simultaneously queries three distinct models: OpenAI, Grok (X.ai), and Gemini (Google).
2. **Auto-Evaluation**: It then passes all successful responses into an evaluator model (Claude by default).
3. **Final Synthesis**: The evaluator analyzes the responses for accuracy, cross-checks for contradictions, filters out hallucinations, and merges complementary information to produce the ultimate answer.

## Bring Your Own Key (BYOK)

Real Fiesta is designed with a **Bring Your Own Key** architecture. 
- You do not need a centralized backend filled with paid API keys. 
- You can simply click the **Settings** cog in the top right corner of the application to enter your own API Keys, custom Base URLs, and specific Model names.
- **Flexibility**: You are not required to use the actual providers (OpenAI, Anthropic, X.ai, Google). Because the engine uses the OpenAI SDK format under the hood, **any OpenAI-compatible API** (such as DeepSeek, local models via Ollama or vLLM, Together AI, etc.) will work perfectly fine. Just plug in the compatible Base URL, API Key, and Model name.
- **Privacy First**: All keys entered via the UI are stored securely in your browser's `localStorage`. They are never stored in a database, ensuring maximum security and trust.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (v4) with a custom flat, retro-modern aesthetic.
- **Icons**: Remix Icons
- **AI SDK**: Official `openai` SDK configured for universal compatibility across providers.

## Getting Started

If you want to provide default keys for the server environment (as a fallback when local storage keys aren't provided), create a `.env` file at the root:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o

CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_BASE_URL=https://api.anthropic.com/v1
CLAUDE_MODEL=claude-3-5-sonnet-latest

GROK_API_KEY=your_grok_api_key_here
GROK_BASE_URL=https://api.x.ai/v1
GROK_MODEL=grok-beta

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
GEMINI_MODEL=gemini-1.5-pro-latest
```

### Installation

1. Install dependencies:
```bash
npm install
# or yarn install / pnpm install
```

2. Run the development server:
```bash
npm run dev
# or yarn dev / pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Design Philosophy

Real Fiesta eschews the common "AI-generated" glossy glassmorphism look in favor of a bold, flat, retro-modern aesthetic. It relies on high-contrast colors (Navy, Teal, Cream, and Orange), solid borders, and clear typographic hierarchy using modern sans-serif fonts to deliver a premium, fast, and tactile user experience.
