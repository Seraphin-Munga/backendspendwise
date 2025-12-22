using SpendWiseApi.Models;

namespace SpendWiseApi.Repository.Interfaces;

public interface IGroupRepository
{
    Task<IEnumerable<Group>> GetGroupsByUserIdAsync(string userId);
    Task<Group?> GetGroupByIdAsync(int id);
    Task<Group> CreateGroupAsync(Group group);
    Task<Group> UpdateGroupAsync(Group group);
    Task<bool> DeleteGroupAsync(int id);
}

