using Microsoft.AspNetCore.Mvc;

namespace SpendWiseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EducationalContentController : ControllerBase
{
    [HttpGet]
    public IActionResult GetContent() => Ok(new { message = "Not implemented" });
}
