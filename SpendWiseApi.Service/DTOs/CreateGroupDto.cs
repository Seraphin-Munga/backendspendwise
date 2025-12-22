using System.ComponentModel.DataAnnotations;

namespace SpendWiseApi.Service.DTOs;

public class CreateGroupDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
}

