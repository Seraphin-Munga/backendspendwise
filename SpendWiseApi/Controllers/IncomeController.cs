using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpendWiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IncomeController : ControllerBase
{
    [HttpGet]
    public IActionResult GetIncomes() => Ok(new { message = "Not implemented" });

    [HttpPost]
    public IActionResult CreateIncome() => Ok(new { message = "Not implemented" });
}
