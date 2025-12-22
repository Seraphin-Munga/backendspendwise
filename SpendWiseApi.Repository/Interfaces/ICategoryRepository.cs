using SpendWiseApi.Models;

namespace SpendWiseApi.Repository.Interfaces;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetCategoriesByUserIdAsync(string userId);
    Task<Category?> GetCategoryByIdAsync(int id);
    Task<Category> CreateCategoryAsync(Category category);
    Task<Category> UpdateCategoryAsync(Category category);
    Task<bool> DeleteCategoryAsync(int id);
    Task<bool> CategoryExistsAsync(int id);
}

