
export enum AIModelType {
  ChatGPT = 'ChatGPT',
  Claude = 'Claude',
  Gemini = 'Gemini',
  Copilot = 'Copilot',
  Grok = 'Grok',
  Perplexity = 'Perplexity',
  NotebookLM = 'NotebookLM',
  Gamma = 'Gamma',
  Pitch = 'Pitch',
  Jasper = 'Jasper',
  Wordtune = 'Wordtune',
  QuillBot = 'QuillBot',
  NotionAI = 'Notion AI',
  Pi = 'Pi',
  Poe = 'Poe',
  DeepSeek = 'DeepSeek',
  Writesonic = 'Writesonic',
  Anyword = 'Anyword',
  LanguageTool = 'LanguageTool',
  Ginger = 'Ginger',
  ScholarPen = 'ScholarPen',
  Scifocus = 'Scifocus',
  BufferAI = 'Buffer AI',
  Lex = 'Lex',
  Gemini25Flash = 'Gemini 2.5 Flash',
  Gemini25Pro = 'Gemini 2.5 Pro',
  Claude35Haiku = 'Claude 3.5 Haiku',
  Claude45Sonnet = 'Claude 4.5 Sonnet',
  Llama33 = 'Llama 3.3',
  DiscordMaster = 'Discord Master Blend',
  ThreadsMaster = 'Threads Master Blend',
  InstagramMaster = 'Instagram Master Blend',
  FacebookMaster = 'Facebook Master Blend',
  TikTokMaster = 'TikTok Master Blend',
  BlogMaster = 'Blog Master Blend'
}

export type ModelCategory = 'Core' | 'Writing' | 'Research' | 'Social' | 'Utility';

export interface ModelResult {
  modelId: string; // Changed to string to support custom models
  category: ModelCategory;
  rewrittenText: string;
  answerText: string; // New: Direct answer to the prompt
  refinementSuggestions: string[];
  metrics: {
    clarity: number;
    creativity: number;
    conciseness: number;
    professionalism: number;
  };
  explanation: string;
  isMasterBlend?: boolean;
}

export interface ComparisonResponse {
  results: ModelResult[];
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  input: string;
  results: ModelResult[];
}
