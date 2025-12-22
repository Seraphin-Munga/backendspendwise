using SpendWiseApi.Service.DTOs;

namespace SpendWiseApi.Service.Interfaces;

public interface ISharedExpenseService
{
    Task<IEnumerable<SharedExpenseDto>> GetSharedExpensesByGroupIdAsync(int groupId, string userId);
    Task<SharedExpenseDto?> GetSharedExpenseByIdAsync(int id, string userId);
    Task<SharedExpenseDto> CreateSharedExpenseAsync(CreateSharedExpenseDto createDto, string userId);
    Task<SharedExpenseDto> UpdateSharedExpenseAsync(int id, CreateSharedExpenseDto updateDto, string userId);
    Task<bool> DeleteSharedExpenseAsync(int id, string userId);
}

