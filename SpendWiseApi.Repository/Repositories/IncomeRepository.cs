using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;

namespace SpendWiseApi.Repository.Repositories;

public class IncomeRepository : IIncomeRepository
{
    private readonly SpendWiseDbContext _context;

    public IncomeRepository(SpendWiseDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Income>> GetIncomesByUserIdAsync(string userId)
    {
        return await _context.Incomes
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.Date)
            .ToListAsync();
    }

    public async Task<Income?> GetIncomeByIdAsync(int id)
    {
        return await _context.Incomes.FindAsync(id);
    }

    public async Task<Income> CreateIncomeAsync(Income income)
    {
        income.CreatedAt = DateTime.UtcNow;
        _context.Incomes.Add(income);
        await _context.SaveChangesAsync();
        return income;
    }

    public async Task<Income> UpdateIncomeAsync(Income income)
    {
        income.UpdatedAt = DateTime.UtcNow;
        _context.Incomes.Update(income);
        await _context.SaveChangesAsync();
        return income;
    }

    public async Task<bool> DeleteIncomeAsync(int id)
    {
        var income = await _context.Incomes.FindAsync(id);
        if (income == null) return false;

        _context.Incomes.Remove(income);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Income>> GetIncomesByDateRangeAsync(string userId, DateTime startDate, DateTime endDate)
    {
        return await _context.Incomes
            .Where(i => i.UserId == userId && i.Date >= startDate && i.Date <= endDate)
            .OrderByDescending(i => i.Date)
            .ToListAsync();
    }
}

