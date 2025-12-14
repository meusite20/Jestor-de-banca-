import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  currency: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const Dashboard: React.FC<DashboardProps> = ({ transactions, currency }) => {
  const summary = useMemo(() => {
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) income += t.amount;
      else expenses += t.amount;
    });

    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  // Data for Expense by Category Pie Chart
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        data[t.category] = (data[t.category] || 0) + t.amount;
      });
    
    return Object.keys(data).map(key => ({ name: key, value: data[key] }));
  }, [transactions]);

  // Data for Income vs Expense Bar Chart (Monthly)
  const monthlyData = useMemo(() => {
    const data: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (!data[month]) data[month] = { income: 0, expense: 0 };
      
      if (t.type === TransactionType.INCOME) data[month].income += t.amount;
      else data[month].expense += t.amount;
    });

    return Object.keys(data).map(month => ({
      name: month,
      Income: data[month].income,
      Expense: data[month].expense
    }));
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <span className="text-sm text-slate-500">Overview of your financial health</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Balance</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {currency} {summary.balance.toLocaleString()}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${summary.balance >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Monthly Income</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-2">
                {currency} {summary.income.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Monthly Expenses</p>
              <h3 className="text-3xl font-bold text-red-500 mt-2">
                {currency} {summary.expenses.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-red-50 text-red-500">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Income vs Expenses</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Expenses by Category</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: number) => `${currency} ${value.toLocaleString()}`}
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {categoryData.slice(0, 5).map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;