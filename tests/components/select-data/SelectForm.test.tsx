import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SelectForm } from '../../../src/components/select-data/SelectForm';
import type { Repository, PullRequest } from '../../../src/types';

const repositories: Repository[] = [
  { id: '1', owner: 'owner', name: 'repo', full_name: 'owner/repo' },
];

const pullRequests: PullRequest[] = [
  {
    date: '2024-01-01T00:00:00Z',
    number: 1,
    title: 'Test PR',
    state: 'OPEN',
    sender: 'someone',
    sender_avatar: '',
  },
];

describe('SelectForm', () => {
  it('does not render the pull request select until a repo is chosen', () => {
    render(
      <SelectForm
        repositories={repositories}
        pullRequests={pullRequests}
        selectedRepo=""
        selectedPR=""
        loading={false}
        onRepoChange={vi.fn()}
        onPRChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.queryByText('Pull Request')).not.toBeInTheDocument();
  });

  it('renders the pull request select once a repo is selected', () => {
    render(
      <SelectForm
        repositories={repositories}
        pullRequests={pullRequests}
        selectedRepo="owner/repo"
        selectedPR=""
        loading={false}
        onRepoChange={vi.fn()}
        onPRChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('Pull Request')).toBeInTheDocument();
  });

  it('disables the submit button until both repo and PR are selected', () => {
    render(
      <SelectForm
        repositories={repositories}
        pullRequests={pullRequests}
        selectedRepo="owner/repo"
        selectedPR=""
        loading={false}
        onRepoChange={vi.fn()}
        onPRChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('Continue').closest('button')).toBeDisabled();
  });

  it('shows a loading spinner instead of the Continue label when loading', () => {
    const { container } = render(
      <SelectForm
        repositories={repositories}
        pullRequests={pullRequests}
        selectedRepo="owner/repo"
        selectedPR="1"
        loading={true}
        onRepoChange={vi.fn()}
        onPRChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.queryByText('Continue')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('calls onSubmit when the form is submitted', () => {
    const onSubmit = vi.fn(e => e.preventDefault());
    const { container } = render(
      <SelectForm
        repositories={repositories}
        pullRequests={pullRequests}
        selectedRepo="owner/repo"
        selectedPR="1"
        loading={false}
        onRepoChange={vi.fn()}
        onPRChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    fireEvent.submit(container.querySelector('form')!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
