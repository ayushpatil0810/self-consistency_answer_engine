"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  RiBrainLine, 
  RiOpenaiFill, 
  RiGeminiFill, 
  RiTwitterXFill, 
  RiMagicLine, 
  RiLoader4Line, 
  RiErrorWarningLine,
  RiTimeLine,
  RiDatabase2Line,
  RiSearchLine,
  RiSettings3Line
} from "@remixicon/react";
import { ModelResponse, CustomConfig } from "@/lib/types/models";
import { SettingsModal } from "@/components/settings-modal";

const getIconForModel = (model: string) => {
  switch (model.toLowerCase()) {
    case "openai": return <RiOpenaiFill className="w-5 h-5" />;
    case "grok": return <RiTwitterXFill className="w-5 h-5" />;
    case "gemini": return <RiGeminiFill className="w-5 h-5" />;
    default: return <RiBrainLine className="w-5 h-5" />;
  }
};

const getColorClassForModel = (model: string) => {
  switch (model.toLowerCase()) {
    case "openai": return "text-[var(--teal-main)] bg-[var(--teal-main)]/10";
    case "grok": return "text-white bg-[var(--navy-main)]";
    case "gemini": return "text-white bg-[var(--orange-accent)]";
    default: return "text-[var(--navy-main)] bg-black/10";
  }
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{
    responses: ModelResponse[];
    final: string;
  } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [config, setConfig] = useState<CustomConfig>({});

  useEffect(() => {
    const savedConfig = localStorage.getItem("real_fiesta_config");
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (err) {
        console.error("Failed to parse config from local storage", err);
      }
    }
  }, []);

  const handleSaveConfig = (newConfig: CustomConfig) => {
    setConfig(newConfig);
    localStorage.setItem("real_fiesta_config", JSON.stringify(newConfig));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, config }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error ${res.status}`);
      }

      if (!res.body) throw new Error("No response body stream.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let currentFinal = "";
      let currentResponses: ModelResponse[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const parsed = JSON.parse(line);
            if (parsed.type === "models") {
              currentResponses = parsed.data;
              setResults({ responses: currentResponses, final: currentFinal });
            } else if (parsed.type === "text") {
              currentFinal += parsed.data;
              setResults({ responses: currentResponses, final: currentFinal });
            } else if (parsed.type === "error") {
              setError(parsed.error);
            }
          } catch {
            console.error("Failed to parse stream chunk", line);
          }
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream-bg)] text-[var(--navy-main)] font-sans selection:bg-[var(--teal-main)] selection:text-white pb-24">
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-6 right-6 w-12 h-12 rounded-full bg-[var(--cream-bg)] border-4 border-[var(--navy-main)] flex items-center justify-center text-[var(--navy-main)] hover:bg-[var(--teal-main)] hover:text-white transition-colors z-40 shadow-[4px_4px_0_0_var(--navy-main)]"
        title="Settings"
      >
        <RiSettings3Line className="w-6 h-6" />
      </button>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        config={config} 
        onSave={handleSaveConfig} 
      />

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-16 space-y-24">
        {/* HERO SECTION */}
        <section className="max-w-3xl mx-auto text-center space-y-10">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight uppercase text-[var(--teal-main)]">
              Real <span className="text-[var(--orange-accent)]">Fiesta</span>
            </h2>
            <p className="text-lg md:text-xl text-[var(--navy-main)] font-semibold max-w-2xl mx-auto leading-relaxed">
              We consult three distinct models: OpenAI, Grok, and Gemini, and weave their insights into a singular, masterfully crafted response.
            </p>
            
            <div className="bg-[var(--teal-main)]/10 border-l-4 border-[var(--teal-main)] p-4 md:p-5 text-left rounded-r-lg max-w-2xl mx-auto flex items-start gap-4">
              <RiSettings3Line className="w-6 h-6 text-[var(--teal-main)] shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-[var(--navy-main)]">Hey, just a heads up before you start:</p>
                <ul className="text-sm font-semibold text-[var(--navy-main)]/90 space-y-1.5 list-disc list-inside">
                  <li>
                    Add your API keys in the <button onClick={() => setIsSettingsOpen(true)} className="underline font-bold text-[var(--teal-main)] hover:text-[var(--orange-accent)] transition-colors">Settings</button> (top right) to use this app.
                  </li>
                  <li>
                    <strong>Privacy First:</strong> Your keys are strictly stored in your browser's local storage. If you have trust issues like me, <a href="<github repo link>" target="_blank" rel="noreferrer" className="underline font-bold text-[var(--teal-main)] hover:text-[var(--orange-accent)] transition-colors">check the code here</a>.
                  </li>
                  <li>
                    <strong>Complete Flexibility:</strong> It's not compulsory to use the actual models (OpenAI, Grok, etc.). Any OpenAI SDK-compatible API (like DeepSeek, Ollama, vLLM) will work perfectly fine. Just enter the compatible Base URL and Model name!
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="bg-[var(--cream-bg)] rounded-[32px] border-4 border-[var(--navy-main)] overflow-hidden flex flex-col relative focus-within:border-[var(--teal-main)] transition-colors">
              <div className="absolute top-6 left-6 text-[var(--navy-main)] opacity-50">
                <RiSearchLine className="w-6 h-6" />
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Pose a complex query or ask for an analysis..."
                className="w-full bg-transparent p-6 pl-16 md:p-8 md:pl-16 text-lg md:text-xl font-bold outline-none resize-none min-h-[140px] placeholder:text-[var(--navy-main)] placeholder:opacity-40 text-[var(--navy-main)]"
                disabled={loading}
              />
              <div className="bg-white border-t-4 border-[var(--navy-main)] p-4 flex justify-between items-center rounded-b-[28px]">
                <span className="text-sm font-bold text-[var(--navy-main)] flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-6 h-6 rounded-full bg-[var(--teal-main)] text-white flex items-center justify-center">
                    <RiMagicLine className="w-3 h-3" />
                  </span>
                  Auto-Eval
                </span>
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="bg-[var(--teal-main)] text-white font-bold px-6 py-3 rounded-full hover:bg-[var(--navy-main)] hover:border-[var(--navy-main)] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 uppercase tracking-wider border-2 border-[var(--teal-main)] border-r-0"
                  style={{
                    boxShadow: 'inset 0 0 0 2px var(--cream-bg)',
                    borderRight: '1px solid var(--cream-bg)'
                  }}
                >
                  {loading ? (
                    <>
                      <RiLoader4Line className="w-5 h-5 animate-spin" />
                      GENERATING
                    </>
                  ) : (
                    "GENERATE"
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-8 flex items-center gap-3 text-white bg-[var(--orange-accent)] p-4 rounded-xl border-4 border-[var(--navy-main)] max-w-xl mx-auto text-left font-bold">
              <RiErrorWarningLine className="w-6 h-6 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </section>

        {/* RESULTS SECTION */}
        {results && (
          <section className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
            {/* FINAL SYNTHESIS */}
            <div className="relative border-4 border-[var(--navy-main)] rounded-[32px] bg-white overflow-hidden">
              <div className="bg-[var(--teal-main)] border-b-4 border-[var(--navy-main)] p-6 md:p-8 flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] flex items-center justify-center">
                  <RiMagicLine className="w-6 h-6 text-[var(--navy-main)]" />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">
                  The Final Synthesis
                </h3>
              </div>
              <div className="p-8 md:p-12">
                <div className="prose prose-lg prose-zinc max-w-none font-medium leading-relaxed text-[var(--navy-main)] min-h-[4rem]">
                  {results.final ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {results.final}
                    </ReactMarkdown>
                  ) : (
                    <div className="flex items-center gap-4 text-[var(--teal-main)] font-bold uppercase">
                      <div className="flex gap-1">
                        <span className="w-3 h-3 bg-[var(--teal-main)] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                        <span className="w-3 h-3 bg-[var(--teal-main)] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                        <span className="w-3 h-3 bg-[var(--teal-main)] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                      </div>
                      Evaluating responses...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RAW OUTPUTS */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b-4 border-[var(--navy-main)] pb-4">
                <h4 className="text-2xl font-extrabold uppercase text-[var(--navy-main)]">Raw Outputs</h4>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--orange-accent)]"></span>
                  <span className="w-3 h-3 rounded-full bg-[var(--teal-main)]"></span>
                  <span className="w-3 h-3 rounded-full bg-[var(--navy-main)]"></span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.responses.map((modelRes, idx) => (
                  <div key={modelRes.model} className="bg-[var(--cream-bg)] border-4 border-[var(--navy-main)] rounded-2xl overflow-hidden flex flex-col hover:translate-y-1 transition-transform">
                    <div className="bg-white border-b-4 border-[var(--navy-main)] p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-[var(--navy-main)] ${getColorClassForModel(modelRes.model)}`}>
                          {getIconForModel(modelRes.model)}
                        </div>
                        <h5 className="text-lg font-extrabold uppercase text-[var(--navy-main)]">{modelRes.model}</h5>
                      </div>
                      <span className="text-[var(--navy-main)] font-black opacity-30 text-xl">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 p-4 border-b-4 border-[var(--navy-main)] bg-[var(--teal-main)]/5">
                      <div className="bg-white border-2 border-[var(--navy-main)] rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-bold text-[var(--navy-main)] uppercase">
                        <RiTimeLine className="w-3.5 h-3.5" />
                        {modelRes.latency}ms
                      </div>
                      {modelRes.usage && (
                        <div className="bg-white border-2 border-[var(--navy-main)] rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-bold text-[var(--navy-main)] uppercase">
                          <RiDatabase2Line className="w-3.5 h-3.5" />
                          {modelRes.usage.totalTokens} tks
                        </div>
                      )}
                      {!modelRes.success && (
                        <div className="bg-[var(--orange-accent)] text-white border-2 border-[var(--navy-main)] rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-bold uppercase">
                          <RiErrorWarningLine className="w-3.5 h-3.5" />
                          Failed
                        </div>
                      )}
                    </div>

                    <div className="p-4 md:p-6 prose prose-sm prose-zinc max-w-none font-medium leading-relaxed text-[var(--navy-main)] max-h-80 overflow-y-auto pr-2 flex-grow">
                      {modelRes.success ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {modelRes.answer || ""}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-[var(--orange-accent)] font-bold">{modelRes.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
