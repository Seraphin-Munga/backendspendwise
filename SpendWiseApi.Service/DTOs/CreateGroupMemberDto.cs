using System.ComponentModel.DataAnnotations;

namespace SpendWiseApi.Service.DTOs;

public class CreateGroupMemberDto
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    public string Role { get; set; } = "Member"; // Admin, Member, or Child
}

