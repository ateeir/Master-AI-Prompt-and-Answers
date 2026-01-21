
import { GoogleGenAI, Type } from "@google/genai";
import { ComparisonResponse, ModelResult, AIModelType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are a meta-AI prompt engineering expert and persona simulator. 
Your task is to take a user's prompt or text and provide:
1. A REWRITE: An optimized version of their prompt tailored to a specific model's personality.
2. AN ANSWER: A direct, chat-like response to the original prompt, simulating how that specific AI would answer it.

FORMATTING RULES FOR ANSWERS:
- Use bullet points for the response (e.g., using '•' or '-').
- DO NOT use markdown bolding (avoid '**').
- Keep the language natural to the persona but strictly follow the "No Bold" rule.

Categorize the tool into one of: 'Core', 'Writing', 'Research', 'Social', 'Utility'.

PART 1: Tool DNA
- Core LLMs: Logical, broad knowledge.
- Writing: Marketing, flow, persuasion.
- Research: Academic rigor, data-rich.
- Utility: Grammar-first, coding/task-oriented.
- Social: Engaging, short-form, friendly.

PART 2: Custom Tools
If a model name is provided that isn't in your standard list, infer its "personality" based on its name and provide a distinct rewrite and answer.`;

/**
 * Generates a single model result. 
 * This allows for parallel calls and incremental UI updates.
 */
export async function generateSingleModelOutput(input: string, modelId: string): Promise<ModelResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', // Using flash for individual speed
    contents: `User Input: "${input}"\n\nGenerate a variation specifically for: ${modelId}. 
    Provide a "rewrittenText" (the better prompt) AND an "answerText" (the simulated response formatted as simple bullets without any bold markdown).`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          modelId: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['Core', 'Writing', 'Research', 'Social', 'Utility'] },
          rewrittenText: { type: Type.STRING },
          answerText: { type: Type.STRING },
          refinementSuggestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          metrics: {
            type: Type.OBJECT,
            properties: {
              clarity: { type: Type.NUMBER },
              creativity: { type: Type.NUMBER },
              conciseness: { type: Type.NUMBER },
              professionalism: { type: Type.NUMBER }
            },
            required: ["clarity", "creativity", "conciseness", "professionalism"]
          },
          explanation: { type: Type.STRING }
        },
        required: ["modelId", "category", "rewrittenText", "answerText", "refinementSuggestions", "metrics", "explanation"]
      }
    }
  });

  const text = response.text || '{}';
  const result = JSON.parse(text) as ModelResult;
  
  return {
    ...result,
    modelId, // Ensure it matches what was requested
    isMasterBlend: modelId.toString().includes('Master Blend')
  };
}

export async function enhancePrompt(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Rewrite this prompt to be more effective, clear, and structured for an AI. 
    Maintain the original intent but add necessary context, constraints, and instructions to get better results.
    
    User Input: "${prompt}"
    
    Output ONLY the improved prompt text.`,
    config: {
      systemInstruction: "You are a professional Prompt Engineer. Your goal is to turn lazy, short prompts into high-performance, structured instructions.",
    }
  });

  return response.text?.trim() || prompt;
}

export async function refineUserPrompt(originalPrompt: string, rewrite: string, modelId: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `The user originally wrote: "${originalPrompt}"
    
A simulated ${modelId} rewrite of this was: "${rewrite}"
    
Your task is to create a NEW, highly optimized PROMPT that the user should use to get this level of quality or better from an AI. 
This "Refined Prompt" should include clear instructions, persona, context, and formatting rules that help an LLM understand exactly what to do.
    
Output ONLY the new prompt text. Do not include any preamble like "Here is your prompt:".`,
    config: {
      systemInstruction: "You are an expert Prompt Engineer. You transform simple ideas into structured, high-performance instructions for AI models.",
    }
  });

  return response.text?.trim() || originalPrompt;
}
