namespace SpendWiseApi.Service.DTOs;

public class CategoryExpenseDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? CategoryEmoji { get; set; }
    public decimal TotalAmount { get; set; }
    public int ExpenseCount { get; set; }
    public decimal PercentageOfTotal { get; set; }
    public decimal AverageAmount { get; set; }
}

