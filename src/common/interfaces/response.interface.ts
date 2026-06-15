export interface ApiResponse<T> {
  data: T;
  meta?: ResponseMeta;
  error?: string;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ExpenseSummaryByCategory {
  category: string;
  label: string;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyBudgetSummary {
  dailyBudget: number;
  weeklyBudget: number;
  monthlyBudget: number;
  spentToday: number;
  spentThisWeek: number;
  spentThisMonth: number;
  remainingToday: number;
  remainingThisWeek: number;
  remainingThisMonth: number;
  savingsAmount: number;
  savingsTarget: number;
  savingsProgress: number;
}

export interface BudgetAllocation {
  category: string;
  label: string;
  amount: number;
  percentage: number;
  spent: number;
  remaining: number;
  color: string;
}

export interface TimeSeriesPoint {
  date: string;
  amount: number;
  budget: number;
}
