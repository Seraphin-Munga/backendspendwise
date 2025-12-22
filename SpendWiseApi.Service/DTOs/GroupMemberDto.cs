namespace SpendWiseApi.Service.DTOs;

public class GroupMemberDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string? UserEmail { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime JoinedAt { get; set; }
}

