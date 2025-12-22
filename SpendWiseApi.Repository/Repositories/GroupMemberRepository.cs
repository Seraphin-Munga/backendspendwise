using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;

namespace SpendWiseApi.Repository.Repositories;

public class GroupMemberRepository : IGroupMemberRepository
{
    private readonly SpendWiseDbContext _context;

    public GroupMemberRepository(SpendWiseDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<GroupMember>> GetGroupMembersByGroupIdAsync(int groupId)
    {
        return await _context.GroupMembers
            .Include(m => m.User)
            .Where(m => m.GroupId == groupId)
            .ToListAsync();
    }

    public async Task<GroupMember?> GetGroupMemberByIdAsync(int id)
    {
        return await _context.GroupMembers
            .Include(m => m.User)
            .Include(m => m.Group)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<GroupMember> CreateGroupMemberAsync(GroupMember member)
    {
        member.JoinedAt = DateTime.UtcNow;
        _context.GroupMembers.Add(member);
        await _context.SaveChangesAsync();
        return member;
    }

    public async Task<bool> DeleteGroupMemberAsync(int id)
    {
        var member = await _context.GroupMembers.FindAsync(id);
        if (member == null) return false;

        _context.GroupMembers.Remove(member);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsUserMemberOfGroupAsync(string userId, int groupId)
    {
        return await _context.GroupMembers
            .AnyAsync(m => m.UserId == userId && m.GroupId == groupId);
    }
}

