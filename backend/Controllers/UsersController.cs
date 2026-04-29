using GitHubProxy.Services;
using Microsoft.AspNetCore.Mvc;

namespace GitHubProxy.Controllers;

[ApiController]
[Route("[controller]")]
public sealed class UsersController : ControllerBase
{
    private readonly IGitHubUsersService _gitHubUsersService;

    public UsersController(IGitHubUsersService gitHubUsersService)
    {
        _gitHubUsersService = gitHubUsersService;
    }

    /// <summary>
    /// Lists GitHub users, proxied from the public GitHub Users API.
    /// </summary>
    /// <param name="since">Only show users with an ID greater than this value. Used for pagination.</param>
    /// <param name="perPage">Number of results per page (1–100). Defaults to GitHub's default (30).</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<GitHubProxy.Models.GitHubUser>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int? since,
        [FromQuery(Name = "per_page")] int? perPage,
        CancellationToken cancellationToken)
    {
        var result = await _gitHubUsersService.ListUsersAsync(since, perPage, cancellationToken);

        if (result.IsSuccess)
            return Ok(result.Data);

        return StatusCode((int)result.StatusCode, result.ErrorContent);
    }

    [HttpGet("{username}")]
    [ProducesResponseType(typeof(GitHubProxy.Models.GitHubUser), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> GetUser(string username, CancellationToken cancellationToken)
    {
        var result = await _gitHubUsersService.GetUserAsync(username, cancellationToken);

        if (result.IsSuccess)
            return Ok(result.Data);

        return StatusCode((int)result.StatusCode, result.ErrorContent);
    }
}
