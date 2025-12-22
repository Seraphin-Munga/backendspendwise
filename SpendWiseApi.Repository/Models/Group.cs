namespace SpendWiseApi.Models;

public class Group
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string CreatedByUserId { get; set; } = string.Empty;
    public ApplicationUser? CreatedByUser { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
    public ICollection<SharedExpense> SharedExpenses { get; set; } = new List<SharedExpense>();
}

