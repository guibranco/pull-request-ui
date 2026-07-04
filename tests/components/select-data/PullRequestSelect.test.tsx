import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PullRequestSelect } from '../../../src/components/select-data/PullRequestSelect';
import type { PullRequest } from '../../../src/types';

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

const pullRequests: PullRequest[] = [
  {
    date: daysAgo(0),
    number: 1,
    title: 'Fix the bug',
    state: 'OPEN',
    sender: 'alice',
    sender_avatar: 'https://example.com/alice.png',
  },
  {
    date: daysAgo(400),
    number: 2,
    title: 'Add the feature',
    state: 'CLOSED',
    sender: 'bob',
    sender_avatar: '',
  },
];

describe('PullRequestSelect', () => {
  it('shows a placeholder and count when nothing is selected', () => {
    render(
      <PullRequestSelect
        pullRequests={pullRequests}
        selectedPR=""
        onChange={vi.fn()}
        disabled={false}
      />
    );

    expect(screen.getByText('Select a pull request…')).toBeInTheDocument();
    expect(screen.getByText('2 available')).toBeInTheDocument();
  });

  it('shows the selected pull request title', () => {
    render(
      <PullRequestSelect
        pullRequests={pullRequests}
        selectedPR="1"
        onChange={vi.fn()}
        disabled={false}
      />
    );

    expect(screen.getByText('Fix the bug')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('opens the dropdown and lists both open and closed PRs with relative dates', () => {
    render(
      <PullRequestSelect
        pullRequests={pullRequests}
        selectedPR=""
        onChange={vi.fn()}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('today')).toBeInTheDocument();
    expect(screen.getByText(/y ago/)).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('filters by title, number, or author', () => {
    render(
      <PullRequestSelect
        pullRequests={pullRequests}
        selectedPR=""
        onChange={vi.fn()}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(
      screen.getByPlaceholderText('Search by title, number, or author…'),
      { target: { value: 'bob' } }
    );

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByText('Add the feature')).toBeInTheDocument();
  });

  it('shows a no-matches message when the search has no results', () => {
    render(
      <PullRequestSelect
        pullRequests={pullRequests}
        selectedPR=""
        onChange={vi.fn()}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(
      screen.getByPlaceholderText('Search by title, number, or author…'),
      { target: { value: 'nomatch' } }
    );

    expect(screen.getByText(/No pull requests match/)).toBeInTheDocument();
  });

  it('calls onChange and closes the dropdown when an option is clicked', () => {
    const onChange = vi.fn();
    render(
      <PullRequestSelect
        pullRequests={pullRequests}
        selectedPR=""
        onChange={onChange}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Fix the bug'));

    expect(onChange).toHaveBeenCalledWith('1');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects the active option with the keyboard', () => {
    const onChange = vi.fn();
    render(
      <PullRequestSelect
        pullRequests={pullRequests}
        selectedPR=""
        onChange={onChange}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    const search = screen.getByPlaceholderText(
      'Search by title, number, or author…'
    );
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    fireEvent.keyDown(search, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('does not open when disabled', () => {
    render(
      <PullRequestSelect
        pullRequests={pullRequests}
        selectedPR=""
        onChange={vi.fn()}
        disabled={true}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
