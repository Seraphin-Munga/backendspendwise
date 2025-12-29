export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}



