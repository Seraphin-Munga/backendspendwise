using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IncomeController : ControllerBase
{
    private readonly IIncomeService _incomeService;

    public IncomeController(IIncomeService incomeService)
    {
        _incomeService = incomeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetIncomes()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var incomes = await _incomeService.GetIncomesByUserIdAsync(userId);
        return Ok(incomes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetIncome(int id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var income = await _incomeService.GetIncomeByIdAsync(id, userId);
        if (income == null)
            return NotFound();

        return Ok(income);
    }

    [HttpPost]
    public async Task<IActionResult> CreateIncome([FromBody] CreateIncomeDto createDto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var income = await _incomeService.CreateIncomeAsync(createDto, userId);
            return CreatedAtAction(nameof(GetIncome), new { id = income.Id }, income);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateIncome(int id, [FromBody] CreateIncomeDto updateDto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var income = await _incomeService.UpdateIncomeAsync(id, updateDto, userId);
            return Ok(income);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteIncome(int id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _incomeService.DeleteIncomeAsync(id, userId);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
