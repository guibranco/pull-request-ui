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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
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