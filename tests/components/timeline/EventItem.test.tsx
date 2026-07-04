import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventItem } from '../../../src/components/timeline/EventItem';
import type { Event } from '../../../src/types';

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    delivery_id: '1',
    type: 'pull_request',
    action: 'opened',
    date: '2024-01-01T12:00:00Z',
    payload: {},
    ...overrides,
  };
}

describe('EventItem', () => {
  it('renders the event action and formatted date', () => {
    render(<EventItem event={makeEvent()} onViewPayload={vi.fn()} />);

    expect(screen.getByText('opened')).toBeInTheDocument();
  });

  it('renders the event id from the pull_request payload', () => {
    render(
      <EventItem
        event={makeEvent({ payload: { pull_request: { id: 55 } } })}
        onViewPayload={vi.fn()}
      />
    );

    expect(screen.getByText('#55')).toBeInTheDocument();
  });

  it('renders the sender avatar and login when present', () => {
    render(
      <EventItem
        event={makeEvent({
          payload: {
            sender: { login: 'octocat', avatar_url: 'https://example.com/a.png' },
          },
        })}
        onViewPayload={vi.fn()}
      />
    );

    expect(screen.getByText('octocat')).toBeInTheDocument();
    expect(screen.getByAltText("octocat's avatar")).toBeInTheDocument();
  });

  it('falls back to a placeholder icon when there is no avatar url', () => {
    render(
      <EventItem
        event={makeEvent({ payload: { sender: { login: 'octocat', avatar_url: '' } } })}
        onViewPayload={vi.fn()}
      />
    );

    expect(screen.queryByAltText("octocat's avatar")).not.toBeInTheDocument();
    expect(screen.getByText('octocat')).toBeInTheDocument();
  });

  it('shows a conclusion badge derived from check_run conclusion', () => {
    render(
      <EventItem
        event={makeEvent({
          payload: { check_run: { id: 1, conclusion: 'success' } },
        })}
        onViewPayload={vi.fn()}
      />
    );

    expect(screen.getByText('success')).toBeInTheDocument();
  });

  it('shows a status-derived badge when there is no conclusion yet', () => {
    render(
      <EventItem
        event={makeEvent({
          payload: { workflow_run: { id: 1, status: 'in_progress' } },
        })}
        onViewPayload={vi.fn()}
      />
    );

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('shows no badge when there is neither conclusion nor status', () => {
    render(<EventItem event={makeEvent()} onViewPayload={vi.fn()} />);

    expect(screen.queryByText(/Completed|In Progress|Queued|Waiting/)).not.toBeInTheDocument();
  });

  it('calls onViewPayload with the event payload when clicked', () => {
    const onViewPayload = vi.fn();
    const payload = { pull_request: { id: 1 } };
    render(<EventItem event={makeEvent({ payload })} onViewPayload={onViewPayload} />);

    fireEvent.click(screen.getByText('View Payload'));

    expect(onViewPayload).toHaveBeenCalledWith(payload);
  });

  it.each([
    ['comment', { comment: { id: 1 } }, '#1'],
    ['review', { review: { id: 2 } }, '#2'],
    ['check_suite', { check_suite: { id: 3 } }, '#3'],
    ['workflow_run', { workflow_run: { id: 4 } }, '#4'],
    ['workflow_job', { workflow_job: { id: 5 } }, '#5'],
    ['release', { release: { id: 6 } }, '#6'],
  ] as const)('derives the event id from %s payloads', (_label, payload, expected) => {
    render(<EventItem event={makeEvent({ payload })} onViewPayload={vi.fn()} />);

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it.each([
    ['queued', { check_run: { id: 1, status: 'queued' } }, 'Queued'],
    ['waiting', { workflow_job: { id: 1, status: 'waiting' } }, 'Waiting'],
    ['unknown status', { check_run: { id: 1, status: 'blocked' } }, 'blocked'],
  ] as const)('shows a status-derived badge for %s', (_label, payload, expected) => {
    render(<EventItem event={makeEvent({ payload })} onViewPayload={vi.fn()} />);

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it.each([
    ['failure', 'failure'],
    ['cancelled', 'cancelled'],
    ['skipped', 'skipped'],
    ['unknown', 'unknown-conclusion'],
  ] as const)('shows a conclusion badge for %s', (_label, conclusion) => {
    render(
      <EventItem
        event={makeEvent({ payload: { check_run: { id: 1, conclusion } } })}
        onViewPayload={vi.fn()}
      />
    );

    expect(screen.getByText(conclusion)).toBeInTheDocument();
  });
});
