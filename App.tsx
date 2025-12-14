import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionManager from './components/TransactionManager';
import BudgetPlanner from './components/BudgetPlanner';
import DebtManager from './components/DebtManager';
import EmergencyFund from './components/EmergencyFund';
import SmartAdvisor from './components/SmartAdvisor';
import { StorageService } from './services/storageService';
import { Transaction, Budget, Debt, EmergencyFund as EmergencyFundType, UserSettings } from './types';

function App() {
  // State management (Simulating Global Context/Redux)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [emergencyFund, setEmergencyFund] = useState<EmergencyFundType>({ goalAmount: 0, currentAmount: 0 });
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Data
  useEffect(() => {
    StorageService.initialize();
    setTransactions(StorageService.getTransactions());
    setBudgets(StorageService.getBudgets());
    setDebts(StorageService.getDebts());
    setEmergencyFund(StorageService.getEmergencyFund());
    setSettings(StorageService.getSettings());
    setIsLoaded(true);
  }, []);

  // Persistence Wrappers
  const handleAddTransaction = (t: Transaction) => {
    const updated = [t, ...transactions];
    setTransactions(updated);
    StorageService.saveTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    StorageService.saveTransactions(updated);
  };

  const handleSaveBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    StorageService.saveBudgets(newBudgets);
  };

  const handleUpdateDebts = (newDebts: Debt[]) => {
    setDebts(newDebts);
    StorageService.saveDebts(newDebts);
  };

  const handleUpdateFund = (fund: EmergencyFundType) => {
    setEmergencyFund(fund);
    StorageService.saveEmergencyFund(fund);
  };

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-400">Loading FinSmart...</div>;
  }

  // Currency symbol helper
  const currencySymbol = settings.currency === 'USD' ? '$' : settings.currency === 'EUR' ? '€' : '$';

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard transactions={transactions} currency={currencySymbol} />} />
          <Route 
            path="/transactions" 
            element={
              <TransactionManager 
                transactions={transactions} 
                onAddTransaction={handleAddTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                currency={currencySymbol}
              />
            } 
          />
          <Route 
            path="/budgets" 
            element={
              <BudgetPlanner 
                budgets={budgets} 
                transactions={transactions} 
                onSaveBudgets={handleSaveBudgets}
                currency={currencySymbol}
              />
            } 
          />
          <Route 
            path="/debts" 
            element={
              <DebtManager 
                debts={debts} 
                onUpdateDebts={handleUpdateDebts}
                currency={currencySymbol}
              />
            } 
          />
          <Route 
            path="/emergency-fund" 
            element={
              <EmergencyFund 
                fund={emergencyFund} 
                onUpdate={handleUpdateFund}
                currency={currencySymbol}
              />
            } 
          />
          <Route 
            path="/advisor" 
            element={
              <SmartAdvisor 
                transactions={transactions}
                budgets={budgets}
                debts={debts}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;