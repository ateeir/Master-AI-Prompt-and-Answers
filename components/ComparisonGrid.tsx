
import React, { useState, useMemo, useEffect } from 'react';
import { ModelResult, AIModelType, ModelCategory } from '../types';
import { Copy, Check, MessageSquareCode, Lightbulb, Stars, Filter, Wand2, Loader2, MessageCircle, Eye, EyeOff, ChevronDown, ChevronUp, Hourglass, BrainCircuit, Sparkles } from 'lucide-react';

const ModelIcons: Record<string, string> = {
  [AIModelType.ChatGPT]: '🟢',
  [AIModelType.Claude]: '🟠',
  [AIModelType.Gemini]: '🔵',
  [AIModelType.Copilot]: '💠',
  [AIModelType.Grok]: '⚫',
  [AIModelType.Perplexity]: '⚪',
  [AIModelType.NotebookLM]: '📔',
  [AIModelType.Gamma]: '📐',
  [AIModelType.Pitch]: '📊',
  [AIModelType.Jasper]: '🐆',
  [AIModelType.Wordtune]: '✍️',
  [AIModelType.QuillBot]: '🪶',
  [AIModelType.NotionAI]: '📓',
  [AIModelType.Pi]: '🥧',
  [AIModelType.Poe]: '📜',
  [AIModelType.DeepSeek]: '🐋',
  [AIModelType.Writesonic]: '⚡',
  [AIModelType.Anyword]: '🔡',
  [AIModelType.LanguageTool]: '🛡️',
  [AIModelType.Ginger]: '🫚',
  [AIModelType.ScholarPen]: '🎓',
  [AIModelType.Scifocus]: '🔬',
  [AIModelType.BufferAI]: '📱',
  [AIModelType.Lex]: '📖',
};

const LOADING_MESSAGES = [
  "Analyzing semantic intent...",
  "Simulating model weights...",
  "Generating optimized prompt...",
  "Formatting bullet points...",
  "Applying persona constraints...",
  "Calculating performance metrics..."
];

// Sub-component for a card that is still loading
const PendingModelCard: React.FC<{ modelId: string }> = ({ modelId }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Generate a random-ish estimate based on the model name
    const baseTime = modelId.length % 5 + 6; // 6-10 seconds
    setTimeLeft(baseTime);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [modelId]);

  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-6 animate-in fade-in duration-500 h-[450px] overflow-hidden animate-float">
      {/* Background Scanner Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="animate-scan absolute w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl grayscale opacity-40 shadow-inner">
            {ModelIcons[modelId] || '🤖'}
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-slate-100 rounded animate-shimmer" />
            <div className="h-3 w-14 bg-slate-50 rounded animate-shimmer" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full text-[10px] font-bold border border-indigo-100 shadow-sm animate-pulse">
           <BrainCircuit className="w-3.5 h-3.5" />
           THINKING
        </div>
      </div>
      
      <div className="flex-grow space-y-6 flex flex-col justify-center items-center text-center px-4 relative">
        <div className="relative flex items-center justify-center">
          {/* Radar Waves */}
          <div className="absolute w-24 h-24 bg-indigo-400/10 rounded-full animate-radar" />
          <div className="absolute w-24 h-24 bg-indigo-400/5 rounded-full animate-radar [animation-delay:1s]" />
          
          <div className="w-20 h-20 border-[3px] border-slate-100 border-t-indigo-500 rounded-full animate-spin [animation-duration:1.5s] relative z-10 flex items-center justify-center bg-white shadow-xl">
             <div className="w-14 h-14 border-[1px] border-slate-50 border-b-indigo-300 rounded-full animate-spin [animation-duration:3s] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
             </div>
          </div>
        </div>

        <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-700">
          <h4 className="font-bold text-slate-800 text-base">{modelId}</h4>
          <div className="min-h-[1.5rem] flex flex-col items-center">
             <p className="text-[11px] text-slate-500 font-medium transition-all duration-500 opacity-80 italic">
               {LOADING_MESSAGES[messageIndex]}
             </p>
             <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-bold tracking-tight">
               <Hourglass className="w-3 h-3" />
               EST. {timeLeft}S
             </p>
          </div>
        </div>
      </div>

      {/* Footer Skeletons */}
      <div className="space-y-4 pt-4 border-t border-slate-50 relative z-10">
        <div className="space-y-2.5">
          <div className="h-2 w-full bg-slate-50 rounded animate-shimmer" />
          <div className="h-2 w-5/6 bg-slate-50 rounded animate-shimmer [animation-delay:0.2s]" />
          <div className="h-2 w-4/6 bg-slate-50 rounded animate-shimmer [animation-delay:0.4s]" />
        </div>
        <div className="flex gap-4 pt-2">
          <div className="h-1.5 flex-1 bg-slate-50 rounded animate-shimmer" />
          <div className="h-1.5 flex-1 bg-slate-50 rounded animate-shimmer [animation-delay:0.1s]" />
        </div>
      </div>
    </div>
  );
};

