namespace SpendWiseApi.Service.DTOs;

public class GroupDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string CreatedByUserId { get; set; } = string.Empty;
    public string? CreatedByUserName { get; set; }
    public string UserRole { get; set; } = string.Empty; // Admin, Member, or Child
    public int MemberCount { get; set; }
    public int TotalExpenses { get; set; } // Total expenses in the date range
    public decimal TotalExpenseAmount { get; set; } // Total amount of expenses in the date range
    public decimal UserTotalOwed { get; set; } // Total amount user owes/is owed in this group
    public DateTime CreatedAt { get; set; }
    public DateTime JoinedAt { get; set; } // When user joined the group
}
