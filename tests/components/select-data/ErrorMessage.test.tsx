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
});
