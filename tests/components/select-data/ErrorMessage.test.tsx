import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorMessage } from '../../../src/components/select-data/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders the message', () => {
    render(<ErrorMessage message="Something went wrong" onRetry={vi.fn()} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('calls onRetry when the retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Oops" onRetry={onRetry} />);

    fireEvent.click(screen.getByText('Retry'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render the change settings button without a handler', () => {
    render(<ErrorMessage message="Oops" onRetry={vi.fn()} />);

    expect(screen.queryByText('Change API settings')).not.toBeInTheDocument();
  });

  it('calls onChangeSettings when the change settings button is clicked', () => {
    const onChangeSettings = vi.fn();
    render(
      <ErrorMessage
        message="API Error: 404 Not Found"
        onRetry={vi.fn()}
        onChangeSettings={onChangeSettings}
      />
    );

    fireEvent.click(screen.getByText('Change API settings'));

    expect(onChangeSettings).toHaveBeenCalledTimes(1);
  });
});
