using SpendWiseApi.Models;

namespace SpendWiseApi.Repository.Interfaces;

public interface IEducationalContentRepository
{
    Task<IEnumerable<EducationalContent>> GetAllPublishedContentAsync();
    Task<EducationalContent?> GetContentByIdAsync(int id);
    Task<EducationalContent> CreateContentAsync(EducationalContent content);
    Task<EducationalContent> UpdateContentAsync(EducationalContent content);
    Task<bool> DeleteContentAsync(int id);
}

