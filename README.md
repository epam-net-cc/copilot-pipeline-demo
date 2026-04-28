# GitHub Users API Proxy

A .NET 10 Web API proxy for the public GitHub Users API.

## Overview

This project provides a simple, strongly-typed proxy to the public GitHub Users API (`https://api.github.com/users`), enabling client applications to list GitHub users with cursor-based pagination support.

## Features

- **Proxy Endpoint**: `GET /users` — List users with optional pagination
- **Strongly Typed**: All GitHub User objects deserialized into `GitHubUser` model
- **Error Passthrough**: HTTP status codes and error messages from GitHub forwarded verbatim
- **Query Validation**: `per_page` parameter automatically clamped to 1–100 (GitHub's allowed range)
- **Cursor Pagination**: `since` parameter for efficient pagination through large result sets
- **OpenAPI/Swagger**: Interactive API documentation via Scalar UI

## Tech Stack

- **.NET 10** (latest)
- **ASP.NET Core** Web API
- **Microsoft.AspNetCore.OpenApi** — OpenAPI schema generation
- **Scalar.AspNetCore** — Beautiful API documentation UI

## Project Structure

```
backend/
├── Controllers/
│   └── UsersController.cs       # GET /users proxy endpoint
├── Services/
│   ├── IGitHubUsersService.cs   # Service interface
│   └── GitHubUsersService.cs    # GitHub API client
├── Models/
│   ├── GitHubUser.cs            # User model (strongly typed)
│   └── GitHubApiResult.cs       # Result wrapper (status + data/error)
├── Properties/
│   └── launchSettings.json
├── Program.cs                    # DI & middleware configuration
├── GitHubProxy.csproj
├── appsettings.json
└── appsettings.Development.json
```

## Running Locally

### Prerequisites
- .NET 10 SDK installed

### Start the API

```bash
cd backend
dotnet run
```

Server starts at:
- **HTTP**: `http://localhost:5191`
- **HTTPS**: `https://localhost:7200`

### Access API Documentation

Open your browser:
```
https://localhost:7200/scalar/v1
```

## API Endpoints

### List Users

```http
GET /users?since={id}&per_page={count}
```

**Query Parameters:**
- `since` (optional, int): Return users with ID greater than this value (for pagination)
- `per_page` (optional, int): Number of results per page (1–100, defaults to GitHub's default of 30)

**Response:** `200 OK` with array of `GitHubUser` objects

**Examples:**

```bash
# Get first 30 users
curl -k https://localhost:7200/users

# Get 10 users starting after ID 46
curl -k "https://localhost:7200/users?since=46&per_page=10"

# Get 5 users starting after ID 0
curl -k "https://localhost:7200/users?since=0&per_page=5"
```

## Error Handling

GitHub API errors are passed through with their original status code and response body:

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 403 | Rate limit exceeded (unauthenticated requests: 60/hour) |
| 404 | Not found |
| 422 | Validation error |
| 429 | Rate limit exceeded |
| 5xx | GitHub server error |

Example error response:
```json
{
  "message": "API rate limit exceeded for ...",
  "documentation_url": "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting"
}
```

## GitHub API Reference

- Docs: https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#list-users
- Base URL: `https://api.github.com`
- Rate Limit (unauthenticated): 60 requests/hour
- Rate Limit (authenticated): 5,000 requests/hour

## Build

```bash
cd backend
dotnet build
```

Successful build output:
```
GitHubProxy net10.0 succeeded → bin\Debug\net10.0\GitHubProxy.dll
```

## Configuration

Edit `backend/appsettings.json` or `backend/appsettings.Development.json` to configure the API (currently minimal configuration needed).

## License

MIT
