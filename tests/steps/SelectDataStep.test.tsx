import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SelectDataStep } from '../../src/steps/SelectDataStep';

vi.mock('../../src/components/select-data/RecentPullRequests', () => ({
  RecentPullRequests: ({
    pullRequests,
    loading,
    error,
    onSelect,
    onRetry,
  }: {
    pullRequests: unknown[];
    loading: boolean;
    error?: string | null;
    onSelect: (owner: string, repo: string, pr: string) => void;
    onRetry?: () => void;
  }) => (
    <div>
      <span>
        RecentPRs:{pullRequests.length}:{loading ? 'loading' : 'idle'}
      </span>
      {error && <span>RecentError:{error}</span>}
      <button onClick={() => onSelect('owner', 'repo', '7')}>
        select-recent
      </button>
      <button onClick={() => onRetry?.()}>retry-recent</button>
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

const repo = { id: 'a/b', owner: 'a', name: 'b', full_name: 'a/b' };
const pr = {
  date: '2024-01-01T00:00:00Z',
  number: 1,
  title: 'Test PR',
  state: 'OPEN' as const,
  sender: 'octocat',
  sender_avatar: '',
};

let reposResponse: MockResponse;
let pullsResponse: MockResponse;
let recentResponse: MockResponse;

describe('SelectDataStep', () => {
  beforeEach(() => {
    reposResponse = { ok: true, json: () => Promise.resolve([repo]) };
    pullsResponse = {
      ok: true,
      json: () =>
        Promise.resolve({ owner: 'a', repo: 'b', pull_requests: [pr] }),
    };
    recentResponse = { ok: true, json: () => Promise.resolve([]) };

    global.fetch = vi.fn((url: string) => {
      if (url.endsWith('/repositories/')) {
        return Promise.resolve(reposResponse as Response);
      }
      if (/\/pulls$/.test(url)) {
        return Promise.resolve(pullsResponse as Response);
      }
      if (url.endsWith('/recent')) {
        return Promise.resolve(recentResponse as Response);
      }
      return Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve(''),
      } as Response);
    }) as unknown as typeof fetch;

    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: {
        href: 'http://localhost:3000/',
        pathname: '/',
        hash: '',
        search: '',
        reload: vi.fn(),
      },
    });
  });

  it('fetches repositories and recent pull requests on mount', async () => {
    render(<SelectDataStep apiKey="key" onSelect={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('1 available')).toBeInTheDocument();
    });
    expect(screen.getByText('RecentPRs:0:idle')).toBeInTheDocument();
  });

  it('fetches pull requests when a repository is preselected', async () => {
    render(
      <SelectDataStep apiKey="key" onSelect={vi.fn()} preselectedRepo="a/b" />
    );

    await waitFor(() => {
      expect(screen.getAllByText('1 available')).toHaveLength(2);
    });
  });

  it('shows an error and offers reload retry when repositories fail to load', async () => {
    reposResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('boom'),
    };

    render(<SelectDataStep apiKey="key" onSelect={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/API Error: 500/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Retry'));
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('logs out and redirects with an error when the API key is rejected (403)', async () => {
    reposResponse = {
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      text: () => Promise.resolve(''),
    };

    render(<SelectDataStep apiKey="key" onSelect={vi.fn()} />);

    await waitFor(() => {
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('apiKey');
    });
    expect(window.location.href).toContain('error=');
  });

  it('shows an error when no pull requests are found for the repo', async () => {
    pullsResponse = {
      ok: true,
      json: () =>
        Promise.resolve({ owner: 'a', repo: 'b', pull_requests: [] }),
    };

    render(
      <SelectDataStep apiKey="key" onSelect={vi.fn()} preselectedRepo="a/b" />
    );

    await waitFor(() => {
      expect(
        screen.getByText('No pull requests found for this repository')
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Retry'));
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it('selects a recent pull request via the recent list', async () => {
    const onSelect = vi.fn();
    render(<SelectDataStep apiKey="key" onSelect={onSelect} />);

    fireEvent.click(await screen.findByText('select-recent'));

    expect(onSelect).toHaveBeenCalledWith('owner/repo', '7');
  });

  it('retries fetching recent pull requests', async () => {
    recentResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('recent failed'),
    };

    render(<SelectDataStep apiKey="key" onSelect={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/RecentError:/)).toBeInTheDocument();
    });

    recentResponse = { ok: true, json: () => Promise.resolve([]) };
    fireEvent.click(screen.getByText('retry-recent'));

    await waitFor(() => {
      expect(screen.queryByText(/RecentError:/)).not.toBeInTheDocument();
    });
  });

  it('navigates back to the API key step', async () => {
    render(<SelectDataStep apiKey="key" onSelect={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('1 available')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Back to API Key'));

    expect(window.location.hash).toBe('#/api-key');
  });

  it('re-fetches everything when the refresh button is pressed', async () => {
    render(<SelectDataStep apiKey="key" onSelect={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('1 available')).toBeInTheDocument();
    });

    const fetchCallsBefore = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls.length;

    fireEvent.click(screen.getByText('Refresh Now'));

    await waitFor(() => {
      expect(
        (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length
      ).toBeGreaterThan(fetchCallsBefore);
    });
  });

  it('selects a repository and updates the hash', async () => {
    render(<SelectDataStep apiKey="key" onSelect={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Select a repository…')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Select a repository…'));
    fireEvent.click(screen.getByRole('option'));

    expect(window.location.hash).toBe('a/b');
  });
});
