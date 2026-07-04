import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventList } from '../../../src/components/timeline/EventList';
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

describe('EventList', () => {
  it('renders a summary of event and type counts', () => {
    const events = [
      makeEvent({ delivery_id: 'a', type: 'pull_request', payload: {} }),
      makeEvent({ delivery_id: 'b', type: 'issues', payload: {} }),
    ];

    render(
      <EventList
        events={events}
        expandedItems={new Set()}
        onToggleExpand={vi.fn()}
        isExpanded={false}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('2 events')).toBeInTheDocument();
    expect(screen.getByText('2 types')).toBeInTheDocument();
  });

  it('does not show event type groups when collapsed', () => {
    const events = [makeEvent({ delivery_id: 'a', payload: {} })];

    render(
      <EventList
        events={events}
        expandedItems={new Set()}
        onToggleExpand={vi.fn()}
        isExpanded={false}
        onToggle={vi.fn()}
      />
    );

    expect(screen.queryByText('pull_request')).not.toBeInTheDocument();
  });

  it('calls onToggle when the header is clicked', () => {
    const onToggle = vi.fn();
    const events = [makeEvent({ delivery_id: 'a', payload: {} })];

    render(
      <EventList
        events={events}
        expandedItems={new Set()}
        onToggleExpand={vi.fn()}
        isExpanded={false}
        onToggle={onToggle}
      />
    );

    fireEvent.click(screen.getByText('Event Timeline'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('lists type groups sorted alphabetically when expanded', () => {
    const events = [
      makeEvent({ delivery_id: 'a', type: 'pull_request', payload: {} }),
      makeEvent({ delivery_id: 'b', type: 'issues', payload: {} }),
    ];

    render(
      <EventList
        events={events}
        expandedItems={new Set()}
        onToggleExpand={vi.fn()}
        isExpanded={true}
        onToggle={vi.fn()}
      />
    );

    const typeLabels = screen.getAllByText(/issues|pull_request/);
    expect(typeLabels[0]).toHaveTextContent('issues');
    expect(typeLabels[1]).toHaveTextContent('pull_request');
  });

  it('calls onToggleExpand with the event type when a group header is clicked', () => {
    const onToggleExpand = vi.fn();
    const events = [makeEvent({ delivery_id: 'a', type: 'issues', payload: {} })];

    render(
      <EventList
        events={events}
        expandedItems={new Set()}
        onToggleExpand={onToggleExpand}
        isExpanded={true}
        onToggle={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('issues'));

    expect(onToggleExpand).toHaveBeenCalledWith('issues');
  });

  it('shows individual events once a type group is expanded', () => {
    const events = [
      makeEvent({ delivery_id: 'a', type: 'issues', action: 'opened', payload: {} }),
    ];

    render(
      <EventList
        events={events}
        expandedItems={new Set(['issues'])}
        onToggleExpand={vi.fn()}
        isExpanded={true}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('View Payload')).toBeInTheDocument();
  });

  it('opens the payload modal when View Payload is clicked', () => {
    const events = [
      makeEvent({ delivery_id: 'a', type: 'issues', payload: { issue: { id: 1 } } }),
    ];

    render(
      <EventList
        events={events}
        expandedItems={new Set(['issues'])}
        onToggleExpand={vi.fn()}
        isExpanded={true}
        onToggle={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('View Payload'));

    expect(screen.getByText('Event Payload')).toBeInTheDocument();
  });

  it('automatically shows the compare modal once two events are selected', () => {
    const events = [
      makeEvent({ delivery_id: 'a', type: 'issues', payload: { issue: { id: 1 } } }),
      makeEvent({ delivery_id: 'b', type: 'issues', action: 'closed', payload: { issue: { id: 1 } } }),
    ];

    render(
      <EventList
        events={events}
        expandedItems={new Set(['issues'])}
        onToggleExpand={vi.fn()}
        isExpanded={true}
        onToggle={vi.fn()}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    expect(screen.getByText('Compare Payloads')).toBeInTheDocument();
  });

  it('closes the payload modal via onClose', () => {
    const events = [
      makeEvent({ delivery_id: 'a', type: 'issues', payload: { issue: { id: 1 } } }),
    ];

    const { container } = render(
      <EventList
        events={events}
        expandedItems={new Set(['issues'])}
        onToggleExpand={vi.fn()}
        isExpanded={true}
        onToggle={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('View Payload'));
    expect(screen.getByText('Event Payload')).toBeInTheDocument();

    const closeButton = container.querySelector('svg.lucide-x')?.closest('button');
    fireEvent.click(closeButton!);

    expect(screen.queryByText('Event Payload')).not.toBeInTheDocument();
  });
});
