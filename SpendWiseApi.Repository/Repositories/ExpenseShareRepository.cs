using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;

namespace SpendWiseApi.Repository.Repositories;

public class ExpenseShareRepository : IExpenseShareRepository
{
    private readonly SpendWiseDbContext _context;

    public ExpenseShareRepository(SpendWiseDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ExpenseShare>> GetExpenseSharesByExpenseIdAsync(int expenseId)
    {
        return await _context.ExpenseShares
            .Include(s => s.SharedWithUser)
            .Where(s => s.ExpenseId == expenseId)
            .ToListAsync();
    }

    public async Task<ExpenseShare?> GetExpenseShareByIdAsync(int id)
    {
        return await _context.ExpenseShares
            .Include(s => s.SharedWithUser)
            .Include(s => s.Expense)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<ExpenseShare> CreateExpenseShareAsync(ExpenseShare share)
    {
        share.CreatedAt = DateTime.UtcNow;
        _context.ExpenseShares.Add(share);
        await _context.SaveChangesAsync();
        return share;
    }

    public async Task<ExpenseShare> UpdateExpenseShareAsync(ExpenseShare share)
    {
        _context.ExpenseShares.Update(share);
        await _context.SaveChangesAsync();
        return share;
    }

    public async Task<bool> DeleteExpenseShareAsync(int id)
    {
        var share = await _context.ExpenseShares.FindAsync(id);
        if (share == null) return false;

        _context.ExpenseShares.Remove(share);
        await _context.SaveChangesAsync();
        return true;
    }
}

