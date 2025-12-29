using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;

namespace SpendWiseApi.Repository.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly SpendWiseDbContext _context;

    public TransactionRepository(SpendWiseDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Transaction>> GetTransactionsByUserIdAsync(string userId)
    {
        return await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>> GetTransactionsByDateRangeAsync(string userId, DateTime startDate, DateTime endDate)
    {
        return await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId && t.Date >= startDate && t.Date <= endDate)
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<Transaction?> GetTransactionByIdAsync(int id)
    {
        return await _context.Transactions
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id);
    }
}

