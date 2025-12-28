using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Models;
using SpendWiseApi.Repository.Data;
using SpendWiseApi.Repository.Interfaces;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Service.Services;

public class ReportService : IReportService
{
    private readonly IExpenseRepository _expenseRepository;
    private readonly IIncomeRepository _incomeRepository;
    private readonly IBudgetRepository _budgetRepository;
    private readonly SpendWiseDbContext _context;

    public ReportService(
        IExpenseRepository expenseRepository,
        IIncomeRepository incomeRepository,
        IBudgetRepository budgetRepository,
        SpendWiseDbContext context)
    {
        _expenseRepository = expenseRepository;
        _incomeRepository = incomeRepository;
        _budgetRepository = budgetRepository;
        _context = context;
    }

    public async Task<ReportDto> GetFinancialReportAsync(string userId, DateTime startDate, DateTime endDate)
    {
        // Validate date range
        if (startDate > endDate)
        {
            throw new ArgumentException("Start date cannot be greater than end date");
        }

        // Get all expenses and incomes in the date range with categories included
        var expenses = await _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.UserId == userId && e.Date >= startDate && e.Date <= endDate)
            .ToListAsync();
            
        var incomes = await _incomeRepository.GetIncomesByDateRangeAsync(userId, startDate, endDate);

        // Get all transactions in the date range
        var transactions = await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId && t.Date >= startDate && t.Date <= endDate)
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();

        // Get user's group memberships with group details
        var userGroupMemberships = await _context.GroupMembers
            .Include(gm => gm.Group)
                .ThenInclude(g => g!.CreatedByUser)
            .Include(gm => gm.Group)
                .ThenInclude(g => g!.Members)
            .Where(gm => gm.UserId == userId)
            .ToListAsync();

        var userGroups = userGroupMemberships.Select(gm => gm.GroupId).ToList();

        var groupSharedExpenses = await _context.SharedExpenses
            .Include(se => se.Group)
            .Include(se => se.PaidByUser)
            .Where(se => userGroups.Contains(se.GroupId) && 
                        se.Date >= startDate && 
                        se.Date <= endDate)
            .ToListAsync();

        // Get individual expense shares where user is involved
        var expenseShares = await _context.ExpenseShares
            .Include(es => es.Expense)
                .ThenInclude(e => e!.Category)
            .Include(es => es.SharedWithUser)
            .Where(es => (es.Expense!.UserId == userId || es.SharedWithUserId == userId) &&
                         es.Expense!.Date >= startDate &&
                         es.Expense!.Date <= endDate)
            .ToListAsync();

        // Calculate totals
        var totalIncome = incomes.Sum(i => i.Amount);
        var totalExpenses = expenses.Sum(e => e.Amount);
        var netAmount = totalIncome - totalExpenses;
        var savingsRate = totalIncome > 0 ? (netAmount / totalIncome) * 100 : 0;

        // Calculate averages
        var daysInRange = (endDate - startDate).Days + 1;
        var averageDailyIncome = daysInRange > 0 ? totalIncome / daysInRange : 0;
        var averageDailyExpense = daysInRange > 0 ? totalExpenses / daysInRange : 0;

        // Find largest transactions
        var largestExpense = expenses.Any() ? expenses.Max(e => e.Amount) : 0;
        var largestIncome = incomes.Any() ? incomes.Max(i => i.Amount) : 0;

        // Group expenses by category
        var categoryExpenses = expenses
            .Where(e => e.Category != null)
            .GroupBy(e => new { e.CategoryId, e.Category!.Name, e.Category.Emoji })
            .Select(g => new CategoryExpenseDto
            {
                CategoryId = g.Key.CategoryId,
                CategoryName = g.Key.Name,
                CategoryEmoji = g.Key.Emoji,
                TotalAmount = g.Sum(e => e.Amount),
                ExpenseCount = g.Count(),
                PercentageOfTotal = totalExpenses > 0 ? (g.Sum(e => e.Amount) / totalExpenses) * 100 : 0,
                AverageAmount = g.Average(e => e.Amount)
            })
            .OrderByDescending(c => c.TotalAmount)
            .ToList();

        // Calculate monthly summaries
        var monthlySummaries = new List<MonthlySummaryDto>();
        var currentDate = new DateTime(startDate.Year, startDate.Month, 1);
        
        while (currentDate <= endDate)
        {
            var monthStart = currentDate;
            var monthEnd = currentDate.AddMonths(1).AddDays(-1);
            if (monthEnd > endDate) monthEnd = endDate;

            var monthExpenses = expenses.Where(e => e.Date >= monthStart && e.Date <= monthEnd).Sum(e => e.Amount);
            var monthIncomes = incomes.Where(i => i.Date >= monthStart && i.Date <= monthEnd).Sum(i => i.Amount);

            monthlySummaries.Add(new MonthlySummaryDto
            {
                Year = currentDate.Year,
                Month = currentDate.Month,
                MonthName = currentDate.ToString("MMMM"),
                TotalIncome = monthIncomes,
                TotalExpenses = monthExpenses,
                NetAmount = monthIncomes - monthExpenses
            });

            currentDate = currentDate.AddMonths(1);
        }

        // Get budget comparison
        var budgets = await _budgetRepository.GetBudgetsByUserIdAsync(userId);
        var activeBudgets = budgets.Where(b => 
            b.StartDate <= endDate && 
            b.EndDate >= startDate).ToList();

        BudgetComparisonDto? budgetComparison = null;
        if (activeBudgets.Any())
        {
            var totalBudgeted = activeBudgets.Sum(b => b.Amount);
            var categoryBudgets = new List<CategoryBudgetDto>();

            foreach (var budget in activeBudgets)
            {
                var budgetStart = budget.StartDate > startDate ? budget.StartDate : startDate;
                var budgetEnd = budget.EndDate < endDate ? budget.EndDate : endDate;
                
                var spentInBudgetPeriod = expenses
                    .Where(e => e.CategoryId == budget.CategoryId && 
                               e.Date >= budgetStart && 
                               e.Date <= budgetEnd)
                    .Sum(e => e.Amount);

                var utilizationPercentage = budget.Amount > 0 ? (spentInBudgetPeriod / budget.Amount) * 100 : 0;
                var remainingAmount = budget.Amount - spentInBudgetPeriod;

                categoryBudgets.Add(new CategoryBudgetDto
                {
                    CategoryId = budget.CategoryId,
                    CategoryName = budget.Category?.Name ?? "Unknown",
                    CategoryEmoji = budget.Category?.Emoji,
                    BudgetedAmount = budget.Amount,
                    SpentAmount = spentInBudgetPeriod,
                    RemainingAmount = remainingAmount,
                    UtilizationPercentage = utilizationPercentage,
                    IsOverBudget = spentInBudgetPeriod > budget.Amount
                });
            }

            var totalSpent = categoryBudgets.Sum(cb => cb.SpentAmount);
            var totalRemaining = totalBudgeted - totalSpent;
            var overallUtilization = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

            budgetComparison = new BudgetComparisonDto
            {
                TotalBudgeted = totalBudgeted,
                TotalSpent = totalSpent,
                BudgetUtilization = overallUtilization,
                RemainingBudget = totalRemaining,
                CategoryBudgets = categoryBudgets.OrderByDescending(cb => cb.SpentAmount).ToList()
            };
        }

        // Map transactions to DTOs - expenses are shown as negative amounts
        var transactionDtos = transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Type = t.Type == TransactionType.Income ? "Income" : "Expense",
            Description = t.Description,
            Amount = t.Type == TransactionType.Income ? t.Amount : -t.Amount, // Expenses are negative
            Date = t.Date,
            CategoryId = t.CategoryId,
            CategoryName = t.Category?.Name,
            CategoryEmoji = t.Category?.Emoji,
            Notes = t.Notes,
            CreatedAt = t.CreatedAt
        }).ToList();

        // Process group shared expenses
        var sharedExpenseDtos = new List<SharedExpenseDto>();
        decimal totalSharedExpenses = 0;

        foreach (var groupExpense in groupSharedExpenses)
        {
            // Get group members count to calculate share
            var groupMemberCount = await _context.GroupMembers
                .Where(gm => gm.GroupId == groupExpense.GroupId)
                .CountAsync();

            var userShareAmount = groupMemberCount > 0 ? groupExpense.Amount / groupMemberCount : 0;
            var isPaidByUser = groupExpense.PaidByUserId == userId;

            // If user paid, they're owed (positive), if they didn't pay, they owe (negative)
            var userNetAmount = isPaidByUser 
                ? groupExpense.Amount - userShareAmount  // User paid full amount, but their share is deducted
                : -userShareAmount; // User owes their share

            totalSharedExpenses += userNetAmount;

            sharedExpenseDtos.Add(new SharedExpenseDto
            {
                Id = groupExpense.Id,
                GroupId = groupExpense.GroupId,
                GroupName = groupExpense.Group?.Name ?? "Unknown Group",
                Description = groupExpense.Description,
                TotalAmount = groupExpense.Amount,
                UserShareAmount = userShareAmount,
                PaidByUserId = groupExpense.PaidByUserId,
                PaidByUserName = groupExpense.PaidByUser?.Email ?? groupExpense.PaidByUser?.UserName,
                IsPaidByUser = isPaidByUser,
                Date = groupExpense.Date,
                CreatedAt = groupExpense.CreatedAt,
                ShareType = "Group"
            });
        }

        // Process individual expense shares
        foreach (var expenseShare in expenseShares)
        {
            var expense = expenseShare.Expense;
            if (expense == null) continue;

            var isExpenseOwner = expense.UserId == userId;
            var shareAmount = expenseShare.Amount;

            // If user owns the expense, they're getting paid back (positive)
            // If user is shared with, they owe (negative)
            var userNetAmount = isExpenseOwner ? shareAmount : -shareAmount;
            totalSharedExpenses += userNetAmount;

            sharedExpenseDtos.Add(new SharedExpenseDto
            {
                Id = expenseShare.Id,
                GroupId = 0, // Not a group expense
                GroupName = "Individual Share",
                Description = expense.Description,
                TotalAmount = expense.Amount,
                UserShareAmount = shareAmount,
                PaidByUserId = expense.UserId,
                PaidByUserName = expense.User?.Email ?? expense.User?.UserName,
                IsPaidByUser = isExpenseOwner,
                Date = expense.Date,
                CreatedAt = expenseShare.CreatedAt,
                ShareType = "Individual"
            });
        }

        return new ReportDto
        {
            StartDate = startDate,
            EndDate = endDate,
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            NetAmount = netAmount,
            SavingsRate = savingsRate,
            TotalIncomeTransactions = incomes.Count(),
            TotalExpenseTransactions = expenses.Count(),
            AverageDailyIncome = averageDailyIncome,
            AverageDailyExpense = averageDailyExpense,
            LargestExpense = largestExpense,
            LargestIncome = largestIncome,
            CategoryExpenses = categoryExpenses,
            MonthlySummaries = monthlySummaries,
            BudgetComparison = budgetComparison,
            Transactions = transactionDtos,
            SharedExpenses = sharedExpenseDtos.OrderByDescending(se => se.Date).ToList(),
            TotalSharedExpenses = totalSharedExpenses,
            Groups = await GetGroupsForReportAsync(userId, userGroupMemberships, startDate, endDate, groupSharedExpenses),
            GeneratedAt = DateTime.UtcNow
        };
    }

    private async Task<List<GroupDto>> GetGroupsForReportAsync(
        string userId,
        List<GroupMember> userGroupMemberships,
        DateTime startDate,
        DateTime endDate,
        List<SharedExpense> groupSharedExpenses)
    {
        var groupDtos = new List<GroupDto>();

        foreach (var membership in userGroupMemberships)
        {
            var group = membership.Group;
            if (group == null) continue;

            // Get member count
            var memberCount = await _context.GroupMembers
                .Where(gm => gm.GroupId == group.Id)
                .CountAsync();

            // Get expenses for this group in the date range
            var groupExpensesInRange = groupSharedExpenses
                .Where(se => se.GroupId == group.Id)
                .ToList();

            var totalExpenses = groupExpensesInRange.Count;
            var totalExpenseAmount = groupExpensesInRange.Sum(se => se.Amount);

            // Calculate user's total owed/owed amount in this group
            decimal userTotalOwed = 0;
            foreach (var expense in groupExpensesInRange)
            {
                var groupMemberCount = await _context.GroupMembers
                    .Where(gm => gm.GroupId == group.Id)
                    .CountAsync();

                var userShareAmount = groupMemberCount > 0 ? expense.Amount / groupMemberCount : 0;
                var isPaidByUser = expense.PaidByUserId == userId;

                var userNetAmount = isPaidByUser
                    ? expense.Amount - userShareAmount
                    : -userShareAmount;

                userTotalOwed += userNetAmount;
            }

            // Map role
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
                MemberCount = memberCount,
                TotalExpenses = totalExpenses,
                TotalExpenseAmount = totalExpenseAmount,
                UserTotalOwed = userTotalOwed,
                CreatedAt = group.CreatedAt,
                JoinedAt = membership.JoinedAt
            });
        }

        return groupDtos.OrderByDescending(g => g.JoinedAt).ToList();
    }
}

