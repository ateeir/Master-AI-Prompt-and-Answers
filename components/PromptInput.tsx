
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Wand2, ChevronDown, Check, Plus, Search, LayoutTemplate, Sparkles } from 'lucide-react';
import { enhancePrompt } from '../services/geminiService';
import { AIModelType } from '../types';

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  onRun: (selectedModels: string[]) => void;
  isLoading: boolean;
  availableModels: string[];
  onAddCustomModel: (name: string) => void;
}

const TEMPLATES = [
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    prompt: 'Act as an expert Data Analyst. I will provide a dataset or scenario. Your job is to extract 5 actionable insights, identify key trends, and suggest 3 ways to visualize this data effectively:\n\n[Insert Data/Scenario Here]'
  },
  {
    id: 'designer',
    name: 'UI/UX Designer',
    prompt: 'Act as a Senior UI/UX Designer. Critique the following design concept or user flow: [Insert Concept]. Provide feedback on usability, accessibility, and visual hierarchy. Suggest 3 specific improvements.'
  },
  {
    id: 'researcher',
    name: 'Academic Researcher',
    prompt: 'Act as a PhD Researcher. Provide a deep-dive summary on [Topic]. Include the current state of research, key academic debates, and 5 foundational papers or sources to explore.'
  },
  {
    id: 'media-specialist',
    name: 'Media Specialist',
    prompt: 'Act as a Digital Media Specialist. Develop a cross-platform distribution strategy for [Content/Campaign]. Suggest specific formats for TikTok, LinkedIn, and YouTube, including optimal posting times.'
  },
  {
    id: 'marketer',
    name: 'Growth Marketer',
    prompt: 'Act as a Growth Marketer. Create a high-converting landing page structure for [Product]. Include a compelling H1, problem/solution sections, social proof placement, and a strong CTA.'
  },
  {
    id: 'brand-manager',
    name: 'Brand Manager',
    prompt: 'Act as a Brand Manager. Analyze the brand consistency of the following message: [Insert Message]. Ensure it aligns with a [Voice: e.g., Bold/Minimalist] identity and suggest ways to strengthen brand recall.'
  },
  {
    id: 'client-lead',
    name: 'Client Success Lead',
    prompt: 'Act as a Client Success Lead. Draft a response to a client who is [Status: e.g., unhappy with a delay]. Maintain a firm but empathetic tone, prioritize the long-term relationship, and offer a clear resolution.'
  },
  {
    id: 'blog-ideas',
    name: 'Blog Post Idea Generator',
    prompt: 'Act as a viral content strategist. Generate 10 catchy and unique blog post ideas about [Topic]. Include a target audience and a sample headline for each.'
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer',
    prompt: 'Explain the following code in simple terms that a non-programmer could understand. Highlight the main logic and any potential edge cases:\n\n[Insert Code Here]'
  }
];

const PromptInput: React.FC<PromptInputProps> = ({ 
  value, 
  onChange, 
  onRun, 
  isLoading, 
  availableModels,
  onAddCustomModel
}) => {
  const [isRefining, setIsRefining] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set(['ChatGPT', 'Claude', 'Gemini', 'Perplexity']));
  const [searchTerm, setSearchTerm] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
      if (templatesRef.current && !templatesRef.current.contains(event.target as Node)) {
        setIsTemplatesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefine = async () => {
    if (!value.trim()) return;
    setIsRefining(true);
    try {
      const refined = await enhancePrompt(value);
      onChange(refined);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefining(false);
    }
  };

  const toggleModel = (model: string) => {
    const next = new Set(selectedModels);
    if (next.has(model)) next.delete(model);
    else next.add(model);
    setSelectedModels(next);
  };

  const filteredModels = availableModels.filter(m => 
    m.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllFilteredSelected = filteredModels.length > 0 && filteredModels.every(m => selectedModels.has(m));

  const handleSelectAll = () => {
    const next = new Set(selectedModels);
    if (isAllFilteredSelected) {
      filteredModels.forEach(m => next.delete(m));
    } else {
      filteredModels.forEach(m => next.add(m));
    }
    setSelectedModels(next);
  };

  const handleAddCustom = () => {
    if (customModelName.trim()) {
      onAddCustomModel(customModelName.trim());
      setSelectedModels(prev => new Set(prev).add(customModelName.trim()));
      setCustomModelName('');
    }
  };

  const applyTemplate = (templatePrompt: string) => {
    onChange(templatePrompt);
    setIsTemplatesOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Selection Control Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {/* Templates Dropdown */}
        <div className="relative" ref={templatesRef}>
          <button
            onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition-all text-xs font-bold text-indigo-600 shadow-sm"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            Templates
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTemplatesOpen ? 'rotate-180' : ''}`} />
          </button>

          {isTemplatesOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-[60] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-150">
              <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Templates</span>
              </div>
              <div className="max-h-80 overflow-y-auto p-1 custom-scrollbar">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t.prompt)}
                    className="w-full text-left px-3 py-2.5 rounded-md hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors mb-0.5">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">
                      {t.prompt}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        {/* Models Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-bold text-slate-600 shadow-sm"
          >
            Select Models ({selectedModels.size})
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSelectorOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-[60] overflow-hidden flex flex-col max-h-80 animate-in fade-in zoom-in duration-150">
              <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none text-slate-700"
                />
              </div>

              {/* Select All Toggle */}
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-white">
                <button 
                  onClick={handleSelectAll}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors"
                >
                  {isAllFilteredSelected ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {filteredModels.length} Models
                </span>
              </div>

              <div className="flex-grow overflow-y-auto p-1 custom-scrollbar">
                {filteredModels.length > 0 ? (
                  filteredModels.map((model) => (
                    <button
                      key={model}
                      onClick={() => toggleModel(model)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                    >
                      {model}
                      {selectedModels.has(model) && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No models found
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-slate-100 bg-slate-50 flex items-center gap-1">
                <input 
                  type="text" 
                  placeholder="Add custom model..."
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                  className="bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs w-full outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button 
                  onClick={handleAddCustom}
                  className="p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {Array.from(selectedModels).slice(0, 3).map(m => (
            <span key={m} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100">
              {m}
            </span>
          ))}
          {selectedModels.size > 3 && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">
              +{selectedModels.size - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your text or prompt here..."
          className="w-full min-h-[160px] p-4 text-lg border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none bg-slate-50/50"
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <button
            onClick={handleRefine}
            disabled={isLoading || isRefining || !value.trim()}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold border transition-all ${
              isLoading || isRefining || !value.trim()
              ? 'border-slate-100 text-slate-300 cursor-not-allowed'
              : 'border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50 hover:border-indigo-300'
            }`}
          >
            {isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span className="hidden md:inline">Refine</span>
          </button>

          <button
            onClick={() => onRun(Array.from(selectedModels))}
            disabled={isLoading || isRefining || !value.trim() || selectedModels.size === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all ${
              isLoading || isRefining || !value.trim() || selectedModels.size === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Compare Models
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
