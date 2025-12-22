using SpendWiseApi.Models;

namespace SpendWiseApi.Repository.Interfaces;

public interface IExpenseRepository
{
    Task<IEnumerable<Expense>> GetExpensesByUserIdAsync(string userId);
    Task<Expense?> GetExpenseByIdAsync(int id);
    Task<Expense> CreateExpenseAsync(Expense expense);
    Task<Expense> UpdateExpenseAsync(Expense expense);
    Task<bool> DeleteExpenseAsync(int id);
    Task<IEnumerable<Expense>> GetExpensesByDateRangeAsync(string userId, DateTime startDate, DateTime endDate);
}

