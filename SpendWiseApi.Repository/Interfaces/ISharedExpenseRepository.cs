using SpendWiseApi.Models;

namespace SpendWiseApi.Repository.Interfaces;

public interface ISharedExpenseRepository
{
    Task<IEnumerable<SharedExpense>> GetSharedExpensesByGroupIdAsync(int groupId);
    Task<SharedExpense?> GetSharedExpenseByIdAsync(int id);
    Task<SharedExpense> CreateSharedExpenseAsync(SharedExpense expense);
    Task<SharedExpense> UpdateSharedExpenseAsync(SharedExpense expense);
    Task<bool> DeleteSharedExpenseAsync(int id);
}

