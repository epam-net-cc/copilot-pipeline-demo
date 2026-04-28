using System.Net;

namespace GitHubProxy.Models;

public sealed record GitHubApiResult<T>(
    HttpStatusCode StatusCode,
    T? Data,
    string? ErrorContent)
{
    public bool IsSuccess => (int)StatusCode >= 200 && (int)StatusCode < 300;
}
