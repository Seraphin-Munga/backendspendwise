using System.ComponentModel.DataAnnotations;

namespace SpendWiseApi.Service.DTOs;

public class VerifyMobileCodeDto
{
    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string Code { get; set; } = string.Empty;
}

