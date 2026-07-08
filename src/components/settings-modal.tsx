import { useState, useEffect } from "react";
import { RiCloseLine, RiSettings3Line, RiSave3Line } from "@remixicon/react";
import { CustomConfig } from "@/lib/types/models";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CustomConfig;
  onSave: (config: CustomConfig) => void;
}

export function SettingsModal({ isOpen, onClose, config, onSave }: SettingsModalProps) {
  const [localConfig, setLocalConfig] = useState<CustomConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--cream-bg)] border-4 border-[var(--navy-main)] rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[8px_8px_0_0_var(--navy-main)]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-[var(--navy-main)] bg-[var(--teal-main)] text-white rounded-t-[28px]">
          <div className="flex items-center gap-3">
            <RiSettings3Line className="w-6 h-6" />
            <h2 className="text-2xl font-extrabold uppercase tracking-tight">API Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--navy-main)] text-white hover:bg-[var(--orange-accent)] transition-colors border-2 border-[var(--navy-main)]"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8">
          <div className="space-y-4">
            <p className="text-[var(--navy-main)] font-bold text-sm uppercase opacity-80 border-l-4 border-[var(--orange-accent)] pl-4">
              Bring Your Own Key (BYOK). Values entered here are stored locally in your browser and override the server's default configuration.
            </p>
            <p className="text-[var(--teal-main)] font-bold text-xs uppercase opacity-80 border-l-4 border-[var(--teal-main)] pl-4 bg-[var(--teal-main)]/10 p-2 rounded-r-lg">
              (And if you have trust issues like me, the keys are stored strictly in your browser's local storage. Check the code yourself at <a href="<github repo link>" target="_blank" rel="noreferrer" className="underline hover:text-[var(--orange-accent)] transition-colors">&lt;github repo link&gt;</a>)
            </p>
          </div>

          <div className="space-y-6">
            {/* OpenAI */}
            <div className="space-y-3 bg-white p-5 border-2 border-[var(--navy-main)] rounded-2xl">
              <h3 className="text-lg font-extrabold uppercase text-[var(--teal-main)] flex items-center gap-2">
                OpenAI
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">API Key</label>
                <input 
                  type="password" 
                  name="openaiKey"
                  value={localConfig.openaiKey || ""}
                  onChange={handleChange}
                  placeholder="sk-..." 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">Base URL (Optional)</label>
                <input 
                  type="text" 
                  name="openaiUrl"
                  value={localConfig.openaiUrl || ""}
                  onChange={handleChange}
                  placeholder="https://api.openai.com/v1" 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">Model (Optional)</label>
                <input 
                  type="text" 
                  name="openaiModel"
                  value={localConfig.openaiModel || ""}
                  onChange={handleChange}
                  placeholder="gpt-4o" 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
            </div>

            {/* Claude */}
            <div className="space-y-3 bg-white p-5 border-2 border-[var(--navy-main)] rounded-2xl">
              <h3 className="text-lg font-extrabold uppercase text-[var(--teal-main)] flex items-center gap-2">
                Claude (Anthropic)
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">API Key</label>
                <input 
                  type="password" 
                  name="claudeKey"
                  value={localConfig.claudeKey || ""}
                  onChange={handleChange}
                  placeholder="sk-ant-..." 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">Base URL (Optional)</label>
                <input 
                  type="text" 
                  name="claudeUrl"
                  value={localConfig.claudeUrl || ""}
                  onChange={handleChange}
                  placeholder="https://api.anthropic.com/v1" 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">Model (Optional)</label>
                <input 
                  type="text" 
                  name="claudeModel"
                  value={localConfig.claudeModel || ""}
                  onChange={handleChange}
                  placeholder="claude-3-5-sonnet-latest" 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
            </div>

            {/* Grok */}
            <div className="space-y-3 bg-white p-5 border-2 border-[var(--navy-main)] rounded-2xl">
              <h3 className="text-lg font-extrabold uppercase text-[var(--teal-main)] flex items-center gap-2">
                Grok (X.ai)
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">API Key</label>
                <input 
                  type="password" 
                  name="grokKey"
                  value={localConfig.grokKey || ""}
                  onChange={handleChange}
                  placeholder="xai-..." 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">Base URL (Optional)</label>
                <input 
                  type="text" 
                  name="grokUrl"
                  value={localConfig.grokUrl || ""}
                  onChange={handleChange}
                  placeholder="https://api.x.ai/v1" 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">Model (Optional)</label>
                <input 
                  type="text" 
                  name="grokModel"
                  value={localConfig.grokModel || ""}
                  onChange={handleChange}
                  placeholder="grok-beta" 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
            </div>

            {/* Gemini */}
            <div className="space-y-3 bg-white p-5 border-2 border-[var(--navy-main)] rounded-2xl">
              <h3 className="text-lg font-extrabold uppercase text-[var(--teal-main)] flex items-center gap-2">
                Gemini (Google)
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">API Key</label>
                <input 
                  type="password" 
                  name="geminiKey"
                  value={localConfig.geminiKey || ""}
                  onChange={handleChange}
                  placeholder="AIza..." 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">Base URL (Optional)</label>
                <input 
                  type="text" 
                  name="geminiUrl"
                  value={localConfig.geminiUrl || ""}
                  onChange={handleChange}
                  placeholder="https://generativelanguage.googleapis.com/v1beta/openai/" 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[var(--navy-main)]">Model (Optional)</label>
                <input 
                  type="text" 
                  name="geminiModel"
                  value={localConfig.geminiModel || ""}
                  onChange={handleChange}
                  placeholder="gemini-1.5-pro-latest" 
                  className="w-full bg-[var(--cream-bg)] border-2 border-[var(--navy-main)] rounded-lg p-3 text-sm font-bold text-[var(--navy-main)] outline-none focus:border-[var(--teal-main)]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-4 border-[var(--navy-main)] bg-white rounded-b-[28px] flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-[var(--teal-main)] text-white font-bold px-8 py-3 rounded-full hover:bg-[var(--navy-main)] transition-colors flex items-center gap-2 uppercase tracking-wider border-2 border-[var(--navy-main)]"
          >
            <RiSave3Line className="w-5 h-5" />
            Save Configuration
          </button>
        </div>

      </div>
    </div>
  );
}
