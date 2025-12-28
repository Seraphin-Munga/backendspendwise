using SpendWiseApi.Models;
using SpendWiseApi.Repository.Interfaces;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class BudgetService : IBudgetService
{
    private readonly IBudgetRepository _repository;

    public BudgetService(IBudgetRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<BudgetDto>> GetBudgetsByUserIdAsync(string userId)
    {
        var budgets = await _repository.GetBudgetsByUserIdAsync(userId);
        return budgets.Select(b => new BudgetDto
        {
            Id = b.Id,
            Name = b.Name,
            Description = b.Description,
            Amount = b.Amount,
            StartDate = b.StartDate,
            EndDate = b.EndDate,
            CategoryId = b.CategoryId,
            CreatedAt = b.CreatedAt,
            UpdatedAt = b.UpdatedAt
        });
    }

    public async Task<BudgetDto?> GetBudgetByIdAsync(int id, string userId)
    {
        var budget = await _repository.GetBudgetByIdAsync(id);
        if (budget == null || budget.UserId != userId) return null;
        return new BudgetDto
        {
            Id = budget.Id,
            Name = budget.Name,
            Description = budget.Description,
            Amount = budget.Amount,
            StartDate = budget.StartDate,
            EndDate = budget.EndDate,
            CategoryId = budget.CategoryId,
            CreatedAt = budget.CreatedAt,
            UpdatedAt = budget.UpdatedAt
        };
    }

    public async Task<BudgetDto> CreateBudgetAsync(CreateBudgetDto createDto, string userId)
    {
        var budget = new Budget
        {
            Name = createDto.Name,
            Description = createDto.Description,
            Amount = createDto.Amount,
            StartDate = createDto.StartDate,
            EndDate = createDto.EndDate,
            CategoryId = createDto.CategoryId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repository.CreateBudgetAsync(budget);
        return new BudgetDto
        {
            Id = created.Id,
            Name = created.Name,
            Description = created.Description,
            Amount = created.Amount,
            StartDate = created.StartDate,
            EndDate = created.EndDate,
            CategoryId = created.CategoryId,
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt
        };
    }

    public async Task<BudgetDto> UpdateBudgetAsync(int id, CreateBudgetDto updateDto, string userId)
    {
        var budget = await _repository.GetBudgetByIdAsync(id);
        if (budget == null || budget.UserId != userId)
            throw new Exception("Budget not found");
        
        budget.Name = updateDto.Name;
        budget.Description = updateDto.Description;
        budget.Amount = updateDto.Amount;
        budget.StartDate = updateDto.StartDate;
        budget.EndDate = updateDto.EndDate;
        budget.CategoryId = updateDto.CategoryId;
        budget.UpdatedAt = DateTime.UtcNow;
        var updated = await _repository.UpdateBudgetAsync(budget);
        return new BudgetDto
        {
            Id = updated.Id,
            Name = updated.Name,
            Description = updated.Description,
            Amount = updated.Amount,
            StartDate = updated.StartDate,
            EndDate = updated.EndDate,
            CategoryId = updated.CategoryId,
            CreatedAt = updated.CreatedAt,
            UpdatedAt = updated.UpdatedAt
        };
    }

    public async Task<bool> DeleteBudgetAsync(int id, string userId)
    {
        var budget = await _repository.GetBudgetByIdAsync(id);
        if (budget == null || budget.UserId != userId) return false;
        return await _repository.DeleteBudgetAsync(id);
    }
}

