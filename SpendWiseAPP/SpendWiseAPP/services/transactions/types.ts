export interface Transaction {
  id: number;
  type: 'Income' | 'Expense';
  description: string;
  amount: number; // Negative for expenses, positive for income
  date: string; // ISO date string
  categoryId?: number;
  categoryName?: string;
  categoryEmoji?: string;
  notes?: string;
  createdAt: string; // ISO date string
}

export interface TransactionFilter {
  type?: 'Income' | 'Expense' | 'all';
  categoryId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

export interface TransactionsResponse {
  success: boolean;
  message?: string;
  data?: Transaction[];
  total?: number;
}

export interface TransactionResponse {
  success: boolean;
  message?: string;
  data?: Transaction;
}

export interface APIError {
  message: string;
  errors?: { [key: string]: string[] };
  status?: number;
}

