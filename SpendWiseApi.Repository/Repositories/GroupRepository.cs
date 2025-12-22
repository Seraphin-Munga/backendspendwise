using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;

namespace SpendWiseApi.Repository.Repositories;

public class GroupRepository : IGroupRepository
{
    private readonly SpendWiseDbContext _context;

    public GroupRepository(SpendWiseDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Group>> GetGroupsByUserIdAsync(string userId)
    {
        return await _context.Groups
            .Include(g => g.Members)
            .Where(g => g.Members.Any(m => m.UserId == userId))
            .ToListAsync();
    }

    public async Task<Group?> GetGroupByIdAsync(int id)
    {
        return await _context.Groups
            .Include(g => g.Members)
            .ThenInclude(m => m.User)
            .Include(g => g.SharedExpenses)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task<Group> CreateGroupAsync(Group group)
    {
        group.CreatedAt = DateTime.UtcNow;
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();
        return group;
    }

    public async Task<Group> UpdateGroupAsync(Group group)
    {
        group.UpdatedAt = DateTime.UtcNow;
        _context.Groups.Update(group);
        await _context.SaveChangesAsync();
        return group;
    }

    public async Task<bool> DeleteGroupAsync(int id)
    {
        var group = await _context.Groups.FindAsync(id);
        if (group == null) return false;

        _context.Groups.Remove(group);
        await _context.SaveChangesAsync();
        return true;
    }
}

