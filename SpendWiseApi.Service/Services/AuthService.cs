using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly SpendWiseDbContext _context;
    private readonly ISmsService _smsService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration,
        SpendWiseDbContext context,
        ISmsService smsService,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _context = context;
        _smsService = smsService;
        _logger = logger;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        // Check if email already exists
        var existingUserByEmail = await _userManager.FindByEmailAsync(registerDto.Email);
        if (existingUserByEmail != null)
        {
            throw new InvalidOperationException("Email is already registered. Please use a different email address.");
        }

        // Check if mobile number already exists (if provided)
        if (!string.IsNullOrWhiteSpace(registerDto.MobileNumber))
        {
            var existingUserByMobile = await _context.Users
                .FirstOrDefaultAsync(u => u.MobileNumber == registerDto.MobileNumber);
            
            if (existingUserByMobile != null)
            {
                throw new InvalidOperationException("Mobile number is already registered. Please use a different mobile number.");
            }
        }

        var user = new ApplicationUser
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            MobileNumber = registerDto.MobileNumber,
            CreatedAt = DateTime.UtcNow,
            IsMobileNumberConfirmed = false
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            // Check for duplicate email error from Identity
            if (result.Errors.Any(e => e.Code == "DuplicateUserName" || e.Code == "DuplicateEmail"))
            {
                throw new InvalidOperationException("Email is already registered. Please use a different email address.");
            }
            
            throw new InvalidOperationException($"Registration failed: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        // Generate and send OTP if mobile number is provided
        string? otpCode = null;
        if (!string.IsNullOrWhiteSpace(registerDto.MobileNumber))
        {
            // Generate a 6-digit verification code
            var random = new Random();
            otpCode = random.Next(100000, 999999).ToString();

            // Store the code and expiry time (10 minutes)
            user.MobileVerificationCode = otpCode;
            user.MobileVerificationCodeExpiry = DateTime.UtcNow.AddMinutes(10);
            user.UpdatedAt = DateTime.UtcNow;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                throw new InvalidOperationException($"Failed to generate verification code: {string.Join(", ", updateResult.Errors.Select(e => e.Description))}");
            }

            // Send SMS via Twilio
            try
            {
                _logger.LogInformation("Sending OTP to mobile number: {MobileNumber}", user.MobileNumber);
                var smsSent = await _smsService.SendVerificationCodeAsync(user.MobileNumber, otpCode);
                if (smsSent)
                {
                    _logger.LogInformation("OTP SMS sent successfully to {MobileNumber}", user.MobileNumber);
                }
                else
                {
                    _logger.LogWarning("Failed to send OTP SMS to {MobileNumber}. OTP is still available in response.", user.MobileNumber);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred while sending OTP SMS to {MobileNumber}. OTP is still available in response.", user.MobileNumber);
                // Don't fail registration - OTP is still returned in response
                // User can verify using the OTP from the response if SMS fails
            }
        }

        var refreshToken = await StoreRefreshTokenAsync(user.Id);
        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken.Token,
            Expiration = DateTime.UtcNow.AddHours(24),
            RequiresMobileVerification = !string.IsNullOrEmpty(registerDto.MobileNumber) && !user.IsMobileNumberConfirmed,
            OtpCode = otpCode
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
        {
            throw new Exception("Invalid email or password");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (!result.Succeeded)
        {
            throw new Exception("Invalid email or password");
        }

        // Check if user has mobile number but it's not confirmed
        if (!string.IsNullOrWhiteSpace(user.MobileNumber) && !user.IsMobileNumberConfirmed)
        {
            throw new UnauthorizedAccessException("Mobile number verification required. Please verify your mobile number to login.");
        }

        var refreshToken = await StoreRefreshTokenAsync(user.Id);
        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken.Token,
            Expiration = DateTime.UtcNow.AddHours(24),
            RequiresMobileVerification = false
        };
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        var token = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (token == null || token.IsRevoked || token.IsUsed || token.ExpiresAt < DateTime.UtcNow)
        {
            throw new Exception("Invalid refresh token");
        }

        token.IsUsed = true;
        await _context.SaveChangesAsync();

        var newRefreshToken = await StoreRefreshTokenAsync(token.UserId);
        var jwtToken = GenerateJwtToken(token.User!);

        return new AuthResponseDto
        {
            Token = jwtToken,
            RefreshToken = newRefreshToken.Token,
            Expiration = DateTime.UtcNow.AddHours(24),
            RequiresMobileVerification = false
        };
    }

    public async Task<bool> LogoutAsync(string userId)
    {
        var tokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked && !rt.IsUsed && rt.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();

        foreach (var token in tokens)
        {
            token.IsRevoked = true;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(24),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private async Task<RefreshToken> StoreRefreshTokenAsync(string userId)
    {
        var existingTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked && !rt.IsUsed && rt.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();

        foreach (var token in existingTokens)
        {
            token.IsRevoked = true;
        }

        var refreshToken = new RefreshToken
        {
            Token = GenerateRefreshToken(),
            UserId = userId,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
            IsRevoked = false,
            IsUsed = false
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return refreshToken;
    }

    public async Task<bool> SendMobileVerificationCodeAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (string.IsNullOrWhiteSpace(user.MobileNumber))
        {
            throw new InvalidOperationException("User does not have a mobile number registered");
        }

        if (user.IsMobileNumberConfirmed)
        {
            throw new InvalidOperationException("Mobile number is already verified");
        }

        // Clear any existing expired OTP before generating a new one
        if (!string.IsNullOrWhiteSpace(user.MobileVerificationCode))
        {
            // Check if existing code is expired
            if (user.MobileVerificationCodeExpiry == null || user.MobileVerificationCodeExpiry < DateTime.UtcNow)
            {
                // Clear expired code
                user.MobileVerificationCode = null;
                user.MobileVerificationCodeExpiry = null;
            }
            else
            {
                // Code is still valid, check if we should allow resend (optional: add rate limiting here)
                // For now, we'll allow resending which will invalidate the previous code
                user.MobileVerificationCode = null;
                user.MobileVerificationCodeExpiry = null;
            }
        }

        // Generate a 6-digit verification code
        var random = new Random();
        var verificationCode = random.Next(100000, 999999).ToString();

        // Store the code and expiry time (10 minutes)
        user.MobileVerificationCode = verificationCode;
        user.MobileVerificationCodeExpiry = DateTime.UtcNow.AddMinutes(10);
        user.UpdatedAt = DateTime.UtcNow;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            throw new InvalidOperationException($"Failed to update user: {string.Join(", ", updateResult.Errors.Select(e => e.Description))}");
        }

        // Send SMS via Twilio
        var smsSent = await _smsService.SendVerificationCodeAsync(user.MobileNumber, verificationCode);
        if (!smsSent)
        {
            // If SMS sending fails, clear the code we just generated
            user.MobileVerificationCode = null;
            user.MobileVerificationCodeExpiry = null;
            await _userManager.UpdateAsync(user);
            throw new InvalidOperationException("Failed to send verification code. Please try again later.");
        }

        return true;
    }

    public async Task<bool> VerifyMobileCodeAsync(string userId, string code)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (string.IsNullOrWhiteSpace(user.MobileNumber))
        {
            throw new InvalidOperationException("User does not have a mobile number registered");
        }

        if (user.IsMobileNumberConfirmed)
        {
            return true; // Already verified
        }

        // Check if code exists
        if (string.IsNullOrWhiteSpace(user.MobileVerificationCode))
        {
            throw new UnauthorizedAccessException("No verification code found. Please request a new code.");
        }

        // Check expiration FIRST before validating code (security best practice)
        if (user.MobileVerificationCodeExpiry == null || user.MobileVerificationCodeExpiry < DateTime.UtcNow)
        {
            // Clear expired code
            user.MobileVerificationCode = null;
            user.MobileVerificationCodeExpiry = null;
            await _userManager.UpdateAsync(user);
            throw new UnauthorizedAccessException("Verification code has expired. Please request a new code.");
        }

        // Now check if code matches (only after expiration check)
        if (user.MobileVerificationCode != code)
        {
            throw new UnauthorizedAccessException("Invalid verification code");
        }

        // Code is valid and not expired - mark mobile number as confirmed and clear verification code
        user.IsMobileNumberConfirmed = true;
        user.MobileVerificationCode = null;
        user.MobileVerificationCodeExpiry = null;
        user.UpdatedAt = DateTime.UtcNow;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            throw new InvalidOperationException($"Failed to verify mobile number: {string.Join(", ", updateResult.Errors.Select(e => e.Description))}");
        }

        return true;
    }

    public async Task<OtpStatusDto> GetOtpStatusAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        var hasOtp = !string.IsNullOrWhiteSpace(user.MobileVerificationCode);
        var isExpired = false;
        int? secondsRemaining = null;

        if (hasOtp && user.MobileVerificationCodeExpiry.HasValue)
        {
            var now = DateTime.UtcNow;
            var expiry = user.MobileVerificationCodeExpiry.Value;
            isExpired = expiry < now;
            
            if (!isExpired)
            {
                var remaining = expiry - now;
                secondsRemaining = (int)remaining.TotalSeconds;
            }
        }

        return new OtpStatusDto
        {
            HasOtp = hasOtp,
            IsExpired = isExpired,
            ExpiresAt = user.MobileVerificationCodeExpiry,
            SecondsRemaining = secondsRemaining,
            IsMobileNumberConfirmed = user.IsMobileNumberConfirmed
        };
    }

    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        // Find user by mobile number
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.MobileNumber == forgotPasswordDto.MobileNumber);
        
        if (user == null)
        {
            // Don't reveal if user exists for security reasons
            // Return true even if user doesn't exist to prevent mobile number enumeration
            return true;
        }

        // Check if mobile number is confirmed
        if (!user.IsMobileNumberConfirmed)
        {
            throw new InvalidOperationException("Mobile number is not verified. Please verify your mobile number first.");
        }

        // Clear any existing expired password reset code
        if (!string.IsNullOrWhiteSpace(user.PasswordResetCode))
        {
            if (user.PasswordResetCodeExpiry == null || user.PasswordResetCodeExpiry < DateTime.UtcNow)
            {
                // Clear expired code
                user.PasswordResetCode = null;
                user.PasswordResetCodeExpiry = null;
            }
            else
            {
                // Clear existing code to generate new one
                user.PasswordResetCode = null;
                user.PasswordResetCodeExpiry = null;
            }
        }

        // Generate a 6-digit password reset code
        var random = new Random();
        var resetCode = random.Next(100000, 999999).ToString();

        // Store the code and expiry time (15 minutes for password reset)
        user.PasswordResetCode = resetCode;
        user.PasswordResetCodeExpiry = DateTime.UtcNow.AddMinutes(15);
        user.UpdatedAt = DateTime.UtcNow;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            throw new InvalidOperationException($"Failed to generate reset code: {string.Join(", ", updateResult.Errors.Select(e => e.Description))}");
        }

        // Send SMS via Twilio
        var smsSent = await _smsService.SendPasswordResetCodeAsync(user.MobileNumber, resetCode);
        if (!smsSent)
        {
            // If SMS sending fails, clear the code we just generated
            user.PasswordResetCode = null;
            user.PasswordResetCodeExpiry = null;
            await _userManager.UpdateAsync(user);
            throw new InvalidOperationException("Failed to send reset code. Please try again later.");
        }

        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        // Find user by mobile number
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.MobileNumber == resetPasswordDto.MobileNumber);
        
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        // Check if reset code exists
        if (string.IsNullOrWhiteSpace(user.PasswordResetCode))
        {
            throw new UnauthorizedAccessException("No password reset code found. Please request a new reset code.");
        }

        // Check expiration FIRST before validating code (security best practice)
        if (user.PasswordResetCodeExpiry == null || user.PasswordResetCodeExpiry < DateTime.UtcNow)
        {
            // Clear expired code
            user.PasswordResetCode = null;
            user.PasswordResetCodeExpiry = null;
            await _userManager.UpdateAsync(user);
            throw new UnauthorizedAccessException("Password reset code has expired. Please request a new code.");
        }

        // Now check if code matches (only after expiration check)
        if (user.PasswordResetCode != resetPasswordDto.OtpCode)
        {
            throw new UnauthorizedAccessException("Invalid reset code");
        }

        // Code is valid and not expired - reset password
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var resetResult = await _userManager.ResetPasswordAsync(user, token, resetPasswordDto.NewPassword);

        if (!resetResult.Succeeded)
        {
            throw new InvalidOperationException($"Failed to reset password: {string.Join(", ", resetResult.Errors.Select(e => e.Description))}");
        }

        // Clear the reset code after successful password reset
        user.PasswordResetCode = null;
        user.PasswordResetCodeExpiry = null;
        user.UpdatedAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        return true;
    }
}

