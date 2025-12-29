export interface Budget {
  id: string;
  category: string;
  categoryIcon?: string;
  categoryColor?: string;
  amount: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  description?: string;
}

export interface BudgetProgress {
  percentage: number;
  remaining: number;
  isOverBudget: boolean;
}



