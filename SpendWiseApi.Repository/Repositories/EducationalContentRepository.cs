using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;

namespace SpendWiseApi.Repository.Repositories;

public class EducationalContentRepository : IEducationalContentRepository
{
    private readonly SpendWiseDbContext _context;

    public EducationalContentRepository(SpendWiseDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EducationalContent>> GetAllPublishedContentAsync()
    {
        return await _context.EducationalContents
            .Where(c => c.IsPublished)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<EducationalContent?> GetContentByIdAsync(int id)
    {
        return await _context.EducationalContents.FindAsync(id);
    }

    public async Task<EducationalContent> CreateContentAsync(EducationalContent content)
    {
        content.CreatedAt = DateTime.UtcNow;
        _context.EducationalContents.Add(content);
        await _context.SaveChangesAsync();
        return content;
    }

    public async Task<EducationalContent> UpdateContentAsync(EducationalContent content)
    {
        content.UpdatedAt = DateTime.UtcNow;
        _context.EducationalContents.Update(content);
        await _context.SaveChangesAsync();
        return content;
    }

    public async Task<bool> DeleteContentAsync(int id)
    {
        var content = await _context.EducationalContents.FindAsync(id);
        if (content == null) return false;

        _context.EducationalContents.Remove(content);
        await _context.SaveChangesAsync();
        return true;
    }
}

