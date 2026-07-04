import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventTimeline } from '../../../src/components/timeline/EventTimeline';
import type { Event } from '../../../src/types';

function makeEvent(overrides: Partial<Event> & { payload: Event['payload'] }): Event {
  return {
    delivery_id: '1',
    type: 'pull_request',
    action: 'opened',
    date: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('EventTimeline', () => {
  it('renders nothing when no payload id group has more than one event', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { issue: { id: 1 } } }),
      makeEvent({ delivery_id: 'b', payload: { pull_request: { id: 2 } } }),
    ];

    const { container } = render(
      <EventTimeline events={events} onViewPayload={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders a group title and count when a sequence has multiple events', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { pull_request: { id: 5, number: 5 } } }),
      makeEvent({ delivery_id: 'b', payload: { pull_request: { id: 5, number: 5 } } }),
    ];

    render(<EventTimeline events={events} onViewPayload={vi.fn()} />);

    expect(screen.getByText('PR #5')).toBeInTheDocument();
    expect(screen.getByText('1 group')).toBeInTheDocument();
  });

  it('toggles expansion and persists the preference', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { issue: { id: 1, number: 1 } } }),
      makeEvent({ delivery_id: 'b', payload: { issue: { id: 1, number: 1 } } }),
    ];

    render(<EventTimeline events={events} onViewPayload={vi.fn()} />);

    expect(screen.getByText('Issue #1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Event Sequences'));

    expect(screen.queryByText('Issue #1')).not.toBeInTheDocument();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'isBulletDiagramExpanded',
      'false'
    );
  });

  it.each([
    ['comment', { comment: { id: 1 } }, 'Comment Thread'],
    ['review', { review: { id: 1 } }, 'Review Thread'],
    ['check_run', { check_run: { id: 1, name: 'lint' } }, 'Check: lint'],
    ['check_suite', { check_suite: { id: 1 } }, 'Check Suite'],
    [
      'workflow_run',
      { workflow_run: { id: 1, name: 'CI' } },
      'Workflow: CI',
    ],
    [
      'workflow_job',
      { workflow_job: { id: 1, name: 'build' } },
      'Job: build',
    ],
    [
      'release',
      { release: { id: 1, name: 'v1.0' } },
      'Release: v1.0',
    ],
  ] as const)(
    'derives the group title for %s payloads',
    (_label, payload, expectedTitle) => {
      const events = [
        makeEvent({ delivery_id: 'a', payload }),
        makeEvent({ delivery_id: 'b', payload }),
      ];

      render(<EventTimeline events={events} onViewPayload={vi.fn()} />);

      expect(screen.getByText(expectedTitle)).toBeInTheDocument();
    }
  );

  it('falls back to "Unknown" when workflow/release names are missing', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { workflow_job: { id: 1 } } }),
      makeEvent({ delivery_id: 'b', payload: { workflow_job: { id: 1 } } }),
    ];

    render(<EventTimeline events={events} onViewPayload={vi.fn()} />);

    expect(screen.getByText('Job: Unknown')).toBeInTheDocument();
  });
});
