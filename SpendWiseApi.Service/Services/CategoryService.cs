using SpendWiseApi.Models;
using SpendWiseApi.Repository.Interfaces;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repository;

    public CategoryService(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesByUserIdAsync(string userId)
    {
        var categories = await _repository.GetCategoriesByUserIdAsync(userId);
        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        });
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id, string userId)
    {
        var category = await _repository.GetCategoryByIdAsync(id);
        if (category == null || category.UserId != userId) return null;
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createDto, string userId)
    {
        var category = new Category
        {
            Name = createDto.Name,
            Description = createDto.Description,
            UserId = userId
        };
        var created = await _repository.CreateCategoryAsync(category);
        return new CategoryDto
        {
            Id = created.Id,
            Name = created.Name,
            Description = created.Description,
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt
        };
    }

    public async Task<CategoryDto> UpdateCategoryAsync(int id, CreateCategoryDto updateDto, string userId)
    {
        var category = await _repository.GetCategoryByIdAsync(id);
        if (category == null || category.UserId != userId)
            throw new Exception("Category not found");
        
        category.Name = updateDto.Name;
        category.Description = updateDto.Description;
        var updated = await _repository.UpdateCategoryAsync(category);
        return new CategoryDto
        {
            Id = updated.Id,
            Name = updated.Name,
            Description = updated.Description,
            CreatedAt = updated.CreatedAt,
            UpdatedAt = updated.UpdatedAt
        };
    }

    public async Task<bool> DeleteCategoryAsync(int id, string userId)
    {
        var category = await _repository.GetCategoryByIdAsync(id);
        if (category == null || category.UserId != userId) return false;
        return await _repository.DeleteCategoryAsync(id);
    }
}
