using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface IReportService
{
    Task<ReportDto> GetFinancialReportAsync(string userId, DateTime startDate, DateTime endDate);
}

