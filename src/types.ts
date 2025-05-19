export interface Repository {
  id: string;
  owner: string;
  name: string;
  full_name: string;
}

export interface PullRequest {
  date: string;
  number: number;
  title: string;
  state: 'OPEN' | 'CLOSED';
}

export interface RecentPullRequest {
  date: string;
  owner: string;
  name: string;
  number: number;
  title: string;
  sender: string;
  sender_avatar: string;
  state: 'OPEN' | 'CLOSED';
}

export interface AppData {
  id: number;
  name: string;
  description?: string;
  html_url?: string;
}

export interface Event {
  delivery_id: string;
  type: string;
  action: string;
  date: string;
  payload: {
    sender?: {
      login: string;
      avatar_url: string;
    };
    app?: AppData;
    [key: string]: Record<string, unknown> | undefined;
  };
}

export interface EventsResponse {
  owner: string;
  repo: string;
  pull_request: number;
  events: Event[];
}

export interface PullRequestsResponse {
  owner: string;
  repo: string;
  pull_requests: PullRequest[];
}