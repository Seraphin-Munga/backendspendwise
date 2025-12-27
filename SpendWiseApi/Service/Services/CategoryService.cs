using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly SpendWiseDbContext _context;

    public CategoryService(ICategoryRepository categoryRepository, SpendWiseDbContext context)
    {
        _categoryRepository = categoryRepository;
        _context = context;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesByUserIdAsync(string userId)
    {
        var categories = await _categoryRepository.GetCategoriesByUserIdAsync(userId);
        return categories.Select(MapToDto);
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id, string userId)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(id);
        if (category == null || category.UserId != userId)
            return null;

        return MapToDto(category);
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createDto, string userId)
    {
        var category = new Category
        {
            Name = createDto.Name,
            Description = createDto.Description,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        var createdCategory = await _categoryRepository.CreateCategoryAsync(category);
        return MapToDto(createdCategory);
    }

    public async Task<CategoryDto> UpdateCategoryAsync(int id, CreateCategoryDto updateDto, string userId)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(id);
        if (category == null)
            throw new KeyNotFoundException($"Category with id {id} not found");

        if (category.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to update this category");

        category.Name = updateDto.Name;
        category.Description = updateDto.Description;
        category.UpdatedAt = DateTime.UtcNow;

        var updatedCategory = await _categoryRepository.UpdateCategoryAsync(category);
        return MapToDto(updatedCategory);
    }

    public async Task<bool> DeleteCategoryAsync(int id, string userId)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(id);
        if (category == null)
            return false;

        if (category.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to delete this category");

        return await _categoryRepository.DeleteCategoryAsync(id);
    }

    private static CategoryDto MapToDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }
}

