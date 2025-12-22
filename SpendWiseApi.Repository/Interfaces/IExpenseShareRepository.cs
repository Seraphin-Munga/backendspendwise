using SpendWiseApi.Models;

namespace SpendWiseApi.Repository.Interfaces;

public interface IExpenseShareRepository
{
    Task<IEnumerable<ExpenseShare>> GetExpenseSharesByExpenseIdAsync(int expenseId);
    Task<ExpenseShare?> GetExpenseShareByIdAsync(int id);
    Task<ExpenseShare> CreateExpenseShareAsync(ExpenseShare share);
    Task<ExpenseShare> UpdateExpenseShareAsync(ExpenseShare share);
    Task<bool> DeleteExpenseShareAsync(int id);
}

