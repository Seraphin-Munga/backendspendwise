using System.ComponentModel.DataAnnotations;

namespace SpendWiseApi.Service.DTOs;

public class ResetPasswordDto
{
    [Required]
    [Phone]
    public string MobileNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string OtpCode { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}

