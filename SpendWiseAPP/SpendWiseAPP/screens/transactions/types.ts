export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  categoryIcon?: string;
  categoryColor?: string;
  date: Date;
  description?: string;
}

export interface TransactionFilter {
  type?: 'income' | 'expense' | 'all';
  category?: string;
  startDate?: Date;
  endDate?: Date;
}



