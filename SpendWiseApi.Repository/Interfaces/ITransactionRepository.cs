using SpendWiseApi.Models;

namespace SpendWiseApi.Repository.Interfaces;

public interface ITransactionRepository
{
    Task<IEnumerable<Transaction>> GetTransactionsByUserIdAsync(string userId);
    Task<IEnumerable<Transaction>> GetTransactionsByDateRangeAsync(string userId, DateTime startDate, DateTime endDate);
    Task<Transaction?> GetTransactionByIdAsync(int id);
}

