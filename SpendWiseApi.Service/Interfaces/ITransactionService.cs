using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface ITransactionService
{
    Task<IEnumerable<TransactionDto>> GetTransactionsByUserIdAsync(string userId);
    Task<IEnumerable<TransactionDto>> GetTransactionsByDateRangeAsync(string userId, DateTime startDate, DateTime endDate);
}

