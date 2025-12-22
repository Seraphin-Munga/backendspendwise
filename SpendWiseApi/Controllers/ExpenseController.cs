using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpendWiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpenseController : ControllerBase
{
    [HttpGet]
    public IActionResult GetExpenses() => Ok(new { message = "Not implemented" });

    [HttpPost]
    public IActionResult CreateExpense() => Ok(new { message = "Not implemented" });
}
