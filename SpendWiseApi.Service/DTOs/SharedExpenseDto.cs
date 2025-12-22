namespace SpendWiseApi.Service.DTOs;

public class SharedExpenseDto
{
    public int Id { get; set; }
    public int GroupId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string PaidByUserId { get; set; } = string.Empty;
    public string? PaidByUserEmail { get; set; }
    public DateTime Date { get; set; }
    public DateTime CreatedAt { get; set; }
}

