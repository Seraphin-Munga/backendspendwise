using Microsoft.AspNetCore.Identity;

namespace SpendWiseApi.Models;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? MobileNumber { get; set; }
    public bool IsMobileNumberConfirmed { get; set; }
    public string? MobileVerificationCode { get; set; }
    public DateTime? MobileVerificationCodeExpiry { get; set; }
    public string? PasswordResetCode { get; set; }
    public DateTime? PasswordResetCodeExpiry { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

