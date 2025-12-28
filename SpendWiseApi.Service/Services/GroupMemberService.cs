using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class GroupMemberService : IGroupMemberService
{
    private readonly IGroupMemberRepository _groupMemberRepository;
    private readonly IGroupRepository _groupRepository;
    private readonly SpendWiseDbContext _context;

    public GroupMemberService(
        IGroupMemberRepository groupMemberRepository,
        IGroupRepository groupRepository,
        SpendWiseDbContext context)
    {
        _groupMemberRepository = groupMemberRepository;
        _groupRepository = groupRepository;
        _context = context;
    }

    public async Task<IEnumerable<GroupMemberDto>> GetGroupMembersByGroupIdAsync(int groupId, string userId)
    {
        var isMember = await _groupMemberRepository.IsUserMemberOfGroupAsync(userId, groupId);
        if (!isMember)
            throw new UnauthorizedAccessException("You are not a member of this group");

        var members = await _groupMemberRepository.GetGroupMembersByGroupIdAsync(groupId);
        return members.Select(m => new GroupMemberDto
        {
            Id = m.Id,
            UserId = m.UserId,
            UserEmail = m.User?.Email ?? m.User?.UserName,
            IsAdmin = m.Role == GroupMemberRole.Admin,
            JoinedAt = m.JoinedAt
        });
    }

    public async Task<GroupMemberDto?> GetGroupMemberByIdAsync(int id, string userId)
    {
        var member = await _groupMemberRepository.GetGroupMemberByIdAsync(id);
        if (member == null) return null;

        var isMember = await _groupMemberRepository.IsUserMemberOfGroupAsync(userId, member.GroupId);
        if (!isMember) return null;

        return new GroupMemberDto
        {
            Id = member.Id,
            UserId = member.UserId,
            UserEmail = member.User?.Email ?? member.User?.UserName,
            IsAdmin = member.Role == GroupMemberRole.Admin,
            JoinedAt = member.JoinedAt
        };
    }

    public async Task<GroupMemberDto> AddMemberToGroupAsync(int groupId, CreateGroupMemberDto createDto, string currentUserId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId);
        if (group == null)
            throw new ArgumentException("Group not found");

        var currentUserMembership = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == currentUserId);

        if (currentUserMembership == null || currentUserMembership.Role != GroupMemberRole.Admin)
            throw new UnauthorizedAccessException("Only group admins can add members");

        var isAlreadyMember = await _groupMemberRepository.IsUserMemberOfGroupAsync(createDto.UserId, groupId);
        if (isAlreadyMember)
            throw new InvalidOperationException("User is already a member of this group");

        // Parse role
        var role = createDto.Role.ToLower() switch
        {
            "admin" => GroupMemberRole.Admin,
            "child" => GroupMemberRole.Child,
            _ => GroupMemberRole.Member
        };

        var newMember = new GroupMember
        {
            GroupId = groupId,
            UserId = createDto.UserId,
            Role = role,
            JoinedAt = DateTime.UtcNow
        };

        var created = await _groupMemberRepository.CreateGroupMemberAsync(newMember);
        
        // Reload with user data
        var memberWithUser = await _groupMemberRepository.GetGroupMemberByIdAsync(created.Id);
        if (memberWithUser == null)
            throw new InvalidOperationException("Failed to retrieve created member");

        return new GroupMemberDto
        {
            Id = memberWithUser.Id,
            UserId = memberWithUser.UserId,
            UserEmail = memberWithUser.User?.Email ?? memberWithUser.User?.UserName,
            IsAdmin = memberWithUser.Role == GroupMemberRole.Admin,
            JoinedAt = memberWithUser.JoinedAt
        };
    }

    public async Task<bool> RemoveMemberFromGroupAsync(int groupId, string memberUserId, string currentUserId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId);
        if (group == null)
            throw new ArgumentException("Group not found");

        var currentUserMembership = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == currentUserId);

        if (currentUserMembership == null || currentUserMembership.Role != GroupMemberRole.Admin)
            throw new UnauthorizedAccessException("Only group admins can remove members");

        // Prevent removing the last admin
        var admins = await _context.GroupMembers
            .Where(gm => gm.GroupId == groupId && gm.Role == GroupMemberRole.Admin)
            .CountAsync();

        var memberToRemove = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == memberUserId);

        if (memberToRemove == null)
            return false;

        if (memberToRemove.Role == GroupMemberRole.Admin && admins <= 1)
            throw new InvalidOperationException("Cannot remove the last admin from the group");

        return await _groupMemberRepository.DeleteGroupMemberAsync(memberToRemove.Id);
    }

    public async Task<GroupMemberDto> UpdateMemberRoleAsync(int groupId, string memberUserId, string newRole, string currentUserId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId);
        if (group == null)
            throw new ArgumentException("Group not found");

        var currentUserMembership = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == currentUserId);

        if (currentUserMembership == null || currentUserMembership.Role != GroupMemberRole.Admin)
            throw new UnauthorizedAccessException("Only group admins can update member roles");

        var memberToUpdate = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == memberUserId);

        if (memberToUpdate == null)
            throw new ArgumentException("Member not found");

        // Prevent removing the last admin
        if (memberToUpdate.Role == GroupMemberRole.Admin && newRole.ToLower() != "admin")
        {
            var adminCount = await _context.GroupMembers
                .Where(gm => gm.GroupId == groupId && gm.Role == GroupMemberRole.Admin)
                .CountAsync();

            if (adminCount <= 1)
                throw new InvalidOperationException("Cannot remove the last admin from the group");
        }

        // Parse new role
        var role = newRole.ToLower() switch
        {
            "admin" => GroupMemberRole.Admin,
            "child" => GroupMemberRole.Child,
            _ => GroupMemberRole.Member
        };

        memberToUpdate.Role = role;
        _context.GroupMembers.Update(memberToUpdate);
        await _context.SaveChangesAsync();

        // Reload with user data
        var updatedMember = await _groupMemberRepository.GetGroupMemberByIdAsync(memberToUpdate.Id);
        if (updatedMember == null)
            throw new InvalidOperationException("Failed to retrieve updated member");

        return new GroupMemberDto
        {
            Id = updatedMember.Id,
            UserId = updatedMember.UserId,
            UserEmail = updatedMember.User?.Email ?? updatedMember.User?.UserName,
            IsAdmin = updatedMember.Role == GroupMemberRole.Admin,
            JoinedAt = updatedMember.JoinedAt
        };
    }
}

