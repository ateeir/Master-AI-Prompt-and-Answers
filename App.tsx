
import React, { useState, useCallback, useEffect } from 'react';
import { ComparisonResponse, ModelResult, AIModelType, HistoryEntry } from './types';
import { generateSingleModelOutput, refineUserPrompt } from './services/geminiService';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ComparisonGrid from './components/ComparisonGrid';
import AnalyticsView from './components/AnalyticsView';
import HistoryPanel from './components/HistoryPanel';
import { Sparkles, BarChart3, LayoutGrid, Info } from 'lucide-react';

const HISTORY_KEY = 'promptforge_history';
const CUSTOM_MODELS_KEY = 'promptforge_custom_models';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ModelResult[]>([]);
  const [pendingModels, setPendingModels] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'analytics'>('grid');
  const [error, setError] = useState<string | null>(null);
  
  // Model Management State
  const [customModels, setCustomModels] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // History State
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Initialize models and history
  useEffect(() => {
    const defaultModels = Object.values(AIModelType);
    const savedCustom = localStorage.getItem(CUSTOM_MODELS_KEY);
    let parsedCustom: string[] = [];
    if (savedCustom) {
      try { parsedCustom = JSON.parse(savedCustom); } catch (e) {}
    }
    setCustomModels(parsedCustom);
    setAvailableModels([...defaultModels, ...parsedCustom]);

    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }
  }, []);

  // Sync history and custom models
  useEffect(() => {
    if (results.length > 0 && !loading && pendingModels.length === 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  }, [history, results, loading, pendingModels]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_MODELS_KEY, JSON.stringify(customModels));
    setAvailableModels([...Object.values(AIModelType), ...customModels]);
  }, [customModels]);

  const handleCompare = useCallback(async (selectedModels: string[]) => {
    if (!input.trim() || selectedModels.length === 0) return;
    
    setLoading(true);
    setError(null);
    setResults([]);
    setPendingModels(selectedModels);

    const currentResults: ModelResult[] = [];

    // Trigger all requests in parallel
    const promises = selectedModels.map(async (modelId) => {
      try {
        const result = await generateSingleModelOutput(input, modelId);
        setResults(prev => [...prev, result]);
        currentResults.push(result);
      } catch (err) {
        console.error(`Error generating for ${modelId}:`, err);
        // We could add a "failed" state to results here
      } finally {
        setPendingModels(prev => prev.filter(m => m !== modelId));
      }
    });

    // Wait for all to finish for history purposes
    await Promise.all(promises);
    
    if (currentResults.length > 0) {
      const newEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        input: input,
        results: currentResults
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 50));
    }

    setLoading(false);
  }, [input]);

  const handleRefine = useCallback(async (modelId: string, rewrite: string) => {
    setError(null);
    try {
      const refined = await refineUserPrompt(input, rewrite, modelId);
      setInput(refined);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Failed to refine prompt. Please try again.');
    }
  }, [input]);

  const handleAddCustomModel = (name: string) => {
    if (!availableModels.includes(name)) {
      setCustomModels(prev => [...prev, name]);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setInput(entry.input);
    setResults(entry.results);
    setPendingModels([]);
    setIsHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onOpenHistory={() => setIsHistoryOpen(true)} />
      
      <HistoryPanel 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoad={loadHistoryEntry}
        onDelete={(id) => setHistory(prev => prev.filter(e => e.id !== id))}
        onClearAll={() => confirm('Clear history?') && setHistory([])}
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-8">
          
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold">
              <Sparkles className="w-5 h-5" />
              <h2>Forge Your Prompt</h2>
            </div>
            <PromptInput 
              value={input} 
              onChange={setInput} 
              onRun={handleCompare} 
              isLoading={loading}
              availableModels={availableModels}
              onAddCustomModel={handleAddCustomModel}
            />
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <Info className="w-5 h-5" />
              {error}
            </div>
          )}

          {(results.length > 0 || pendingModels.length > 0) && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-slate-800">Model Insights</h2>
                  <div className="flex bg-slate-200 p-1 rounded-lg">
                    <button 
                      onClick={() => setView('grid')}
                      className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${view === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Grid
                    </button>
                    <button 
                      onClick={() => setView('analytics')}
                      className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${view === 'analytics' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   {pendingModels.length > 0 && (
                     <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                        {pendingModels.length} models processing...
                     </div>
                   )}
                   <span className="text-sm text-slate-500">{results.length} ready</span>
                </div>
              </div>

              {view === 'grid' ? (
                <ComparisonGrid results={results} pendingModels={pendingModels} onRefine={handleRefine} />
              ) : (
                <AnalyticsView results={results} />
              )}
            </section>
          )}

          {results.length === 0 && pendingModels.length === 0 && !loading && (
            <div className="text-center py-20 opacity-40">
              <LayoutGrid className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg text-slate-500">Enter a prompt and select models to begin comparison</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <p>&copy; 2024 PromptForge AI. Multi-model simulator and refiner.</p>
      </footer>
    </div>
  );
};

export default App;
