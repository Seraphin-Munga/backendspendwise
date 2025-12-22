using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpendWiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GroupController : ControllerBase
{
    [HttpGet]
    public IActionResult GetGroups() => Ok(new { message = "Not implemented" });

    [HttpPost]
    public IActionResult CreateGroup() => Ok(new { message = "Not implemented" });
}
