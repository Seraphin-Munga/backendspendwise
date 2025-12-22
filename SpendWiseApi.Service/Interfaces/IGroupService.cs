using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface IGroupService
{
    Task<IEnumerable<GroupDto>> GetGroupsByUserIdAsync(string userId);
    Task<GroupDto?> GetGroupByIdAsync(int id, string userId);
    Task<GroupDto> CreateGroupAsync(CreateGroupDto createDto, string userId);
    Task<GroupDto> UpdateGroupAsync(int id, CreateGroupDto updateDto, string userId);
    Task<bool> DeleteGroupAsync(int id, string userId);
    Task<bool> AddMemberToGroupAsync(int groupId, string memberUserId, string currentUserId);
    Task<bool> RemoveMemberFromGroupAsync(int groupId, string memberUserId, string currentUserId);
}

