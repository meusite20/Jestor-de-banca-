import React, { useState, useEffect } from 'react';
import { Transaction, Budget, Debt, FinancialHealthReport } from '../types';
import { GeminiService } from '../services/geminiService';
import { BrainCircuit, Loader2, Sparkles, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SmartAdvisorProps {
  transactions: Transaction[];
  budgets: Budget[];
  debts: Debt[];
}

const SmartAdvisor: React.FC<SmartAdvisorProps> = ({ transactions, budgets, debts }) => {
  const [report, setReport] = useState<FinancialHealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const generateReport = async () => {
    setIsLoading(true);
    const result = await GeminiService.analyzeFinances(transactions, debts, budgets);
    setReport(result);
    setIsLoading(false);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);

    const context = {
      totalDebt: debts.reduce((a, b) => a + b.remainingAmount, 0),
      recentTransactions: transactions.slice(-10),
      budgets: budgets
    };

    const aiResponse = await GeminiService.askAdvisor(userMessage, context);
    
    setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
    setIsChatLoading(false);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
      {/* Left Column: Report */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-yellow-500" />
              AI Analysis
            </h2>
            <p className="text-slate-500">Deep insights into your financial life</p>
          </div>
          <button 
            onClick={generateReport}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
            {report ? 'Update Analysis' : 'Analyze Finances'}
          </button>
        </div>

        {report && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Score Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="48" cy="48" r="40" 
                    stroke={report.score > 70 ? "#10b981" : report.score > 40 ? "#f59e0b" : "#ef4444"} 
                    strokeWidth="8" fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * report.score) / 100}
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-slate-800">{report.score}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Financial Health Score</h3>
                <p className="text-slate-600 mt-1">{report.summary}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-semibold text-lg mb-4">Recommendations</h3>
              <ul className="space-y-3">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg">
                    <div className="bg-blue-100 text-blue-600 w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 text-sm">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Debt Strategy */}
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">Debt Payoff Strategy</h3>
                <span className="bg-blue-500 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                  {report.debtStrategy}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-blue-500 pl-4">
                {report.debtStrategyReasoning}
              </p>
            </div>
          </div>
        )}

        {!report && !isLoading && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400">
            <BrainCircuit size={48} className="mx-auto mb-4 opacity-50" />
            <p>Click "Analyze Finances" to generate a comprehensive report using Gemini AI.</p>
          </div>
        )}
      </div>

      {/* Right Column: Chat */}
      <div className="w-full md:w-96 flex flex-col bg-white border-l border-slate-200 shadow-xl md:shadow-none h-full rounded-tl-2xl overflow-hidden mt-6 md:mt-0">
        <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Advisor Chat
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {chatHistory.length === 0 && (
             <div className="text-center text-slate-400 text-sm mt-10">
               Ask me anything about your budget, debts, or savings goals.
             </div>
           )}
           {chatHistory.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                 msg.role === 'user' 
                   ? 'bg-blue-600 text-white rounded-tr-none' 
                   : 'bg-slate-100 text-slate-800 rounded-tl-none'
               }`}>
                 <ReactMarkdown>{msg.content}</ReactMarkdown>
               </div>
             </div>
           ))}
           {isChatLoading && (
             <div className="flex justify-start">
               <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3">
                 <div className="flex gap-1">
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                 </div>
               </div>
             </div>
           )}
        </div>

        <div className="p-4 border-t border-slate-100">
          <form onSubmit={handleChatSubmit} className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask for advice..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SmartAdvisor;