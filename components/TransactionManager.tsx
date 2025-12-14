import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { GeminiService } from '../services/geminiService';
import { Plus, Trash2, Search, Wand2 } from 'lucide-react';

interface TransactionManagerProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  currency: string;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({ 
  transactions, 
  onAddTransaction, 
  onDeleteTransaction,
  currency
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [filter, setFilter] = useState('');

  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: TransactionType.EXPENSE,
    category: Category.OTHER,
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    description: '',
    amount: 0
  });

  const handleDescriptionBlur = async () => {
    if (newTransaction.description && newTransaction.amount && !isLoadingCategory) {
      setIsLoadingCategory(true);
      const suggestedCategory = await GeminiService.categorizeTransaction(
        newTransaction.description, 
        newTransaction.amount
      );
      if (suggestedCategory) {
        setNewTransaction(prev => ({ ...prev, category: suggestedCategory }));
      }
      setIsLoadingCategory(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.description) return;

    const t: Transaction = {
      id: Date.now().toString(),
      amount: Number(newTransaction.amount),
      description: newTransaction.description,
      date: newTransaction.date || new Date().toISOString(),
      category: newTransaction.category as Category,
      type: newTransaction.type as TransactionType,
      isRecurring: newTransaction.isRecurring || false,
    };

    onAddTransaction(t);
    setIsAdding(false);
    setNewTransaction({
      type: TransactionType.EXPENSE,
      category: Category.OTHER,
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      description: '',
      amount: 0
    });
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(filter.toLowerCase()) ||
    t.category.toLowerCase().includes(filter.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Transactions</h2>
          <p className="text-slate-500">Track your income and expenses</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4">New Transaction</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={newTransaction.description}
                  onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  onBlur={handleDescriptionBlur}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., Grocery Store, Monthly Rent"
                />
                {isLoadingCategory && (
                  <div className="absolute right-3 top-2.5 text-blue-500 animate-pulse">
                    <Wand2 size={16} />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Wand2 size={12} />
                Gemini will auto-categorize this for you upon typing.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Amount</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={newTransaction.amount || ''}
                onChange={e => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select
                value={newTransaction.type}
                onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value as TransactionType })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value={TransactionType.EXPENSE}>Expense</option>
                <option value={TransactionType.INCOME}>Income</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                value={newTransaction.category}
                onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value as Category })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                {Object.values(Category).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                required
                value={newTransaction.date}
                onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex items-center gap-2 pt-2">
               <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium text-sm select-none">
                 <input 
                   type="checkbox"
                   checked={!!newTransaction.isRecurring}
                   onChange={(e) => setNewTransaction({...newTransaction, isRecurring: e.target.checked})}
                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                 />
                 <span>Mark as Recurring {newTransaction.type === TransactionType.INCOME ? 'Income' : 'Expense'}</span>
               </label>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
              >
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {t.description}
                    {t.isRecurring && <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Recurring</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}{currency} {t.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDeleteTransaction(t.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionManager;