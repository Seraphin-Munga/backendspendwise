using System.ComponentModel.DataAnnotations;

namespace SpendWiseApi.Service.DTOs;

public class CreateCategoryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(10)]
    public string? Emoji { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}

