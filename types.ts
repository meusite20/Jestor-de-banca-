export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum Category {
  HOUSING = 'Housing',
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  HEALTH = 'Health',
  WORK = 'Work-related',
  SUBSCRIPTIONS = 'Subscriptions',
  DEBTS = 'Debts',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  SAVINGS = 'Savings',
  OTHER = 'Other',
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  INVESTMENT = 'Investment',
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO date string
  category: Category;
  type: TransactionType;
  isRecurring: boolean;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number; // Annual percentage
  minimumPayment: number;
  dueDate: string; // Day of month usually
}

export interface EmergencyFund {
  goalAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface UserSettings {
  currency: string;
  darkMode: boolean;
  name: string;
}

export interface FinancialHealthReport {
  score: number;
  summary: string;
  recommendations: string[];
  debtStrategy: 'Snowball' | 'Avalanche' | 'Hybrid';
  debtStrategyReasoning: string;
}