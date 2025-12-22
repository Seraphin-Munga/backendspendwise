using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface IBudgetService
{
    Task<IEnumerable<BudgetDto>> GetBudgetsByUserIdAsync(string userId);
    Task<BudgetDto?> GetBudgetByIdAsync(int id, string userId);
    Task<BudgetDto> CreateBudgetAsync(CreateBudgetDto createDto, string userId);
    Task<BudgetDto> UpdateBudgetAsync(int id, CreateBudgetDto updateDto, string userId);
    Task<bool> DeleteBudgetAsync(int id, string userId);
}

