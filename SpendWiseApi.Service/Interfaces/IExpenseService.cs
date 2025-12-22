using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface IExpenseService
{
    Task<IEnumerable<ExpenseDto>> GetExpensesByUserIdAsync(string userId);
    Task<ExpenseDto?> GetExpenseByIdAsync(int id, string userId);
    Task<ExpenseDto> CreateExpenseAsync(CreateExpenseDto createDto, string userId);
    Task<ExpenseDto> UpdateExpenseAsync(int id, CreateExpenseDto updateDto, string userId);
    Task<bool> DeleteExpenseAsync(int id, string userId);
    Task<IEnumerable<ExpenseDto>> GetExpensesByDateRangeAsync(string userId, DateTime startDate, DateTime endDate);
}

