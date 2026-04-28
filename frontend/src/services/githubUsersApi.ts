import type { GitHubUser } from '../types/GitHubUser';

// Use relative path that gets proxied by Vite during dev
// or use full URL during production build
const API_BASE_URL = import.meta.env.PROD ? 'http://localhost:5191' : '';

export interface ListUsersParams {
  since?: number;
  perPage?: number;
}

export interface ListUsersResponse {
  users: GitHubUser[];
  error?: string;
}

export const githubUsersApi = {
  async listUsers(params: ListUsersParams = {}): Promise<ListUsersResponse> {
    try {
      const query = new URLSearchParams();
      
      if (params.since !== undefined) {
        query.append('since', params.since.toString());
      }
      
      if (params.perPage !== undefined) {
        query.append('per_page', params.perPage.toString());
      }

      const url = `${API_BASE_URL}/users${query.toString() ? '?' + query.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          users: [],
          error: `Error ${response.status}: ${errorText}`,
        };
      }

      const users: GitHubUser[] = await response.json();
      return { users };
    } catch (error) {
      return {
        users: [],
        error: `Failed to fetch users: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },
};
