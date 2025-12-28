using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface IGroupMemberService
{
    Task<IEnumerable<GroupMemberDto>> GetGroupMembersByGroupIdAsync(int groupId, string userId);
    Task<GroupMemberDto?> GetGroupMemberByIdAsync(int id, string userId);
    Task<GroupMemberDto> AddMemberToGroupAsync(int groupId, CreateGroupMemberDto createDto, string currentUserId);
    Task<bool> RemoveMemberFromGroupAsync(int groupId, string memberUserId, string currentUserId);
    Task<GroupMemberDto> UpdateMemberRoleAsync(int groupId, string memberUserId, string newRole, string currentUserId);
}

