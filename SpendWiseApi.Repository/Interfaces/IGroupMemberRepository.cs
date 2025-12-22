using SpendWiseApi.Models;

namespace SpendWiseApi.Repository.Interfaces;

public interface IGroupMemberRepository
{
    Task<IEnumerable<GroupMember>> GetGroupMembersByGroupIdAsync(int groupId);
    Task<GroupMember?> GetGroupMemberByIdAsync(int id);
    Task<GroupMember> CreateGroupMemberAsync(GroupMember member);
    Task<bool> DeleteGroupMemberAsync(int id);
    Task<bool> IsUserMemberOfGroupAsync(string userId, int groupId);
}

