using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class SharedExpenseService : ISharedExpenseService
{
    private readonly ISharedExpenseRepository _sharedExpenseRepository;
    private readonly IGroupMemberRepository _groupMemberRepository;
    private readonly SpendWiseDbContext _context;

    public SharedExpenseService(
        ISharedExpenseRepository sharedExpenseRepository,
        IGroupMemberRepository groupMemberRepository,
        SpendWiseDbContext context)
    {
        _sharedExpenseRepository = sharedExpenseRepository;
        _groupMemberRepository = groupMemberRepository;
        _context = context;
    }

    public async Task<IEnumerable<SharedExpenseDto>> GetSharedExpensesByGroupIdAsync(int groupId, string userId)
    {
        var isMember = await _groupMemberRepository.IsUserMemberOfGroupAsync(userId, groupId);
        if (!isMember)
            throw new UnauthorizedAccessException("You are not a member of this group");

        var sharedExpenses = await _sharedExpenseRepository.GetSharedExpensesByGroupIdAsync(groupId);
        var group = await _context.Groups
            .Include(g => g.Members)
            .FirstOrDefaultAsync(g => g.Id == groupId);

        if (group == null) return Enumerable.Empty<SharedExpenseDto>();

        var memberCount = group.Members.Count;
        var sharedExpenseDtos = new List<SharedExpenseDto>();

        foreach (var expense in sharedExpenses)
        {
            var userShareAmount = memberCount > 0 ? expense.Amount / memberCount : 0;
            var isPaidByUser = expense.PaidByUserId == userId;

            sharedExpenseDtos.Add(new SharedExpenseDto
            {
                Id = expense.Id,
                GroupId = expense.GroupId,
                GroupName = group.Name,
                Description = expense.Description,
                TotalAmount = expense.Amount,
                UserShareAmount = userShareAmount,
                PaidByUserId = expense.PaidByUserId,
                PaidByUserName = expense.PaidByUser?.Email ?? expense.PaidByUser?.UserName,
                IsPaidByUser = isPaidByUser,
                Date = expense.Date,
                CreatedAt = expense.CreatedAt,
                ShareType = "Group"
            });
        }

        return sharedExpenseDtos.OrderByDescending(se => se.Date);
    }

    public async Task<SharedExpenseDto?> GetSharedExpenseByIdAsync(int id, string userId)
    {
        var expense = await _sharedExpenseRepository.GetSharedExpenseByIdAsync(id);
        if (expense == null) return null;

        var isMember = await _groupMemberRepository.IsUserMemberOfGroupAsync(userId, expense.GroupId);
        if (!isMember) return null;

        var group = await _context.Groups
            .Include(g => g.Members)
            .FirstOrDefaultAsync(g => g.Id == expense.GroupId);

        if (group == null) return null;

        var memberCount = group.Members.Count;
        var userShareAmount = memberCount > 0 ? expense.Amount / memberCount : 0;
        var isPaidByUser = expense.PaidByUserId == userId;

        return new SharedExpenseDto
        {
            Id = expense.Id,
            GroupId = expense.GroupId,
            GroupName = group.Name,
            Description = expense.Description,
            TotalAmount = expense.Amount,
            UserShareAmount = userShareAmount,
            PaidByUserId = expense.PaidByUserId,
            PaidByUserName = expense.PaidByUser?.Email ?? expense.PaidByUser?.UserName,
            IsPaidByUser = isPaidByUser,
            Date = expense.Date,
            CreatedAt = expense.CreatedAt,
            ShareType = "Group"
        };
    }

    public async Task<SharedExpenseDto> CreateSharedExpenseAsync(CreateSharedExpenseDto createDto, string userId)
    {
        var isMember = await _groupMemberRepository.IsUserMemberOfGroupAsync(userId, createDto.GroupId);
        if (!isMember)
            throw new UnauthorizedAccessException("You are not a member of this group");

        var sharedExpense = new SharedExpense
        {
            GroupId = createDto.GroupId,
            Description = createDto.Description,
            Amount = createDto.Amount,
            Date = createDto.Date,
            PaidByUserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _sharedExpenseRepository.CreateSharedExpenseAsync(sharedExpense);
        return await GetSharedExpenseByIdAsync(created.Id, userId) 
            ?? throw new InvalidOperationException("Failed to retrieve created shared expense");
    }

    public async Task<SharedExpenseDto> UpdateSharedExpenseAsync(int id, CreateSharedExpenseDto updateDto, string userId)
    {
        var expense = await _sharedExpenseRepository.GetSharedExpenseByIdAsync(id);
        if (expense == null)
            throw new ArgumentException("Shared expense not found");

        if (expense.PaidByUserId != userId)
            throw new UnauthorizedAccessException("Only the person who paid can update this expense");

        var isMember = await _groupMemberRepository.IsUserMemberOfGroupAsync(userId, updateDto.GroupId);
        if (!isMember)
            throw new UnauthorizedAccessException("You are not a member of this group");

        expense.GroupId = updateDto.GroupId;
        expense.Description = updateDto.Description;
        expense.Amount = updateDto.Amount;
        expense.Date = updateDto.Date;
        expense.UpdatedAt = DateTime.UtcNow;

        await _sharedExpenseRepository.UpdateSharedExpenseAsync(expense);
        return await GetSharedExpenseByIdAsync(id, userId) 
            ?? throw new InvalidOperationException("Failed to retrieve updated shared expense");
    }

    public async Task<bool> DeleteSharedExpenseAsync(int id, string userId)
    {
        var expense = await _sharedExpenseRepository.GetSharedExpenseByIdAsync(id);
        if (expense == null) return false;

        if (expense.PaidByUserId != userId)
            throw new UnauthorizedAccessException("Only the person who paid can delete this expense");

        return await _sharedExpenseRepository.DeleteSharedExpenseAsync(id);
    }
}