interface ComparisonGridProps {
  results: ModelResult[];
  pendingModels?: string[];
  onRefine: (modelId: string, rewrite: string) => Promise<void>;
}

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ results, pendingModels = [], onRefine }) => {
  const [activeCategory, setActiveCategory] = useState<ModelCategory | 'All'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set());

  const categories: (ModelCategory | 'All')[] = ['All', 'Core', 'Writing', 'Research', 'Social', 'Utility'];

  const filteredResults = useMemo(() => {
    let filtered = activeCategory === 'All' 
      ? results 
      : results.filter(r => r.category === activeCategory);
    
    return [...filtered].sort((a, b) => {
      if (a.isMasterBlend && !b.isMasterBlend) return -1;
      if (!a.isMasterBlend && b.isMasterBlend) return 1;
      return 0;
    });
  }, [results, activeCategory]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCollapse = (id: string) => {
    const next = new Set(collapsedCards);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedCards(next);
  };

  const handleRefineClick = async (modelId: string, rewrite: string) => {
    setRefiningId(modelId);
    try {
      await onRefine(modelId, rewrite);
    } finally {
      setRefiningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:text-indigo-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {collapsedCards.size > 0 && (
          <button 
            onClick={() => setCollapsedCards(new Set())}
            className="text-[10px] font-bold text-indigo-600 hover:underline px-2"
          >
            Expand All ({collapsedCards.size})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {filteredResults.map((res) => {
          const isCollapsed = collapsedCards.has(res.modelId);
          
          return (
            <div 
              key={res.modelId} 
              className={`relative rounded-xl border shadow-sm transition-all overflow-hidden flex flex-col group animate-in zoom-in-95 duration-500 ${
                isCollapsed
                  ? 'border-slate-200 bg-slate-50'
                  : res.isMasterBlend 
                    ? 'border-indigo-400 bg-indigo-50/10 ring-1 ring-indigo-500/10 shadow-indigo-100/20' 
                    : 'border-slate-200 bg-white hover:shadow-lg'
              }`}
            >
              {/* Collapse Toggle */}
              <button 
                onClick={() => toggleCollapse(res.modelId)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-md hover:bg-white/50 transition-colors text-slate-400 hover:text-indigo-600"
                title={isCollapsed ? "Expand card" : "Collapse card"}
              >
                {isCollapsed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <div className={`p-4 flex items-center justify-between pr-10 ${
                isCollapsed ? '' : (res.isMasterBlend ? 'border-b border-indigo-100 bg-indigo-100/30' : 'border-b border-slate-100 bg-slate-50/30')
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ModelIcons[res.modelId] || '🤖'}</span>
                  <div className="flex flex-col">
                    <h3 className={`font-bold text-sm ${isCollapsed ? 'text-slate-500' : (res.isMasterBlend ? 'text-indigo-800' : 'text-slate-700')}`}>
                      {res.modelId}
                    </h3>
                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">
                          {res.category}
                        </span>
                        {res.isMasterBlend && (
                          <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter flex items-center gap-0.5">
                            <Stars className="w-2.5 h-2.5" />
                            Blend
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {!isCollapsed && (
                <div className="p-5 flex-grow space-y-6 animate-in slide-in-from-top-2 duration-200">
                  {/* Rewritten Prompt */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Wand2 className="w-3 h-3" />
                        Optimized Prompt
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleRefineClick(res.modelId, res.rewrittenText)}
                          disabled={refiningId !== null}
                          className="p-1 hover:text-indigo-600 transition-colors"
                          title="Refine original"
                        >
                          {refiningId === res.modelId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => copyToClipboard(res.rewrittenText, res.modelId)} className="p-1 hover:text-indigo-600">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className={`text-xs leading-relaxed border-l-2 pl-3 py-1 italic ${
                      res.isMasterBlend ? 'text-slate-800 border-indigo-300' : 'text-slate-700 border-indigo-100'
                    }`}>
                      {res.rewrittenText}
                    </div>
                  </div>

                  {/* Chat Answer */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 relative group/answer">
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <MessageCircle className="w-3 h-3" />
                        Simulated Response
                      </div>
                      <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {res.answerText}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(res.answerText, res.modelId + '_answer')} 
                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-indigo-500 opacity-0 group-hover/answer:opacity-100 transition-opacity"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-slate-50">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        Strategy
                      </div>
                      <ul className="space-y-1">
                        {res.refinementSuggestions.slice(0, 2).map((s, idx) => (
                          <li key={idx} className="text-[10px] text-slate-500 flex gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={`px-2 py-2 border-t flex gap-4 text-[9px] font-bold ${
                    res.isMasterBlend ? 'border-indigo-100 text-indigo-400' : 'border-slate-100 text-slate-400'
                  }`}>
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between">
                        <span>CLARITY</span>
                        <span>{(res.metrics.clarity * 10).toFixed(0)}</span>
                      </div>
                      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${res.metrics.clarity * 100}%` }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between">
                        <span>STYLE</span>
                        <span>{(res.metrics.creativity * 10).toFixed(0)}</span>
                      </div>
                      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400" style={{ width: `${res.metrics.creativity * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Pending Card Placeholders */}
        {pendingModels.map((m) => (
          <PendingModelCard key={m} modelId={m} />
        ))}
      </div>
    </div>
  );
};

export default ComparisonGrid;
