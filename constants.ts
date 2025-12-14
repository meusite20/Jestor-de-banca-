import { Category, TransactionType, UserSettings } from './types';

export const DEFAULT_CURRENCY = 'USD';

export const INITIAL_SETTINGS: UserSettings = {
  currency: 'USD',
  darkMode: false,
  name: 'User',
};

export const EXPENSE_CATEGORIES = [
  Category.HOUSING,
  Category.FOOD,
  Category.TRANSPORT,
  Category.HEALTH,
  Category.WORK,
  Category.SUBSCRIPTIONS,
  Category.DEBTS,
  Category.ENTERTAINMENT,
  Category.SHOPPING,
  Category.OTHER,
];

export const INCOME_CATEGORIES = [
  Category.SALARY,
  Category.FREELANCE,
  Category.INVESTMENT,
  Category.OTHER,
];

export const MOCK_TRANSACTIONS = [
  {
    id: '1',
    amount: 3500,
    description: 'Monthly Salary',
    date: new Date(new Date().setDate(1)).toISOString(),
    category: Category.SALARY,
    type: TransactionType.INCOME,
    isRecurring: true,
  },
  {
    id: '2',
    amount: 1200,
    description: 'Rent Payment',
    date: new Date(new Date().setDate(3)).toISOString(),
    category: Category.HOUSING,
    type: TransactionType.EXPENSE,
    isRecurring: true,
  },
  {
    id: '3',
    amount: 150,
    description: 'Grocery Run',
    date: new Date(new Date().setDate(5)).toISOString(),
    category: Category.FOOD,
    type: TransactionType.EXPENSE,
    isRecurring: false,
  },
  {
    id: '4',
    amount: 60,
    description: 'Gas Station',
    date: new Date(new Date().setDate(7)).toISOString(),
    category: Category.TRANSPORT,
    type: TransactionType.EXPENSE,
    isRecurring: false,
  },
];
