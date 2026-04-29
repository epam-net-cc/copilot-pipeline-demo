# GitHub Users API Explorer

A full-stack application for browsing GitHub users with cursor-based pagination:
- **.NET 10 Web API** proxy for the public GitHub Users API
- **React + TypeScript + Vite** frontend UI

## Overview

This project provides a strongly-typed, full-stack experience for exploring GitHub's public users API with interactive pagination and a responsive UI.

```
┌─────────────────────────────┐        ┌──────────────────────────────┐        ┌─────────────────┐
│  React Frontend             │        │  .NET Backend                │        │  GitHub API     │
│  localhost:5173             │        │  localhost:5191              │        │  api.github.com │
│                             │        │                              │        │                 │
│  App.tsx                    │        │  UsersController             │        │                 │
│    └─ UserList              │──GET──▶│    └─ IGitHubUsersService    │──GET──▶│  /users         │
│         (user cards)        │◀──JSON─│         GitHubUsersService   │◀──JSON─│                 │
│                             │        │                              │        │                 │
│  githubUsersApi.ts          │        │  GitHubUser model            │        │                 │
│  (fetch via Vite proxy)     │        │  GitHubApiResult<T>          │        │                 │
└─────────────────────────────┘        └──────────────────────────────┘        └─────────────────┘

  Dev: Vite proxies /users → http://localhost:5191
```

**Backend Features:**
- Proxy Endpoint: `GET /users` — List users with optional pagination
- Strongly Typed: All GitHub User objects deserialized into `GitHubUser` model
- Error Passthrough: HTTP status codes and error messages from GitHub forwarded verbatim
- Query Validation: `per_page` parameter automatically clamped to 1–100
- Cursor Pagination: `since` parameter for efficient pagination through users
- OpenAPI/Swagger: Interactive API documentation via Scalar UI

**Frontend Features:**
- Responsive React component-based UI
- Real-time pagination controls (Previous/Next)
- Customizable users per page (10, 20, 30, 50, 100)
- User cards with avatars, links to GitHub profiles
- Admin badge for site administrators
- Error handling and loading states
- TypeScript for type safety

## Tech Stack

### Backend
- **.NET 10** (latest)
- **ASP.NET Core** Web API
- **Microsoft.AspNetCore.OpenApi** — OpenAPI schema generation
- **Scalar.AspNetCore** — Beautiful API documentation UI

### Frontend
- **React 19** with TypeScript
- **Vite** (dev server with HMR)
- **CSS3** with responsive grid layout

## Project Structure

```
.
├── backend/
│   ├── Controllers/
│   │   └── UsersController.cs       # GET /users proxy endpoint
│   ├── Services/
│   │   ├── IGitHubUsersService.cs   # Service interface
│   │   └── GitHubUsersService.cs    # GitHub API client
│   ├── Models/
│   │   ├── GitHubUser.cs            # User model (strongly typed)
│   │   └── GitHubApiResult.cs       # Result wrapper (status + data/error)
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── Program.cs                    # DI & middleware configuration
│   ├── GitHubProxy.csproj
│   └── appsettings*.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserList.tsx         # User cards grid
│   │   │   ├── UserList.css
│   │   │   ├── Pagination.tsx       # Pagination controls
│   │   │   └── Pagination.css
│   │   ├── services/
│   │   │   └── githubUsersApi.ts    # API service (fetch wrapper)
│   │   ├── types/
│   │   │   └── GitHubUser.ts        # TypeScript interfaces
│   │   ├── App.tsx                  # Main app component
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── vite.config.ts               # Vite configuration
│   └── package.json
│
└── README.md
```

## Running Locally

### Prerequisites
- .NET 10 SDK installed
- Node.js 18+ and npm installed

### 1. Start the Backend

```bash
cd backend
dotnet run
```

Backend starts at:
- **HTTP**: `http://localhost:5191`
- **HTTPS**: `https://localhost:7200`
- **Scalar API Docs**: `https://localhost:7200/scalar/v1`
- **OpenAPI Schema**: `https://localhost:7200/openapi/v1.json`

Frontend starts at:
- **Dev Server**: `http://localhost:5173`

### 3. Open the Application

Once both servers are running, open your browser to:
```
http://localhost:5173
```

The frontend will automatically fetch users from the backend and display them in a responsive grid.

## API Endpoints

### List Users

```http
GET /users?since={id}&per_page={count}
```

**Query Parameters:**
- `since` (optional, int): Return users with ID greater than this value (for cursor-based pagination)
- `per_page` (optional, int): Number of results per page (1–100, defaults to 30)

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

## Building for Production

### Backend

```bash
cd backend
dotnet build -c Release
```

Output: `backend/bin/Release/net10.0/GitHubProxy.dll`

### Frontend

```bash
cd frontend
npm run build
```

Output: `frontend/dist/` (ready to serve as static files)

## Development Notes

- **CORS**: The frontend dev server calls the backend directly via `https://localhost:7200`. CORS headers are handled by the .NET backend as needed.
- **SSL/HTTPS**: Both frontend and backend use HTTPS with self-signed certificates during development (browser warnings are expected).
- **Type Safety**: Both frontend and backend use TypeScript/C# for full type safety across the API contract.
- **Hot Module Reload (HMR)**: Frontend dev server supports HMR for rapid development iteration.

## Configuration

### Backend
Edit `backend/appsettings.json` or `backend/appsettings.Development.json` to configure the API.

### Frontend
Edit `frontend/vite.config.ts` to modify the Vite dev server behavior or proxy configuration.

## License

MIT

