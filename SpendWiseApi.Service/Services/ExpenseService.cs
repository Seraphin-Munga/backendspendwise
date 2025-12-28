using SpendWiseApi.Models;
using SpendWiseApi.Repository.Interfaces;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class ExpenseService : IExpenseService
{
    private readonly IExpenseRepository _repository;

    public ExpenseService(IExpenseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ExpenseDto>> GetExpensesByUserIdAsync(string userId)
    {
        var expenses = await _repository.GetExpensesByUserIdAsync(userId);
        return expenses.Select(e => new ExpenseDto
        {
            Id = e.Id,
            Description = e.Description,
            Amount = e.Amount,
            Date = e.Date,
            Notes = e.Notes,
            CategoryId = e.CategoryId,
            CategoryName = e.Category?.Name,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        });
    }

    public async Task<ExpenseDto?> GetExpenseByIdAsync(int id, string userId)
    {
        var expense = await _repository.GetExpenseByIdAsync(id);
        if (expense == null || expense.UserId != userId) return null;
        return new ExpenseDto
        {
            Id = expense.Id,
            Description = expense.Description,
            Amount = expense.Amount,
            Date = expense.Date,
            Notes = expense.Notes,
            CategoryId = expense.CategoryId,
            CategoryName = expense.Category?.Name,
            CreatedAt = expense.CreatedAt,
            UpdatedAt = expense.UpdatedAt
        };
    }

    public async Task<ExpenseDto> CreateExpenseAsync(CreateExpenseDto createDto, string userId)
    {
        var expense = new Expense
        {
            Description = createDto.Description,
            Amount = createDto.Amount,
            Date = createDto.Date,
            Notes = createDto.Notes,
            CategoryId = createDto.CategoryId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repository.CreateExpenseAsync(expense);
        return new ExpenseDto
        {
            Id = created.Id,
            Description = created.Description,
            Amount = created.Amount,
            Date = created.Date,
            Notes = created.Notes,
            CategoryId = created.CategoryId,
            CategoryName = created.Category?.Name,
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt
        };
    }

    public async Task<ExpenseDto> UpdateExpenseAsync(int id, CreateExpenseDto updateDto, string userId)
    {
        var expense = await _repository.GetExpenseByIdAsync(id);
        if (expense == null || expense.UserId != userId)
            throw new Exception("Expense not found");
        
        expense.Description = updateDto.Description;
        expense.Amount = updateDto.Amount;
        expense.Date = updateDto.Date;
        expense.Notes = updateDto.Notes;
        expense.CategoryId = updateDto.CategoryId;
        expense.UpdatedAt = DateTime.UtcNow;
        var updated = await _repository.UpdateExpenseAsync(expense);
        return new ExpenseDto
        {
            Id = updated.Id,
            Description = updated.Description,
            Amount = updated.Amount,
            Date = updated.Date,
            Notes = updated.Notes,
            CategoryId = updated.CategoryId,
            CategoryName = updated.Category?.Name,
            CreatedAt = updated.CreatedAt,
            UpdatedAt = updated.UpdatedAt
        };
    }

    public async Task<bool> DeleteExpenseAsync(int id, string userId)
    {
        var expense = await _repository.GetExpenseByIdAsync(id);
        if (expense == null || expense.UserId != userId) return false;
        return await _repository.DeleteExpenseAsync(id);
    }

    public async Task<IEnumerable<ExpenseDto>> GetExpensesByDateRangeAsync(string userId, DateTime startDate, DateTime endDate)
    {
        var expenses = await _repository.GetExpensesByDateRangeAsync(userId, startDate, endDate);
        return expenses.Select(e => new ExpenseDto
        {
            Id = e.Id,
            Description = e.Description,
            Amount = e.Amount,
            Date = e.Date,
            Notes = e.Notes,
            CategoryId = e.CategoryId,
            CategoryName = e.Category?.Name,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        });
    }
}

