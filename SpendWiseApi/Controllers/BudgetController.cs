using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpendWiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BudgetController : ControllerBase
{
    [HttpGet]
    public IActionResult GetBudgets() => Ok(new { message = "Not implemented" });

    [HttpPost]
    public IActionResult CreateBudget() => Ok(new { message = "Not implemented" });
}
