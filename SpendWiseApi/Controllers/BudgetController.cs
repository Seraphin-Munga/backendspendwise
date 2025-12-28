using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BudgetController : ControllerBase
{
    private readonly IBudgetService _budgetService;

    public BudgetController(IBudgetService budgetService)
    {
        _budgetService = budgetService;
    }

    [HttpGet]
    public async Task<IActionResult> GetBudgets()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var budgets = await _budgetService.GetBudgetsByUserIdAsync(userId);
        return Ok(budgets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBudget(int id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var budget = await _budgetService.GetBudgetByIdAsync(id, userId);
        if (budget == null)
            return NotFound();

        return Ok(budget);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBudget([FromBody] CreateBudgetDto createDto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var budget = await _budgetService.CreateBudgetAsync(createDto, userId);
            return CreatedAtAction(nameof(GetBudget), new { id = budget.Id }, budget);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBudget(int id, [FromBody] CreateBudgetDto updateDto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var budget = await _budgetService.UpdateBudgetAsync(id, updateDto, userId);
            return Ok(budget);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBudget(int id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _budgetService.DeleteBudgetAsync(id, userId);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
