using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class GroupService : IGroupService
{
    private readonly IGroupRepository _groupRepository;
    private readonly IGroupMemberRepository _groupMemberRepository;
    private readonly SpendWiseDbContext _context;

    public GroupService(
        IGroupRepository groupRepository,
        IGroupMemberRepository groupMemberRepository,
        SpendWiseDbContext context)
    {
        _groupRepository = groupRepository;
        _groupMemberRepository = groupMemberRepository;
        _context = context;
    }

    public async Task<IEnumerable<GroupDto>> GetGroupsByUserIdAsync(string userId)
    {
        var groups = await _groupRepository.GetGroupsByUserIdAsync(userId);
        var groupDtos = new List<GroupDto>();

        foreach (var group in groups)
        {
            var membership = await _context.GroupMembers
                .FirstOrDefaultAsync(gm => gm.GroupId == group.Id && gm.UserId == userId);

            if (membership == null) continue;

            var memberCount = await _groupMemberRepository.GetGroupMembersByGroupIdAsync(group.Id);
            var memberCountList = memberCount.ToList();

            var roleName = membership.Role switch
            {
                GroupMemberRole.Admin => "Admin",
                GroupMemberRole.Member => "Member",
                GroupMemberRole.Child => "Child",
                _ => "Member"
            };

            groupDtos.Add(new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                CreatedByUserId = group.CreatedByUserId,
                CreatedByUserName = group.CreatedByUser?.Email ?? group.CreatedByUser?.UserName,
                UserRole = roleName,
                MemberCount = memberCountList.Count,
                TotalExpenses = 0, // Will be calculated if needed
                TotalExpenseAmount = 0, // Will be calculated if needed
                UserTotalOwed = 0, // Will be calculated if needed
                CreatedAt = group.CreatedAt,
                JoinedAt = membership.JoinedAt
            });
        }

        return groupDtos.OrderByDescending(g => g.JoinedAt);
    }

    public async Task<GroupDto?> GetGroupByIdAsync(int id, string userId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(id);
        if (group == null) return null;

        var isMember = await _groupMemberRepository.IsUserMemberOfGroupAsync(userId, id);
        if (!isMember) return null;

        var membership = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == id && gm.UserId == userId);

        if (membership == null) return null;

        var memberCount = await _groupMemberRepository.GetGroupMembersByGroupIdAsync(id);
        var memberCountList = memberCount.ToList();

        var roleName = membership.Role switch
        {
            GroupMemberRole.Admin => "Admin",
            GroupMemberRole.Member => "Member",
            GroupMemberRole.Child => "Child",
            _ => "Member"
        };

        // Calculate shared expenses totals
        var sharedExpenses = await _context.SharedExpenses
            .Where(se => se.GroupId == id)
            .ToListAsync();

        var totalExpenses = sharedExpenses.Count;
        var totalExpenseAmount = sharedExpenses.Sum(se => se.Amount);

        // Calculate user's total owed/owed amount
        decimal userTotalOwed = 0;
        foreach (var expense in sharedExpenses)
        {
            var groupMemberCount = memberCountList.Count;
            var userShareAmount = groupMemberCount > 0 ? expense.Amount / groupMemberCount : 0;
            var isPaidByUser = expense.PaidByUserId == userId;

            var userNetAmount = isPaidByUser
                ? expense.Amount - userShareAmount
                : -userShareAmount;

            userTotalOwed += userNetAmount;
        }

        return new GroupDto
        {
            Id = group.Id,
            Name = group.Name,
            Description = group.Description,
            CreatedByUserId = group.CreatedByUserId,
            CreatedByUserName = group.CreatedByUser?.Email ?? group.CreatedByUser?.UserName,
            UserRole = roleName,
            MemberCount = memberCountList.Count,
            TotalExpenses = totalExpenses,
            TotalExpenseAmount = totalExpenseAmount,
            UserTotalOwed = userTotalOwed,
            CreatedAt = group.CreatedAt,
            JoinedAt = membership.JoinedAt
        };
    }

    public async Task<GroupDto> CreateGroupAsync(CreateGroupDto createDto, string userId)
    {
        var group = new Group
        {
            Name = createDto.Name,
            Description = createDto.Description,
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        var createdGroup = await _groupRepository.CreateGroupAsync(group);

        // Add creator as admin member
        var creatorMember = new GroupMember
        {
            GroupId = createdGroup.Id,
            UserId = userId,
            Role = GroupMemberRole.Admin,
            JoinedAt = DateTime.UtcNow
        };

        await _groupMemberRepository.CreateGroupMemberAsync(creatorMember);

        return await GetGroupByIdAsync(createdGroup.Id, userId) 
            ?? throw new InvalidOperationException("Failed to retrieve created group");
    }

    public async Task<GroupDto> UpdateGroupAsync(int id, CreateGroupDto updateDto, string userId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(id);
        if (group == null)
            throw new ArgumentException("Group not found");

        var membership = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == id && gm.UserId == userId);

        if (membership == null || membership.Role != GroupMemberRole.Admin)
            throw new UnauthorizedAccessException("Only group admins can update the group");

        group.Name = updateDto.Name;
        group.Description = updateDto.Description;
        group.UpdatedAt = DateTime.UtcNow;

        await _groupRepository.UpdateGroupAsync(group);
        return await GetGroupByIdAsync(id, userId) 
            ?? throw new InvalidOperationException("Failed to retrieve updated group");
    }

    public async Task<bool> DeleteGroupAsync(int id, string userId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(id);
        if (group == null) return false;

        var membership = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == id && gm.UserId == userId);

        if (membership == null || membership.Role != GroupMemberRole.Admin)
            throw new UnauthorizedAccessException("Only group admins can delete the group");

        return await _groupRepository.DeleteGroupAsync(id);
    }

    public async Task<bool> AddMemberToGroupAsync(int groupId, string memberUserId, string currentUserId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId);
        if (group == null) return false;

        var currentUserMembership = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == currentUserId);

        if (currentUserMembership == null || currentUserMembership.Role != GroupMemberRole.Admin)
            throw new UnauthorizedAccessException("Only group admins can add members");

        var isAlreadyMember = await _groupMemberRepository.IsUserMemberOfGroupAsync(memberUserId, groupId);
        if (isAlreadyMember) return false;

        var newMember = new GroupMember
        {
            GroupId = groupId,
            UserId = memberUserId,
            Role = GroupMemberRole.Member,
            JoinedAt = DateTime.UtcNow
        };

        await _groupMemberRepository.CreateGroupMemberAsync(newMember);
        return true;
    }

    public async Task<bool> RemoveMemberFromGroupAsync(int groupId, string memberUserId, string currentUserId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId);
        if (group == null) return false;

        var currentUserMembership = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == currentUserId);

        if (currentUserMembership == null || currentUserMembership.Role != GroupMemberRole.Admin)
            throw new UnauthorizedAccessException("Only group admins can remove members");

        var memberToRemove = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == memberUserId);

        if (memberToRemove == null) return false;

        return await _groupMemberRepository.DeleteGroupMemberAsync(memberToRemove.Id);
    }
}

