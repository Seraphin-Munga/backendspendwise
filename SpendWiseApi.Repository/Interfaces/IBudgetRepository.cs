using SpendWiseApi.Models;

namespace SpendWiseApi.Repository.Interfaces;

public interface IBudgetRepository
{
    Task<IEnumerable<Budget>> GetBudgetsByUserIdAsync(string userId);
    Task<Budget?> GetBudgetByIdAsync(int id);
    Task<Budget> CreateBudgetAsync(Budget budget);
    Task<Budget> UpdateBudgetAsync(Budget budget);
    Task<bool> DeleteBudgetAsync(int id);
}

