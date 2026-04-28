using GitHubProxy.Models;

namespace GitHubProxy.Services;

public interface IGitHubUsersService
{
    Task<GitHubApiResult<IReadOnlyList<GitHubUser>>> ListUsersAsync(
        int? since,
        int? perPage,
        CancellationToken cancellationToken = default);
}
