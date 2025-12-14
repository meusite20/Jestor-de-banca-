import React, { useState } from 'react';
import { Budget, Transaction, TransactionType, Category } from '../types';
import { Plus, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface BudgetPlannerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onSaveBudgets: (budgets: Budget[]) => void;
  currency: string;
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ budgets, transactions, onSaveBudgets, currency }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState<{category: Category, limit: number} | null>(null);

  // Calculate current spending per category for the current month
  const currentSpending = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      const now = new Date();
      return t.type === TransactionType.EXPENSE && 
             tDate.getMonth() === now.getMonth() && 
             tDate.getFullYear() === now.getFullYear();
    })
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const handleUpdateLimit = (id: string, limit: number) => {
    const updated = budgets.map(b => b.id === id ? { ...b, limit } : b);
    onSaveBudgets(updated);
    setEditingId(null);
  };

  const handleAddBudget = () => {
    if (!newBudget) return;
    const exists = budgets.find(b => b.category === newBudget.category);
    if (exists) {
      alert("Budget for this category already exists.");
      return;
    }
    const b: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      limit: newBudget.limit
    };
    onSaveBudgets([...budgets, b]);
    setNewBudget(null);
  };

  const handleDeleteBudget = (id: string) => {
    onSaveBudgets(budgets.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Budget Planner</h2>
           <p className="text-slate-500">Set limits and track your monthly spending</p>
        </div>
        <button 
          onClick={() => setNewBudget({ category: Category.FOOD, limit: 500 })}
          disabled={!!newBudget}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus size={18} /> New Budget
        </button>
      </div>

      {newBudget && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex flex-col md:flex-row gap-4 items-end animate-in fade-in">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select 
                value={newBudget.category}
                onChange={e => setNewBudget({...newBudget, category: e.target.value as Category})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg"
              >
                {Object.values(Category).filter(c => !budgets.find(b => b.category === c)).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium text-slate-700">Monthly Limit</label>
              <input 
                type="number" 
                value={newBudget.limit}
                onChange={e => setNewBudget({...newBudget, limit: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddBudget} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Save</button>
              <button onClick={() => setNewBudget(null)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Cancel</button>
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(budget => {
          const spent = currentSpending[budget.category] || 0;
          const percentage = Math.min(100, (spent / budget.limit) * 100);
          const isOver = spent > budget.limit;
          
          return (
            <div key={budget.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative group">
              <button 
                onClick={() => handleDeleteBudget(budget.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={18} />
              </button>

              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-slate-800">{budget.category}</h3>
                {isOver ? (
                  <span className="text-red-500 text-xs font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full">
                    <AlertTriangle size={12} /> Over Budget
                  </span>
                ) : (
                  <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                    <CheckCircle2 size={12} /> On Track
                  </span>
                )}
              </div>

              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-500">Spent: <span className="text-slate-900 font-medium">{currency}{spent.toFixed(0)}</span></span>
                {editingId === budget.id ? (
                  <input 
                    type="number" 
                    defaultValue={budget.limit}
                    onBlur={(e) => handleUpdateLimit(budget.id, Number(e.target.value))}
                    autoFocus
                    className="w-20 text-right border border-blue-300 rounded px-1"
                  />
                ) : (
                  <span 
                    className="text-slate-500 cursor-pointer hover:text-blue-600 hover:underline decoration-dashed underline-offset-4"
                    onClick={() => setEditingId(budget.id)}
                  >
                    Limit: <span className="text-slate-900 font-medium">{currency}{budget.limit.toLocaleString()}</span>
                  </span>
                )}
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : percentage > 80 ? 'bg-amber-400' : 'bg-blue-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-right">{percentage.toFixed(1)}% used</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetPlanner;