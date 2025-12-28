namespace SpendWiseApi.Service.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
    public bool RequiresMobileVerification { get; set; }
    public string? Message { get; set; }
    public string? OtpCode { get; set; }
}

