import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MermaidDiagram } from '../../../src/components/timeline/MermaidDiagram';
import type { Event } from '../../../src/types';

const { mockInitialize, mockRender } = vi.hoisted(() => ({
  mockInitialize: vi.fn().mockResolvedValue(undefined),
  mockRender: vi.fn().mockResolvedValue({ svg: '<svg>diagram</svg>' }),
}));

vi.mock('mermaid', () => ({
  default: {
    initialize: mockInitialize,
    render: mockRender,
  },
}));

function makeEvent(overrides: Partial<Event> & { payload: Event['payload'] }): Event {
  return {
    delivery_id: '1',
    type: 'issues',
    action: 'opened',
    date: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('MermaidDiagram', () => {
  beforeEach(() => {
    mockInitialize.mockClear().mockResolvedValue(undefined);
    mockRender.mockClear().mockResolvedValue({ svg: '<svg>diagram</svg>' });
  });

  it('renders collapsed by default without rendering the diagram', () => {
    const events = [makeEvent({ payload: { issue: { id: 1 } } })];

    const { container } = render(
      <MermaidDiagram events={events} isExpanded={false} onToggle={vi.fn()} />
    );

    expect(screen.getByText('Event Sequence')).toBeInTheDocument();
    expect(container.querySelector('svg.lucide-chevron-right')).toBeInTheDocument();
    expect(mockRender).not.toHaveBeenCalled();
  });

  it('calls onToggle when the header is clicked', () => {
    const onToggle = vi.fn();
    const events = [makeEvent({ payload: { issue: { id: 1 } } })];

    render(<MermaidDiagram events={events} isExpanded={false} onToggle={onToggle} />);

    fireEvent.click(screen.getByText('Event Sequence'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders the diagram svg once expanded with events', async () => {
    const events = [makeEvent({ payload: { issue: { id: 1 } } })];

    const { container } = render(
      <MermaidDiagram events={events} isExpanded={true} onToggle={vi.fn()} />
    );

    expect(container.querySelector('svg.lucide-chevron-down')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockRender).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(container.innerHTML).toContain('diagram');
    });
  });

  it('does not render when expanded with no events', async () => {
    const { container } = render(
      <MermaidDiagram events={[]} isExpanded={true} onToggle={vi.fn()} />
    );

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockRender).not.toHaveBeenCalled();
    expect(container.innerHTML).not.toContain('diagram');
  });

  it('shows a friendly error when mermaid rendering fails', async () => {
    mockRender.mockRejectedValue(new Error('render failed'));
    const events = [makeEvent({ payload: { issue: { id: 1 } } })];

    render(<MermaidDiagram events={events} isExpanded={true} onToggle={vi.fn()} />);

    await waitFor(() => {
      expect(
        screen.getByText('Error rendering diagram. Please try again later.')
      ).toBeInTheDocument();
    });
  });

  it('builds a sequence diagram covering event titles, statuses, and top actors', async () => {
    const events: Event[] = [
      makeEvent({
        delivery_id: 'a',
        type: 'issues',
        action: 'opened',
        payload: { issue: { id: 1, number: 1 }, sender: { login: 'alice-with-a-very-long-username', avatar_url: '' } },
      }),
      makeEvent({
        delivery_id: 'b',
        type: 'pull_request',
        action: 'opened',
        payload: { pull_request: { id: 2, number: 2 }, sender: { login: 'bob', avatar_url: '' } },
      }),
      makeEvent({
        delivery_id: 'c',
        type: 'check_run',
        action: 'completed',
        payload: {
          check_run: { id: 3, name: 'CI', conclusion: 'success' },
          sender: { login: 'carol', avatar_url: '' },
        },
      }),
      makeEvent({
        delivery_id: 'd',
        type: 'workflow_run',
        action: 'completed',
        payload: {
          workflow_run: { id: 4, name: 'Build', conclusion: 'failure' },
          sender: { login: 'dave', avatar_url: '' },
        },
      }),
      makeEvent({
        delivery_id: 'e',
        type: 'workflow_job',
        action: 'completed',
        payload: {
          workflow_job: { id: 5, name: 'Job1' },
          sender: { login: 'erin', avatar_url: '' },
        },
      }),
      makeEvent({
        delivery_id: 'f',
        type: 'release',
        action: 'published',
        payload: {
          release: { id: 6, tag_name: 'v1.0' },
          sender: { login: 'frank', avatar_url: '' },
        },
      }),
      makeEvent({
        delivery_id: 'g',
        type: 'status',
        action: '',
        payload: { status: { state: 'pending' } },
      }),
      makeEvent({
        delivery_id: 'h',
        type: 'check_suite',
        action: 'completed',
        payload: { check_suite: { conclusion: 'neutral' } },
      }),
      makeEvent({
        delivery_id: 'i',
        type: 'pull_request_review',
        action: 'submitted',
        payload: { review: { state: 'approved' } },
      }),
      makeEvent({
        delivery_id: 'j',
        type: 'pull_request_review_comment',
        action: 'created',
        payload: {},
      }),
    ];

    render(<MermaidDiagram events={events} isExpanded={true} onToggle={vi.fn()} />);

    await waitFor(() => {
      expect(mockRender).toHaveBeenCalledTimes(1);
    });

    const diagram = mockRender.mock.calls[0][1] as string;
    expect(diagram).toContain('Issue #1');
    expect(diagram).toContain('PR #2');
    expect(diagram).toContain('Check: CI');
    expect(diagram).toContain('Workflow: Build');
    expect(diagram).toContain('Job: Job1');
    expect(diagram).toContain('Release: v1.0');
    expect(diagram).toContain('Note right of PR: success');
    expect(diagram).toContain('Note right of PR: failure');
    expect(diagram).toContain('Note right of PR: pending');
    expect(diagram).toContain('Note right of PR: neutral');
    expect(diagram).toContain('Note right of PR: approved');
    expect(diagram).toContain('alice-with-a-ve...');
  });
});
