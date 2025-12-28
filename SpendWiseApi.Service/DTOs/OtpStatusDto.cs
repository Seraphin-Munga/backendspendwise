namespace SpendWiseApi.Service.DTOs;

public class OtpStatusDto
{
    public bool HasOtp { get; set; }
    public bool IsExpired { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public int? SecondsRemaining { get; set; }
    public bool IsMobileNumberConfirmed { get; set; }
}

