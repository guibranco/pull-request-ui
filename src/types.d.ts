 interface GitHubEvent {
  id: string;
  type: string;
  action: string;
  date: string;
  payload: Record<string, unknown>;
}

interface TimelineEvent {
  type: string;
  action: string;
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  payload: EventPayload;
}

interface EventPayload {
  name: string;
  check_suite: CheckSuite|null;
}

interface TimelineProps {
  events: TimelineEvent[];
}

interface TimelineEventRowProps {
  event: TimelineEvent;
}

interface Repository {
  id: number;
  name: string;
  owner: string;
  full_name: string;
}

interface PullRequest {
  id: number;
  title: string;
  number: number;
  state: string;
}

interface CheckSuite {
  id: number;
}