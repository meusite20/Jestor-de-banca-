import { Transaction, Budget, Debt, EmergencyFund, UserSettings, Category } from '../types';
import { MOCK_TRANSACTIONS, INITIAL_SETTINGS } from '../constants';

const KEYS = {
  TRANSACTIONS: 'finsmart_transactions',
  BUDGETS: 'finsmart_budgets',
  DEBTS: 'finsmart_debts',
  EMERGENCY: 'finsmart_emergency',
  SETTINGS: 'finsmart_settings',
};

// Helper to simulate delay for "async" feel if needed, but synchronous for local storage is fine for this demo.

export const StorageService = {
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : MOCK_TRANSACTIONS;
  },

  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getBudgets: (): Budget[] => {
    const data = localStorage.getItem(KEYS.BUDGETS);
    return data ? JSON.parse(data) : [];
  },

  saveBudgets: (budgets: Budget[]) => {
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
  },

  getDebts: (): Debt[] => {
    const data = localStorage.getItem(KEYS.DEBTS);
    return data ? JSON.parse(data) : [];
  },

  saveDebts: (debts: Debt[]) => {
    localStorage.setItem(KEYS.DEBTS, JSON.stringify(debts));
  },

  getEmergencyFund: (): EmergencyFund => {
    const data = localStorage.getItem(KEYS.EMERGENCY);
    return data ? JSON.parse(data) : { goalAmount: 10000, currentAmount: 2000 };
  },

  saveEmergencyFund: (fund: EmergencyFund) => {
    localStorage.setItem(KEYS.EMERGENCY, JSON.stringify(fund));
  },

  getSettings: (): UserSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  },

  saveSettings: (settings: UserSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Initialize with some defaults if empty
  initialize: () => {
    if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(MOCK_TRANSACTIONS));
    }
    if (!localStorage.getItem(KEYS.BUDGETS)) {
      // Default budgets
      const defaultBudgets: Budget[] = [
        { id: 'b1', category: Category.FOOD, limit: 500 },
        { id: 'b2', category: Category.HOUSING, limit: 1500 },
        { id: 'b3', category: Category.ENTERTAINMENT, limit: 200 },
      ];
      localStorage.setItem(KEYS.BUDGETS, JSON.stringify(defaultBudgets));
    }
  }
};