import React, { useState } from 'react';
import { EmergencyFund as EmergencyFundType } from '../types';
import { ShieldCheck, Edit2 } from 'lucide-react';

interface EmergencyFundProps {
  fund: EmergencyFundType;
  onUpdate: (fund: EmergencyFundType) => void;
  currency: string;
}

const EmergencyFund: React.FC<EmergencyFundProps> = ({ fund, onUpdate, currency }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempFund, setTempFund] = useState(fund);

  const percentage = Math.min(100, (fund.currentAmount / fund.goalAmount) * 100);

  const handleSave = () => {
    onUpdate(tempFund);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
       <div>
           <h2 className="text-2xl font-bold text-slate-900">Emergency Fund</h2>
           <p className="text-slate-500">Build your safety net for unexpected events</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white relative">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-emerald-100 font-medium mb-1">Current Savings</h3>
                <h1 className="text-5xl font-bold tracking-tight">{currency} {fund.currentAmount.toLocaleString()}</h1>
                <p className="mt-2 text-emerald-100">Goal: {currency} {fund.goalAmount.toLocaleString()}</p>
              </div>
              <button onClick={() => setIsEditing(!isEditing)} className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                <Edit2 size={20} />
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
              <ShieldCheck size={250} />
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
              <span>Progress</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 ease-out" 
                style={{ width: `${percentage}%` }} 
              />
            </div>
            <p className="mt-6 text-slate-500 text-sm leading-relaxed">
              Experts recommend saving 3-6 months of essential expenses. 
              Based on your budget, you are {percentage >= 100 ? 'fully covered!' : 'on your way.'}
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-semibold mb-4">Update Fund</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Amount</label>
                <input 
                  type="number" 
                  value={tempFund.currentAmount}
                  onChange={e => setTempFund({...tempFund, currentAmount: Number(e.target.value)})}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Amount</label>
                <input 
                  type="number" 
                  value={tempFund.goalAmount}
                  onChange={e => setTempFund({...tempFund, goalAmount: Number(e.target.value)})}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Save Changes</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default EmergencyFund;