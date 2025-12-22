using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;

namespace SpendWiseApi.Repository.Repositories;

public class SharedExpenseRepository : ISharedExpenseRepository
{
    private readonly SpendWiseDbContext _context;

    public SharedExpenseRepository(SpendWiseDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SharedExpense>> GetSharedExpensesByGroupIdAsync(int groupId)
    {
        return await _context.SharedExpenses
            .Include(e => e.PaidByUser)
            .Where(e => e.GroupId == groupId)
            .OrderByDescending(e => e.Date)
            .ToListAsync();
    }

    public async Task<SharedExpense?> GetSharedExpenseByIdAsync(int id)
    {
        return await _context.SharedExpenses
            .Include(e => e.PaidByUser)
            .Include(e => e.Group)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<SharedExpense> CreateSharedExpenseAsync(SharedExpense expense)
    {
        expense.CreatedAt = DateTime.UtcNow;
        _context.SharedExpenses.Add(expense);
        await _context.SaveChangesAsync();
        return expense;
    }

    public async Task<SharedExpense> UpdateSharedExpenseAsync(SharedExpense expense)
    {
        expense.UpdatedAt = DateTime.UtcNow;
        _context.SharedExpenses.Update(expense);
        await _context.SaveChangesAsync();
        return expense;
    }

    public async Task<bool> DeleteSharedExpenseAsync(int id)
    {
        var expense = await _context.SharedExpenses.FindAsync(id);
        if (expense == null) return false;

        _context.SharedExpenses.Remove(expense);
        await _context.SaveChangesAsync();
        return true;
    }
}

