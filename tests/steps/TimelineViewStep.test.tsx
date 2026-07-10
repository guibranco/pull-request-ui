import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TimelineViewStep } from '../../src/steps/TimelineViewStep';

vi.mock('../../src/components/timeline/MermaidDiagram', () => ({
  MermaidDiagram: ({
    isExpanded,
    onToggle,
  }: {
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <div>
      <span>MermaidStub:{isExpanded ? 'expanded' : 'collapsed'}</span>
      <button onClick={onToggle}>toggle-sequence</button>
    </div>
  ),
}));

vi.mock('../../src/components/timeline/EventList', () => ({
  EventList: ({
    isExpanded,
    onToggle,
    onViewPayload,
  }: {
    isExpanded: boolean;
    onToggle: () => void;
    onViewPayload: (payload: Record<string, unknown>) => void;
  }) => (
    <div>
      <span>EventListStub:{isExpanded ? 'expanded' : 'collapsed'}</span>
      <button onClick={onToggle}>toggle-timeline</button>
      <button onClick={() => onViewPayload({ foo: 'bar' })}>
        view-payload
      </button>
    </div>
  ),
}));

type MockResponse = {
  ok: boolean;
  status?: number;
  statusText?: string;
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
};

const event = {
  delivery_id: '1',
  type: 'issues',
  action: 'opened',
  date: '2024-01-02T00:00:00Z',
  payload: { issue: { id: 1 } },
};

const prInfo = {
  date: '2024-01-01T00:00:00Z',
  number: 5,
  title: 'My PR',
  state: 'OPEN' as const,
  sender: 'octocat',
  sender_avatar: '',
};

const localStorageMock = window.localStorage as unknown as {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
};

let eventsResponse: MockResponse;
let pullsResponse: MockResponse;

describe('TimelineViewStep', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);

    eventsResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          owner: 'owner',
          repo: 'repo',
          pull_request: 5,
          events: [event],
        }),
    };
    pullsResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          owner: 'owner',
          repo: 'repo',
          pull_requests: [prInfo],
        }),
    };

    global.fetch = vi.fn((url: string) => {
      if (/\/pulls\/\S+$/.test(url)) {
        return Promise.resolve(eventsResponse as Response);
      }
      if (/\/pulls$/.test(url)) {
        return Promise.resolve(pullsResponse as Response);
      }
      return Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve(''),
      } as Response);
    }) as unknown as typeof fetch;
  });

  it('shows a loading spinner before events arrive', () => {
    const { container } = render(
      <TimelineViewStep apiKey="key" repo="owner/repo" pr="5" onBack={vi.fn()} />
    );

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders the PR header and event components once loaded', async () => {
    render(
      <TimelineViewStep apiKey="key" repo="owner/repo" pr="5" onBack={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByText(/My PR/)).toBeInTheDocument();
    });

    expect(screen.getByText('owner')).toBeInTheDocument();
    expect(screen.getByText('repo')).toBeInTheDocument();
    expect(screen.getByText('octocat')).toBeInTheDocument();
    expect(screen.getByText('View on GitHub')).toBeInTheDocument();
    expect(screen.getByText('EventListStub:expanded')).toBeInTheDocument();
    expect(screen.getByText('MermaidStub:expanded')).toBeInTheDocument();
  });

  it('renders without PR info when the PR info fetch fails', async () => {
    pullsResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve(''),
    };

    render(
      <TimelineViewStep apiKey="key" repo="owner/repo" pr="5" onBack={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByText('EventListStub:expanded')).toBeInTheDocument();
    });

    expect(screen.queryByText(/My PR/)).not.toBeInTheDocument();
  });

  it('shows an error message and calls onBack when events fail to load', async () => {
    eventsResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('server exploded'),
    };
    const onBack = vi.fn();

    render(
      <TimelineViewStep apiKey="key" repo="owner/repo" pr="5" onBack={onBack} />
    );

    await waitFor(() => {
      expect(screen.getByText(/API Error: 500/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Go Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows a message when no events are found', async () => {
    eventsResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          owner: 'owner',
          repo: 'repo',
          pull_request: 5,
          events: [],
        }),
    };

    render(
      <TimelineViewStep apiKey="key" repo="owner/repo" pr="5" onBack={vi.fn()} />
    );

    await waitFor(() => {
      expect(
        screen.getByText('No events found for this pull request')
      ).toBeInTheDocument();
    });
  });

  it('restores collapsed sections from localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'isSequenceExpanded') return 'false';
      if (key === 'isTimelineExpanded') return 'false';
      return null;
    });

    render(
      <TimelineViewStep apiKey="key" repo="owner/repo" pr="5" onBack={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByText('MermaidStub:collapsed')).toBeInTheDocument();
    });
    expect(screen.getByText('EventListStub:collapsed')).toBeInTheDocument();
  });

  it('toggles the sequence and timeline sections and persists the choice', async () => {
    render(
      <TimelineViewStep apiKey="key" repo="owner/repo" pr="5" onBack={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByText('MermaidStub:expanded')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('toggle-sequence'));
    expect(screen.getByText('MermaidStub:collapsed')).toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'isSequenceExpanded',
      'false'
    );

    fireEvent.click(screen.getByText('toggle-timeline'));
    expect(screen.getByText('EventListStub:collapsed')).toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'isTimelineExpanded',
      'false'
    );
  });

  it('shows and closes the payload modal', async () => {
    render(
      <TimelineViewStep apiKey="key" repo="owner/repo" pr="5" onBack={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByText('view-payload')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('view-payload'));
    expect(screen.getByText('Event Payload')).toBeInTheDocument();

    const closeButton = document
      .querySelector('svg.lucide-x')
      ?.closest('button');
    fireEvent.click(closeButton!);

    expect(screen.queryByText('Event Payload')).not.toBeInTheDocument();
  });

  it('re-fetches events and PR info when refreshed', async () => {
    render(
      <TimelineViewStep apiKey="key" repo="owner/repo" pr="5" onBack={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByText(/My PR/)).toBeInTheDocument();
    });

    const callsBefore = (global.fetch as ReturnType<typeof vi.fn>).mock.calls
      .length;

    fireEvent.click(screen.getByText('Refresh Now'));

    await waitFor(() => {
      expect(
        (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length
      ).toBeGreaterThan(callsBefore);
    });
  });
});
