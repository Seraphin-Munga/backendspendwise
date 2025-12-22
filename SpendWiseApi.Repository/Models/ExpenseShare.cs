namespace SpendWiseApi.Models;

public class ExpenseShare
{
    public int Id { get; set; }
    public int ExpenseId { get; set; }
    public Expense? Expense { get; set; }
    public string SharedWithUserId { get; set; } = string.Empty;
    public ApplicationUser? SharedWithUser { get; set; }
    public decimal Amount { get; set; }
    public bool IsPaid { get; set; }
    public DateTime CreatedAt { get; set; }
}

