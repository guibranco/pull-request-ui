import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiKeyStep } from '../../src/steps/ApiKeyStep';

const localStorageMock = window.localStorage as unknown as {
  getItem: ReturnType<typeof vi.fn>;
};

describe('ApiKeyStep', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    window.history.replaceState({}, '', '/');
  });

  it('renders an editable input and a Continue submit button when no key is stored', () => {
    render(<ApiKeyStep onSubmit={vi.fn()} />);

    const input = screen.getByLabelText('API Key') as HTMLInputElement;
    expect(input).not.toBeDisabled();
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(
      screen.queryByText('Continue to Select Data')
    ).not.toBeInTheDocument();
  });

  it('renders a locked input with continue/change buttons when a key is stored', () => {
    localStorageMock.getItem.mockReturnValue('existing-key');

    render(<ApiKeyStep onSubmit={vi.fn()} />);

    const input = screen.getByLabelText('API Key') as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(input.value).toBe('existing-key');
    expect(screen.getByText('Continue to Select Data')).toBeInTheDocument();
    expect(screen.getByText('Change API Key')).toBeInTheDocument();
  });

  it('submits the typed key when the form is submitted', () => {
    const onSubmit = vi.fn();
    render(<ApiKeyStep onSubmit={onSubmit} />);

    const input = screen.getByLabelText('API Key');
    fireEvent.change(input, { target: { value: 'typed-key' } });
    fireEvent.click(screen.getByText('Continue'));

    expect(onSubmit).toHaveBeenCalledWith('typed-key');
  });

  it('submits the stored key when continuing without editing', () => {
    localStorageMock.getItem.mockReturnValue('existing-key');
    const onSubmit = vi.fn();

    render(<ApiKeyStep onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText('Continue to Select Data'));

    expect(onSubmit).toHaveBeenCalledWith('existing-key');
  });

  it('clears the key and re-enables editing when changing the API key', () => {
    localStorageMock.getItem.mockReturnValue('existing-key');

    render(<ApiKeyStep onSubmit={vi.fn()} />);

    fireEvent.click(screen.getByText('Change API Key'));

    const input = screen.getByLabelText('API Key') as HTMLInputElement;
    expect(input).not.toBeDisabled();
    expect(input.value).toBe('');
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('shows an error message from the URL and cleans up the URL', () => {
    window.history.pushState({}, '', `/?error=${encodeURIComponent('Bad key')}`);

    render(<ApiKeyStep onSubmit={vi.fn()} />);

    expect(screen.getByText('Bad key')).toBeInTheDocument();
    expect(window.location.search).toBe('');
  });
});
