namespace SpendWiseApi.Service.DTOs;

public class TransactionDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty; // "Income" or "Expense"
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? CategoryEmoji { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

