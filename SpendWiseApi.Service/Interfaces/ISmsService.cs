namespace SpendWiseApi.Service.Interfaces;

public interface ISmsService
{
    Task<bool> SendVerificationCodeAsync(string mobileNumber, string code);
    Task<bool> SendPasswordResetCodeAsync(string mobileNumber, string code);
}

