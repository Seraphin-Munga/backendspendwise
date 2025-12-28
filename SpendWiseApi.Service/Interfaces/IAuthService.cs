using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
    Task<bool> LogoutAsync(string userId);
    Task<bool> SendMobileVerificationCodeAsync(string userId);
    Task<bool> VerifyMobileCodeAsync(string userId, string code);
    Task<OtpStatusDto> GetOtpStatusAsync(string userId);
    Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
    Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
}

