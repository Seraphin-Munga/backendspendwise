using SpendWiseApi.Repository.Interfaces;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _repository;

    public TransactionService(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TransactionDto>> GetTransactionsByUserIdAsync(string userId)
    {
        var transactions = await _repository.GetTransactionsByUserIdAsync(userId);
        return transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Type = t.Type == Models.TransactionType.Income ? "Income" : "Expense",
            Description = t.Description,
            Amount = t.Type == Models.TransactionType.Income ? t.Amount : -t.Amount, // Expenses are negative
            Date = t.Date,
            CategoryId = t.CategoryId,
            CategoryName = t.Category?.Name,
            CategoryEmoji = t.Category?.Emoji,
            Notes = t.Notes,
            CreatedAt = t.CreatedAt
        });
    }

    public async Task<IEnumerable<TransactionDto>> GetTransactionsByDateRangeAsync(string userId, DateTime startDate, DateTime endDate)
    {
        var transactions = await _repository.GetTransactionsByDateRangeAsync(userId, startDate, endDate);
        return transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Type = t.Type == Models.TransactionType.Income ? "Income" : "Expense",
            Description = t.Description,
            Amount = t.Type == Models.TransactionType.Income ? t.Amount : -t.Amount, // Expenses are negative
            Date = t.Date,
            CategoryId = t.CategoryId,
            CategoryName = t.Category?.Name,
            CategoryEmoji = t.Category?.Emoji,
            Notes = t.Notes,
            CreatedAt = t.CreatedAt
        });
    }
}

