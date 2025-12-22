namespace SpendWiseApi.Service.DTOs;

public class TransactionDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty; // "Income" or "Expense"
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? CategoryName { get; set; }
}

