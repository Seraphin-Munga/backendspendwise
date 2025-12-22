namespace SpendWiseApi.Models;

public enum GroupMemberRole
{
    Admin = 1,
    Member = 2,
    Child = 3
}

public class GroupMember
{
    public int Id { get; set; }
    public int GroupId { get; set; }
    public Group? Group { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }
    public GroupMemberRole Role { get; set; } = GroupMemberRole.Member;
    public DateTime JoinedAt { get; set; }
}

