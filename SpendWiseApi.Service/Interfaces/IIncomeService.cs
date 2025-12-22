using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface IIncomeService
{
    Task<IEnumerable<IncomeDto>> GetIncomesByUserIdAsync(string userId);
    Task<IncomeDto?> GetIncomeByIdAsync(int id, string userId);
    Task<IncomeDto> CreateIncomeAsync(CreateIncomeDto createDto, string userId);
    Task<IncomeDto> UpdateIncomeAsync(int id, CreateIncomeDto updateDto, string userId);
    Task<bool> DeleteIncomeAsync(int id, string userId);
}

