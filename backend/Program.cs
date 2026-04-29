using System.Net.Http.Headers;
using GitHubProxy.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

string? gitHubToken = builder.Configuration["GitHub:PatToken"];

builder.Services.AddHttpClient<IGitHubUsersService, GitHubUsersService>(client =>
{
    client.DefaultRequestHeaders.UserAgent.ParseAdd("GitHubProxy/1.0");
    client.DefaultRequestHeaders.Accept.ParseAdd("application/vnd.github+json");
    client.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2022-11-28");

    if (!string.IsNullOrWhiteSpace(gitHubToken))
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", gitHubToken);
    }
});

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference();

app.UseHttpsRedirection();
app.UseCors("frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
