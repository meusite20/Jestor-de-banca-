import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Debt, Budget, FinancialHealthReport, Category } from '../types';

// In a real app, this should be an env var. 
// For this demo, we assume process.env.API_KEY is available as per instructions.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  /**
   * Auto-categorize a transaction based on description
   */
  categorizeTransaction: async (description: string, amount: number): Promise<Category | null> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Categorize this financial transaction: "${description}" with amount ${amount}.
        Return ONLY one of the following exact strings: Housing, Food, Transport, Health, Work-related, Subscriptions, Debts, Entertainment, Shopping, Savings, Salary, Freelance, Investment, Other.
        If uncertain, choose Other.`,
      });
      
      const text = response.text?.trim();
      if (text && Object.values(Category).includes(text as Category)) {
        return text as Category;
      }
      return Category.OTHER;
    } catch (error) {
      console.error("Gemini Categorization Error:", error);
      return null;
    }
  },

  /**
   * Analyze financial health and provide actionable advice
   */
  analyzeFinances: async (
    transactions: Transaction[],
    debts: Debt[],
    budgets: Budget[]
  ): Promise<FinancialHealthReport> => {
    const financialSummary = {
      transactions: transactions.slice(-50), // Send last 50 for context
      totalDebt: debts.reduce((acc, d) => acc + d.remainingAmount, 0),
      budgets: budgets,
    };

    const schema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Financial health score from 0 to 100" },
        summary: { type: Type.STRING, description: "Brief executive summary of financial status" },
        recommendations: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of 3 specific actionable recommendations"
        },
        debtStrategy: { 
          type: Type.STRING, 
          enum: ["Snowball", "Avalanche", "Hybrid"],
          description: "Recommended debt payoff strategy"
        },
        debtStrategyReasoning: { type: Type.STRING, description: "Why this strategy was chosen" }
      },
      required: ["score", "summary", "recommendations", "debtStrategy", "debtStrategyReasoning"]
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Act as a senior financial advisor. Analyze this user's financial data JSON. 
        Provide a health score, summary, recommendations, and a debt strategy.
        Data: ${JSON.stringify(financialSummary)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");
      
      return JSON.parse(text) as FinancialHealthReport;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      // Fallback if AI fails
      return {
        score: 50,
        summary: "Unable to generate AI report at this time. Please check your connection or API key.",
        recommendations: ["Track your expenses daily.", "Review your debts.", "Build an emergency fund."],
        debtStrategy: "Avalanche",
        debtStrategyReasoning: "Mathematically optimal for reducing interest payments."
      };
    }
  },

  /**
   * Chat with financial advisor
   */
  askAdvisor: async (question: string, contextData: any): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Fast for chat
        contents: `You are FinSmart, a helpful, empathetic, and strict financial advisor.
        User Context: ${JSON.stringify(contextData)}
        User Question: "${question}"
        Answer concisely in markdown format.`,
      });
      return response.text || "I'm having trouble thinking right now. Try again later.";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "Sorry, I couldn't process your request.";
    }
  }
};