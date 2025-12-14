import React, { useState } from 'react';
import { Debt } from '../types';
import { Plus, TrendingDown, Target } from 'lucide-react';

interface DebtManagerProps {
  debts: Debt[];
  onUpdateDebts: (debts: Debt[]) => void;
  currency: string;
}

const DebtManager: React.FC<DebtManagerProps> = ({ debts, onUpdateDebts, currency }) => {
  const [showForm, setShowForm] = useState(false);
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    name: '', totalAmount: 0, remainingAmount: 0, interestRate: 0, minimumPayment: 0
  });

  const handleAddDebt = () => {
    if (!newDebt.name || !newDebt.remainingAmount) return;
    const debt: Debt = {
      id: Date.now().toString(),
      name: newDebt.name,
      totalAmount: Number(newDebt.totalAmount),
      remainingAmount: Number(newDebt.remainingAmount),
      interestRate: Number(newDebt.interestRate),
      minimumPayment: Number(newDebt.minimumPayment),
      dueDate: new Date().toISOString()
    };
    onUpdateDebts([...debts, debt]);
    setShowForm(false);
    setNewDebt({ name: '', totalAmount: 0, remainingAmount: 0, interestRate: 0, minimumPayment: 0 });
  };

  const totalDebt = debts.reduce((acc, d) => acc + d.remainingAmount, 0);

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Debt Manager</h2>
           <p className="text-slate-500">Track liabilities and plan your payoff</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 shadow-sm"
        >
          <Plus size={18} /> Add Debt
        </button>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-400 font-medium mb-1">Total Outstanding Debt</p>
          <h1 className="text-4xl font-bold tracking-tight">{currency} {totalDebt.toLocaleString()}</h1>
          <p className="text-sm text-slate-400 mt-4 max-w-lg">
            Focus on paying off high-interest debts first (Avalanche Method) to save money in the long run, or smallest debts first (Snowball Method) for psychological wins. Check the Smart Advisor for a tailored strategy.
          </p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
           <Target size={300} />
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-lg mb-4">Add New Liability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Debt Name</label>
              <input 
                className="w-full border p-2 rounded" 
                placeholder="e.g. Credit Card"
                value={newDebt.name}
                onChange={e => setNewDebt({...newDebt, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Remaining Amount</label>
              <input 
                type="number"
                className="w-full border p-2 rounded" 
                placeholder="0.00"
                value={newDebt.remainingAmount || ''}
                onChange={e => setNewDebt({...newDebt, remainingAmount: Number(e.target.value), totalAmount: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Interest Rate (%)</label>
              <input 
                type="number"
                step="0.1"
                className="w-full border p-2 rounded" 
                placeholder="0.0"
                value={newDebt.interestRate || ''}
                onChange={e => setNewDebt({...newDebt, interestRate: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Min Payment</label>
              <input 
                type="number"
                className="w-full border p-2 rounded" 
                placeholder="0.00"
                value={newDebt.minimumPayment || ''}
                onChange={e => setNewDebt({...newDebt, minimumPayment: Number(e.target.value)})}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500">Cancel</button>
            <button onClick={handleAddDebt} className="px-4 py-2 bg-slate-900 text-white rounded">Save Debt</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {debts.map(debt => (
          <div key={debt.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-500 rounded-full">
                <TrendingDown size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{debt.name}</h3>
                <p className="text-sm text-slate-500">{debt.interestRate}% APR &bull; Min Pay: {currency}{debt.minimumPayment}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Remaining Balance</p>
              <p className="text-xl font-bold text-slate-900">{currency} {debt.remainingAmount.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebtManager;