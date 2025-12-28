using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Middleware;

public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public GlobalExceptionHandlerMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionHandlerMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred. Path: {Path}", context.Request.Path);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        var response = context.Response;

        var errorResponse = new ErrorResponseDto
        {
            Path = context.Request.Path,
            Timestamp = DateTime.UtcNow
        };

        switch (exception)
        {
            case UnauthorizedAccessException:
                errorResponse.StatusCode = (int)HttpStatusCode.Unauthorized;
                errorResponse.Message = "Unauthorized access";
                errorResponse.Details = _environment.IsDevelopment() ? exception.Message : null;
                response.StatusCode = (int)HttpStatusCode.Unauthorized;
                break;

            case KeyNotFoundException:
            case FileNotFoundException:
                errorResponse.StatusCode = (int)HttpStatusCode.NotFound;
                errorResponse.Message = exception.Message;
                errorResponse.Details = _environment.IsDevelopment() ? exception.StackTrace : null;
                response.StatusCode = (int)HttpStatusCode.NotFound;
                break;

            case ArgumentNullException:
            case ArgumentException:
                errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse.Message = exception.Message;
                errorResponse.Details = _environment.IsDevelopment() ? exception.StackTrace : null;
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            case InvalidOperationException:
                errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse.Message = exception.Message;
                errorResponse.Details = _environment.IsDevelopment() ? exception.StackTrace : null;
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            case DbUpdateException:
                errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse.Message = "A database error occurred while processing your request.";
                errorResponse.Details = _environment.IsDevelopment() ? exception.Message : null;
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            default:
                errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse.Message = _environment.IsDevelopment() 
                    ? exception.Message 
                    : "An error occurred while processing your request.";
                errorResponse.Details = _environment.IsDevelopment() ? exception.StackTrace : null;
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;
        }

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        var jsonResponse = JsonSerializer.Serialize(errorResponse, options);
        await response.WriteAsync(jsonResponse);
    }
}

