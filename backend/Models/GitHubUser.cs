using System.Text.Json.Serialization;

namespace GitHubProxy.Models;

public sealed class GitHubUser
{
    [JsonPropertyName("login")]
    public string Login { get; init; } = string.Empty;

    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("node_id")]
    public string NodeId { get; init; } = string.Empty;

    [JsonPropertyName("avatar_url")]
    public string AvatarUrl { get; init; } = string.Empty;

    [JsonPropertyName("gravatar_id")]
    public string GravatarId { get; init; } = string.Empty;

    [JsonPropertyName("url")]
    public string Url { get; init; } = string.Empty;

    [JsonPropertyName("html_url")]
    public string HtmlUrl { get; init; } = string.Empty;

    [JsonPropertyName("followers_url")]
    public string FollowersUrl { get; init; } = string.Empty;

    [JsonPropertyName("following_url")]
    public string FollowingUrl { get; init; } = string.Empty;

    [JsonPropertyName("gists_url")]
    public string GistsUrl { get; init; } = string.Empty;

    [JsonPropertyName("starred_url")]
    public string StarredUrl { get; init; } = string.Empty;

    [JsonPropertyName("subscriptions_url")]
    public string SubscriptionsUrl { get; init; } = string.Empty;

    [JsonPropertyName("organizations_url")]
    public string OrganizationsUrl { get; init; } = string.Empty;

    [JsonPropertyName("repos_url")]
    public string ReposUrl { get; init; } = string.Empty;

    [JsonPropertyName("events_url")]
    public string EventsUrl { get; init; } = string.Empty;

    [JsonPropertyName("received_events_url")]
    public string ReceivedEventsUrl { get; init; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; init; } = string.Empty;

    [JsonPropertyName("site_admin")]
    public bool SiteAdmin { get; init; }

    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("company")]
    public string Company { get; init; } = string.Empty;

    [JsonPropertyName("blog")]
    public string Blog { get; init; } = string.Empty;

    [JsonPropertyName("location")]
    public string Location { get; init; } = string.Empty;

    [JsonPropertyName("bio")]
    public string Bio { get; init; } = string.Empty;

    [JsonPropertyName("public_repos")]
    public int PublicRepos { get; init; }

    [JsonPropertyName("followers")]
    public int Followers { get; init; }

    [JsonPropertyName("following")]
    public int Following { get; init; }

    [JsonPropertyName("created_at")]
    public string CreatedAt { get; init; } = string.Empty;
}
