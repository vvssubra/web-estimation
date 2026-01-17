import { GoogleGenAI } from "@google/genai";
import { QUESTIONS } from '../constants';
import { CalculatorState } from '../types';

export const generateProposal = async (
  state: CalculatorState, 
  totalCost: number
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const selectionSummary = QUESTIONS.map(q => {
    const value = state[q.id];
    if (q.type === 'range') {
      return `- ${q.title}: ${value} pages`;
    }
    if (q.type === 'single') {
      const opt = q.options?.find(o => o.id === value);
      return `- ${q.title}: ${opt?.label || value}`;
    }
    if (q.type === 'multiple' && Array.isArray(value)) {
      const selectedOpts = q.options?.filter(o => value.includes(o.id)).map(o => o.label).join(', ');
      return `- ${q.title}: ${selectedOpts || 'None'}`;
    }
    return '';
  }).join('\n');

  const prompt = `
    You are a high-level Digital Strategist at VVS Digital Solutions. 
    Analyze the following website project configuration:

    ${selectionSummary}
    Current Budget Estimate: RM${totalCost.toLocaleString()}

    Provide a 2-part "Strategic Insight":
    1. **Strategic Analysis**: Evaluate how well their chosen features align with their goals. (e.g. if they want leads but didn't pick SEO, mention it).
    2. **Growth Suggestions**: Recommend 1-2 specific "Power Moves" they should consider to 10x their results, based on their goal.

    Tone: Professional, expert, and highly valuable. 
    Format: Use clean Markdown. Keep it concise (max 200 words).
    Do NOT include a greeting or sign-off. Just the analysis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Our AI is currently optimizing your strategy. Please proceed with submission.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Insight is temporarily unavailable, but your configuration is perfectly valid for a high-performance build.";
  }
};