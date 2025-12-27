using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetCategoriesByUserIdAsync(string userId);
    Task<CategoryDto?> GetCategoryByIdAsync(int id, string userId);
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createDto, string userId);
    Task<CategoryDto> UpdateCategoryAsync(int id, CreateCategoryDto updateDto, string userId);
    Task<bool> DeleteCategoryAsync(int id, string userId);
}

