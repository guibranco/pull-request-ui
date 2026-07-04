import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BulletDiagram } from '../../../src/components/timeline/BulletDiagram';
import type { Event } from '../../../src/types';

function makeEvent(overrides: Partial<Event> & { payload: Event['payload'] }): Event {
  return {
    delivery_id: '1',
    type: 'issues',
    action: 'opened',
    date: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('BulletDiagram', () => {
  it('renders a label for each event derived from its payload type', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { issue: { id: 1 } } }),
    ];

    render(<BulletDiagram events={events} onViewPayload={vi.fn()} />);

    expect(screen.getByText('Issue opened')).toBeInTheDocument();
  });

  it('renders the sender avatar and app name when present', () => {
    const events = [
      makeEvent({
        delivery_id: 'a',
        type: 'check_run',
        payload: {
          check_run: { id: 1, app: { id: 99, name: 'CI Bot' } },
          sender: { login: 'octocat', avatar_url: 'https://example.com/a.png' },
        },
      }),
    ];

    render(<BulletDiagram events={events} onViewPayload={vi.fn()} />);

    expect(screen.getByText('CI Bot')).toBeInTheDocument();
    expect(screen.getByText('octocat')).toBeInTheDocument();
  });

  it('calls onViewPayload with the event payload when a bullet is clicked', () => {
    const onViewPayload = vi.fn();
    const payload = { issue: { id: 1 } };
    const events = [makeEvent({ delivery_id: 'a', payload })];

    render(<BulletDiagram events={events} onViewPayload={onViewPayload} />);

    fireEvent.click(screen.getByTitle('View event payload'));

    expect(onViewPayload).toHaveBeenCalledWith(payload);
  });

  it('renders events in chronological order', () => {
    const events = [
      makeEvent({ delivery_id: 'a', date: '2024-01-02T00:00:00Z', payload: { issue: { id: 1 } } }),
      makeEvent({ delivery_id: 'b', date: '2024-01-01T00:00:00Z', payload: { pull_request: { id: 1 } } }),
    ];

    render(<BulletDiagram events={events} onViewPayload={vi.fn()} />);

    const labels = screen.getAllByText(/opened/);
    expect(labels[0]).toHaveTextContent('PR opened');
    expect(labels[1]).toHaveTextContent('Issue opened');
  });

  it('shows a placeholder icon when app data has no id', () => {
    const events = [
      makeEvent({
        delivery_id: 'a',
        type: 'check_run',
        payload: { check_run: { id: 1, app: { name: 'CI Bot' } } },
      }),
    ];

    render(<BulletDiagram events={events} onViewPayload={vi.fn()} />);

    expect(screen.getByText('CI Bot')).toBeInTheDocument();
    expect(screen.queryByAltText("CI Bot's avatar")).not.toBeInTheDocument();
  });

  it('shows a placeholder icon when the sender has no avatar_url', () => {
    const events = [
      makeEvent({
        delivery_id: 'a',
        payload: { issue: { id: 1 }, sender: { login: 'octocat', avatar_url: '' } },
      }),
    ];

    render(<BulletDiagram events={events} onViewPayload={vi.fn()} />);

    expect(screen.getByText('octocat')).toBeInTheDocument();
    expect(screen.queryByAltText("octocat's avatar")).not.toBeInTheDocument();
  });

  it.each([
    ['queued status', { workflow_run: { id: 1, status: 'queued' } }, 'bg-green-400'],
    ['waiting status', { workflow_run: { id: 1, status: 'waiting' } }, 'bg-purple-400'],
  ] as const)('colors the bullet for %s', (_label, payload, expectedClass) => {
    const events = [makeEvent({ delivery_id: 'a', payload })];

    const { container } = render(
      <BulletDiagram events={events} onViewPayload={vi.fn()} />
    );

    expect(container.querySelector(`.${expectedClass}`)).toBeInTheDocument();
  });

  it.each([
    ['published', 'bg-green-400'],
    ['unpublished', 'bg-red-400'],
    ['edited', 'bg-yellow-400'],
    ['prereleased', 'bg-purple-400'],
  ] as const)('colors release bullets for the %s action', (action, expectedClass) => {
    const events = [
      makeEvent({
        delivery_id: 'a',
        type: 'release',
        action,
        payload: { release: { id: 1 } },
      }),
    ];

    const { container } = render(
      <BulletDiagram events={events} onViewPayload={vi.fn()} />
    );

    expect(container.querySelector(`.${expectedClass}`)).toBeInTheDocument();
  });
});
