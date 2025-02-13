interface TimelineEventProps {
  events: TimelineEvent[];
}

interface TimelineEventRowProps {
  event: TimelineEvent;
}

interface TimelineEvent {
  delivery_id: string;
  type: string;
  action: string;
  date: string;
  payload: EventPayload;
}

interface EventPayload {
  name: string;
  check_suite: CheckSuite|null;
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