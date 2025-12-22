using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpendWiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SharedExpenseController : ControllerBase
{
    [HttpGet]
    public IActionResult GetSharedExpenses() => Ok(new { message = "Not implemented" });

    [HttpPost]
    public IActionResult CreateSharedExpense() => Ok(new { message = "Not implemented" });
}
