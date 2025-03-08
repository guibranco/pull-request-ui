export interface Repository {
  id: number;
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
  payload: any;
}

export interface EventsResponse {
  owner: string;
  repo: string;
  pull_request: number;
  events: Event[];
}