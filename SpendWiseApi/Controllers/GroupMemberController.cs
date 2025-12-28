using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpendWiseApi.Service.DTOs;
using SpendWiseApi.Service.Interfaces;

namespace SpendWiseApi.Controllers;

[ApiController]
[Route("api/group/{groupId}/members")]
[Authorize]
public class GroupMemberController : ControllerBase
{
    private readonly IGroupMemberService _groupMemberService;

    public GroupMemberController(IGroupMemberService groupMemberService)
    {
        _groupMemberService = groupMemberService;
    }

    [HttpGet]
    public async Task<IActionResult> GetGroupMembers(int groupId)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var members = await _groupMemberService.GetGroupMembersByGroupIdAsync(groupId, userId);
            return Ok(members);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{memberId}")]
    public async Task<IActionResult> GetGroupMember(int groupId, int memberId)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var member = await _groupMemberService.GetGroupMemberByIdAsync(memberId, userId);
            if (member == null)
                return NotFound();

            return Ok(member);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddMember(int groupId, [FromBody] CreateGroupMemberDto createDto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var member = await _groupMemberService.AddMemberToGroupAsync(groupId, createDto, userId);
            return CreatedAtAction(nameof(GetGroupMember), new { groupId, memberId = member.Id }, member);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{memberUserId}")]
    public async Task<IActionResult> RemoveMember(int groupId, string memberUserId)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var result = await _groupMemberService.RemoveMemberFromGroupAsync(groupId, memberUserId, userId);
            if (!result)
                return NotFound();

            return Ok(new { message = "Member removed successfully" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{memberUserId}/role")]
    public async Task<IActionResult> UpdateMemberRole(int groupId, string memberUserId, [FromBody] UpdateMemberRoleDto updateDto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var member = await _groupMemberService.UpdateMemberRoleAsync(groupId, memberUserId, updateDto.Role, userId);
            return Ok(member);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public class UpdateMemberRoleDto
{
    public string Role { get; set; } = string.Empty; // Admin, Member, or Child
}

