namespace SpendWiseApi.Service.DTOs;

public class SharedExpenseDto
{
    public int Id { get; set; }
    public int GroupId { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal UserShareAmount { get; set; } // User's portion of the shared expense
    public string PaidByUserId { get; set; } = string.Empty;
    public string? PaidByUserName { get; set; }
    public bool IsPaidByUser { get; set; } // Whether the current user paid for this expense
    public DateTime Date { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ShareType { get; set; } = string.Empty; // "Group" or "Individual"
}
