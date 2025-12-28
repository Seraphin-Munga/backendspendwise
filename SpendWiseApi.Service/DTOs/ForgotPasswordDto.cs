using System.ComponentModel.DataAnnotations;

namespace SpendWiseApi.Service.DTOs;

public class ForgotPasswordDto
{
    [Required]
    [Phone]
    public string MobileNumber { get; set; } = string.Empty;
}

