namespace SpendWiseApi.Service.DTOs;

public class ReportDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal NetAmount { get; set; }
    public decimal SavingsRate { get; set; }
    public int TotalIncomeTransactions { get; set; }
    public int TotalExpenseTransactions { get; set; }
    public decimal AverageDailyIncome { get; set; }
    public decimal AverageDailyExpense { get; set; }
    public decimal LargestExpense { get; set; }
    public decimal LargestIncome { get; set; }
    public List<CategoryExpenseDto> CategoryExpenses { get; set; } = new();
    public List<MonthlySummaryDto> MonthlySummaries { get; set; } = new();
    public BudgetComparisonDto? BudgetComparison { get; set; }
    public List<TransactionDto> Transactions { get; set; } = new();
    public List<SharedExpenseDto> SharedExpenses { get; set; } = new();
    public decimal TotalSharedExpenses { get; set; } // Total amount user owes/is owed from shared expenses
    public List<GroupDto> Groups { get; set; } = new();
    public DateTime GeneratedAt { get; set; }
}

public class MonthlySummaryDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal NetAmount { get; set; }
}

public class BudgetComparisonDto
{
    public decimal TotalBudgeted { get; set; }
    public decimal TotalSpent { get; set; }
    public decimal BudgetUtilization { get; set; }
    public decimal RemainingBudget { get; set; }
    public List<CategoryBudgetDto> CategoryBudgets { get; set; } = new();
}

public class CategoryBudgetDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? CategoryEmoji { get; set; }
    public decimal BudgetedAmount { get; set; }
    public decimal SpentAmount { get; set; }
    public decimal RemainingAmount { get; set; }
    public decimal UtilizationPercentage { get; set; }
    public bool IsOverBudget { get; set; }
}

