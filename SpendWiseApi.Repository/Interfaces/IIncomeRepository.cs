using SpendWiseApi.Models;

namespace SpendWiseApi.Repository.Interfaces;

public interface IIncomeRepository
{
    Task<IEnumerable<Income>> GetIncomesByUserIdAsync(string userId);
    Task<Income?> GetIncomeByIdAsync(int id);
    Task<Income> CreateIncomeAsync(Income income);
    Task<Income> UpdateIncomeAsync(Income income);
    Task<bool> DeleteIncomeAsync(int id);
    Task<IEnumerable<Income>> GetIncomesByDateRangeAsync(string userId, DateTime startDate, DateTime endDate);
}

