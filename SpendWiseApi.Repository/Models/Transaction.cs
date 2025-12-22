namespace SpendWiseApi.Models;

public enum TransactionType
{
    Income = 1,
    Expense = 2
}

public class Transaction
{
    public int Id { get; set; }
    public TransactionType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public int? CategoryId { get; set; }
    public Category? Category { get; set; }
    public string? Notes { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Reference to original income/expense
    public int? IncomeId { get; set; }
    public int? ExpenseId { get; set; }
}

