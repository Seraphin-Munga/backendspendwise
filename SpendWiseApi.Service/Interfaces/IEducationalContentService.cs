using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface IEducationalContentService
{
    Task<IEnumerable<EducationalContentDto>> GetAllPublishedContentAsync();
    Task<EducationalContentDto?> GetContentByIdAsync(int id);
}

