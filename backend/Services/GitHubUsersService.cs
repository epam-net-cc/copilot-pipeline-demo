using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using GitHubProxy.Models;

namespace GitHubProxy.Services;

public sealed class GitHubUsersService : IGitHubUsersService
{
    private const string GitHubApiBase = "https://api.github.com";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;

    public GitHubUsersService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<GitHubApiResult<IReadOnlyList<GitHubUser>>> ListUsersAsync(
        int? since,
        int? perPage,
        CancellationToken cancellationToken = default)
    {
        var query = BuildQuery(since, perPage);
        var requestUri = $"{GitHubApiBase}/users{query}";

        using var response = await _httpClient.GetAsync(requestUri, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return new GitHubApiResult<IReadOnlyList<GitHubUser>>(
                response.StatusCode,
                null,
                content);
        }

        var users = JsonSerializer.Deserialize<List<GitHubUser>>(content, JsonOptions)
                    ?? [];

        return new GitHubApiResult<IReadOnlyList<GitHubUser>>(
            HttpStatusCode.OK,
            users,
            null);
    }

    public async Task<GitHubApiResult<GitHubUser>> GetUserAsync(
        string username,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"{GitHubApiBase}/users/{Uri.EscapeDataString(username)}";

        using var response = await _httpClient.GetAsync(requestUri, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return new GitHubApiResult<GitHubUser>(
                response.StatusCode,
                null,
                content);
        }

        var user = JsonSerializer.Deserialize<GitHubUser>(content, JsonOptions);

        return new GitHubApiResult<GitHubUser>(
            HttpStatusCode.OK,
            user,
            null);
    }

    private static string BuildQuery(int? since, int? perPage)
    {
        var parts = new List<string>();

        if (since.HasValue)
            parts.Add($"since={since.Value}");

        if (perPage.HasValue)
        {
            var clamped = Math.Clamp(perPage.Value, 1, 100);
            parts.Add($"per_page={clamped}");
        }

        return parts.Count > 0 ? "?" + string.Join("&", parts) : string.Empty;
    }
}
