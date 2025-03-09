const BASE_URL = 'https://guilhermebranco.com.br/webhooks/api/v1';

export class ApiService {
  private readonly apiKey: string;

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

    const data = await response.json();
    return this.validateResponse<T>(data);
  }

  private validateResponse<T>(data: unknown): T {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format: response must be an object');
    }

    if (this.isRepositoryArray(data)) {
      return data as T;
    }

    if (this.isPullRequestsResponse(data)) {
      if (!Array.isArray(data.pull_requests)) {
        throw new Error('Invalid response format: pull_requests must be an array');
      }
      return data as T;
    }

    if (this.isEventsResponse(data)) {
      if (!Array.isArray(data.events)) {
        throw new Error('Invalid response format: events must be an array');
      }
      return data as T;
    }

    throw new Error('Invalid response format: unknown response type');
  }

  private isRepositoryArray(data: unknown): boolean {
    return Array.isArray(data) && data.every(item => 
      item && typeof item === 'object' &&
      'id' in item && typeof item.id === 'string' &&
      'owner' in item && typeof item.owner === 'string' &&
      'name' in item && typeof item.name === 'string' &&
      'full_name' in item && typeof item.full_name === 'string'
    );
  }

  private isPullRequestsResponse(data: unknown): boolean {
    return data && typeof data === 'object' &&
      'owner' in data && typeof data.owner === 'string' &&
      'repo' in data && typeof data.repo === 'string' &&
      'pull_requests' in data;
  }

  private isEventsResponse(data: unknown): boolean {
    return data && typeof data === 'object' &&
      'owner' in data && typeof data.owner === 'string' &&
      'repo' in data && typeof data.repo === 'string' &&
      'pull_request' in data && typeof data.pull_request === 'number' &&
      'events' in data;
  }

  async getRepositories() {
    return this.fetch<Repository[]>('/repositories/');
  }

  async getPullRequests(owner: string, repo: string) {
    return this.fetch<PullRequestsResponse>(`/repositories/${owner}/${repo}/pulls`);
  }

  async getEvents(owner: string, repo: string, pr: string) {
    return this.fetch<EventsResponse>(`/repositories/${owner}/${repo}/pulls/${pr}`);
  }
}

// Re-export types for convenience
export type { Repository, PullRequest, Event, EventsResponse, PullRequestsResponse } from '../types';