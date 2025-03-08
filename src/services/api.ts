const BASE_URL = 'https://guilhermebranco.com.br/webhooks/api/v1';

export class ApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `token ${this.apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
    }

    return response.json();
  }

  async getRepositories() {
    return this.fetch<Repository[]>('/repositories/');
  }

  async getPullRequests(owner: string, repo: string) {
    return this.fetch<PullRequestsResponse>(`/repositories/${owner}/${repo}/pulls`);
  }

  async getEvents(owner: string, repo: string, pr: string) {
    return this.fetch<EventsResponse>(`/repositories/${owner}/${repo}/${pr}`);
  }
}

// Re-export types for convenience
export type { Repository, PullRequest, Event, EventsResponse, PullRequestsResponse } from '../types';