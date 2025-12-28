using SpendWiseApi.Models;
using SpendWiseApi.Repository.Interfaces;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class IncomeService : IIncomeService
{
    private readonly IIncomeRepository _repository;

    public IncomeService(IIncomeRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<IncomeDto>> GetIncomesByUserIdAsync(string userId)
    {
        var incomes = await _repository.GetIncomesByUserIdAsync(userId);
        return incomes.Select(i => new IncomeDto
        {
            Id = i.Id,
            Source = i.Source,
            Amount = i.Amount,
            Date = i.Date,
            Description = i.Description,
            CreatedAt = i.CreatedAt,
            UpdatedAt = i.UpdatedAt
        });
    }

    public async Task<IncomeDto?> GetIncomeByIdAsync(int id, string userId)
    {
        var income = await _repository.GetIncomeByIdAsync(id);
        if (income == null || income.UserId != userId) return null;
        return new IncomeDto
        {
            Id = income.Id,
            Source = income.Source,
            Amount = income.Amount,
            Date = income.Date,
            Description = income.Description,
            CreatedAt = income.CreatedAt,
            UpdatedAt = income.UpdatedAt
        };
    }

    public async Task<IncomeDto> CreateIncomeAsync(CreateIncomeDto createDto, string userId)
    {
        var income = new Income
        {
            Source = createDto.Source,
            Amount = createDto.Amount,
            Date = createDto.Date,
            Description = createDto.Description,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repository.CreateIncomeAsync(income);
        return new IncomeDto
        {
            Id = created.Id,
            Source = created.Source,
            Amount = created.Amount,
            Date = created.Date,
            Description = created.Description,
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt
        };
    }

    public async Task<IncomeDto> UpdateIncomeAsync(int id, CreateIncomeDto updateDto, string userId)
    {
        var income = await _repository.GetIncomeByIdAsync(id);
        if (income == null || income.UserId != userId)
            throw new Exception("Income not found");
        
        income.Source = updateDto.Source;
        income.Amount = updateDto.Amount;
        income.Date = updateDto.Date;
        income.Description = updateDto.Description;
        income.UpdatedAt = DateTime.UtcNow;
        var updated = await _repository.UpdateIncomeAsync(income);
        return new IncomeDto
        {
            Id = updated.Id,
            Source = updated.Source,
            Amount = updated.Amount,
            Date = updated.Date,
            Description = updated.Description,
            CreatedAt = updated.CreatedAt,
            UpdatedAt = updated.UpdatedAt
        };
    }

    public async Task<bool> DeleteIncomeAsync(int id, string userId)
    {
        var income = await _repository.GetIncomeByIdAsync(id);
        if (income == null || income.UserId != userId) return false;
        return await _repository.DeleteIncomeAsync(id);
    }
}

