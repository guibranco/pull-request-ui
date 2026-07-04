import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RepositorySelect } from '../../../src/components/select-data/RepositorySelect';
import type { Repository } from '../../../src/types';

const repositories: Repository[] = [
  { id: '1', owner: 'acme', name: 'widgets', full_name: 'acme/widgets' },
  { id: '2', owner: 'acme', name: 'gadgets', full_name: 'acme/gadgets' },
];

describe('RepositorySelect', () => {
  it('shows a placeholder when nothing is selected', () => {
    render(
      <RepositorySelect
        repositories={repositories}
        selectedRepo=""
        onChange={vi.fn()}
        disabled={false}
      />
    );

    expect(screen.getByText('Select a repository…')).toBeInTheDocument();
    expect(screen.getByText('2 available')).toBeInTheDocument();
  });

  it('shows the selected repository owner/name', () => {
    render(
      <RepositorySelect
        repositories={repositories}
        selectedRepo="acme/widgets"
        onChange={vi.fn()}
        disabled={false}
      />
    );

    expect(screen.getByText('widgets')).toBeInTheDocument();
  });

  it('opens the dropdown and lists repositories grouped by owner', () => {
    render(
      <RepositorySelect
        repositories={repositories}
        selectedRepo=""
        onChange={vi.fn()}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('acme')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('filters repositories by search query', () => {
    render(
      <RepositorySelect
        repositories={repositories}
        selectedRepo=""
        onChange={vi.fn()}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText(/Search 2 repositories/), {
      target: { value: 'widget' },
    });

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByText('1 of 2 repositories')).toBeInTheDocument();
  });

  it('shows a no-matches message when search has no results', () => {
    render(
      <RepositorySelect
        repositories={repositories}
        selectedRepo=""
        onChange={vi.fn()}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText(/Search 2 repositories/), {
      target: { value: 'nope' },
    });

    expect(screen.getByText(/No repositories match/)).toBeInTheDocument();
  });

  it('calls onChange and closes the dropdown when an option is clicked', () => {
    const onChange = vi.fn();
    render(
      <RepositorySelect
        repositories={repositories}
        selectedRepo=""
        onChange={onChange}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('widgets'));

    expect(onChange).toHaveBeenCalledWith('acme/widgets');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects the active option with the keyboard', () => {
    const onChange = vi.fn();
    render(
      <RepositorySelect
        repositories={repositories}
        selectedRepo=""
        onChange={onChange}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    const search = screen.getByPlaceholderText(/Search 2 repositories/);
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    fireEvent.keyDown(search, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('acme/widgets');
  });

  it('closes the dropdown on Escape', () => {
    render(
      <RepositorySelect
        repositories={repositories}
        selectedRepo=""
        onChange={vi.fn()}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.keyDown(screen.getByPlaceholderText(/Search 2 repositories/), {
      key: 'Escape',
    });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    render(
      <RepositorySelect
        repositories={repositories}
        selectedRepo=""
        onChange={vi.fn()}
        disabled={true}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
