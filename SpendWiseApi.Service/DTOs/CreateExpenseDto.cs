using System.ComponentModel.DataAnnotations;

namespace SpendWiseApi.Service.DTOs;

public class CreateExpenseDto
{
    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    [Required]
    public int CategoryId { get; set; }
}

