import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RecentPullRequests } from '../../../src/components/select-data/RecentPullRequests';
import type { RecentPullRequest } from '../../../src/types';

const pullRequests: RecentPullRequest[] = [
  {
    date: '2024-01-01T00:00:00Z',
    owner: 'acme',
    name: 'widgets',
    number: 1,
    title: 'Open PR',
    sender: 'alice',
    sender_avatar: 'https://example.com/alice.png',
    state: 'OPEN',
  },
  {
    date: '2024-01-02T00:00:00Z',
    owner: 'acme',
    name: 'gadgets',
    number: 2,
    title: 'Closed PR',
    sender: 'bob',
    sender_avatar: '',
    state: 'CLOSED',
  },
];

describe('RecentPullRequests', () => {
  it('shows a loading skeleton while loading with no data yet', () => {
    const { container } = render(
      <RecentPullRequests pullRequests={[]} onSelect={vi.fn()} loading={true} />
    );

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows only open PRs by default', () => {
    render(
      <RecentPullRequests
        pullRequests={pullRequests}
        onSelect={vi.fn()}
        loading={false}
      />
    );

    expect(screen.getByText('Open PR')).toBeInTheDocument();
    expect(screen.queryByText('Closed PR')).not.toBeInTheDocument();
    expect(screen.getByText('1 PR')).toBeInTheDocument();
  });

  it('toggles to show all PRs when the switch is clicked', () => {
    render(
      <RecentPullRequests
        pullRequests={pullRequests}
        onSelect={vi.fn()}
        loading={false}
      />
    );

    fireEvent.click(screen.getByText('Show Open Only'));

    expect(screen.getByText('Closed PR')).toBeInTheDocument();
    expect(screen.getByText('2 PRs')).toBeInTheDocument();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'showOpenPRsOnly',
      'false'
    );
  });

  it('links each PR to its timeline anchor', () => {
    render(
      <RecentPullRequests
        pullRequests={pullRequests}
        onSelect={vi.fn()}
        loading={false}
      />
    );

    expect(screen.getByText('Open PR').closest('a')).toHaveAttribute(
      'href',
      '#acme/widgets/1'
    );
  });
});
