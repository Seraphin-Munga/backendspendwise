using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SpendWiseApi.Service.Interfaces;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using Twilio.Http;

namespace SpendWiseApi.Service.Services;

public class TwilioSmsService : ISmsService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<TwilioSmsService> _logger;
    private readonly string _accountSid;
    private readonly string _authToken;
    private readonly string _fromPhoneNumber;

    public TwilioSmsService(IConfiguration configuration, ILogger<TwilioSmsService> logger)
    {
        _configuration = configuration;
        _logger = logger;
        
        var twilioSettings = _configuration.GetSection("Twilio");
        _accountSid = twilioSettings["AccountSid"] ?? throw new InvalidOperationException("Twilio AccountSid is not configured");
        _authToken = twilioSettings["AuthToken"] ?? throw new InvalidOperationException("Twilio AuthToken is not configured");
        _fromPhoneNumber = twilioSettings["FromPhoneNumber"] ?? throw new InvalidOperationException("Twilio FromPhoneNumber is not configured");

        // Initialize Twilio client
        TwilioClient.Init(_accountSid, _authToken);
    }

    public async Task<bool> SendVerificationCodeAsync(string mobileNumber, string code)
    {
        try
        {
            // Format the message
            var messageBody = $"Your SpendWise verification code is: {code}. This code will expire in 10 minutes.";

            // Create message options using the format from Twilio example
            var messageOptions = new CreateMessageOptions(new PhoneNumber(mobileNumber))
            {
                From = new PhoneNumber(_fromPhoneNumber),
                Body = messageBody
            };

            // Send SMS via Twilio
            var messageResource = await MessageResource.CreateAsync(messageOptions);

            _logger.LogInformation(
                "SMS sent successfully. SID: {MessageSid}, To: {To}, Status: {Status}",
                messageResource.Sid,
                mobileNumber,
                messageResource.Status
            );

            // Check if message was successfully queued (status will be "queued", "sent", "delivered", etc.)
            // Failed messages will have status "failed"
            var status = messageResource.Status?.ToString() ?? string.Empty;
            return !string.IsNullOrEmpty(status) && 
                   !status.Equals("failed", StringComparison.OrdinalIgnoreCase);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SMS to {MobileNumber}", mobileNumber);
            return false;
        }
    }

    public async Task<bool> SendPasswordResetCodeAsync(string mobileNumber, string code)
    {
        try
        {
            // Format the message for password reset
            var messageBody = $"Your SpendWise password reset code is: {code}. This code will expire in 15 minutes. If you didn't request this, please ignore this message.";

            // Create message options using the format from Twilio example
            var messageOptions = new CreateMessageOptions(new PhoneNumber(mobileNumber))
            {
                From = new PhoneNumber(_fromPhoneNumber),
                Body = messageBody
            };

            // Send SMS via Twilio
            var messageResource = await MessageResource.CreateAsync(messageOptions);

            _logger.LogInformation(
                "Password reset SMS sent successfully. SID: {MessageSid}, To: {To}, Status: {Status}",
                messageResource.Sid,
                mobileNumber,
                messageResource.Status
            );

            // Check if message was successfully queued (status will be "queued", "sent", "delivered", etc.)
            // Failed messages will have status "failed"
            var status = messageResource.Status?.ToString() ?? string.Empty;
            return !string.IsNullOrEmpty(status) && 
                   !status.Equals("failed", StringComparison.OrdinalIgnoreCase);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password reset SMS to {MobileNumber}", mobileNumber);
            return false;
        }
    }
}

