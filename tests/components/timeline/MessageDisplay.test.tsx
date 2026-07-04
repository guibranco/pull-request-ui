import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MessageDisplay } from '../../../src/components/timeline/MessageDisplay';

describe('MessageDisplay', () => {
  it('renders an error message', () => {
    render(<MessageDisplay type="error" message="Something broke" />);

    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });

  it('renders an info message', () => {
    render(<MessageDisplay type="info" message="Just so you know" />);

    expect(screen.getByText('Just so you know')).toBeInTheDocument();
  });

  it('does not render an action button when none is provided', () => {
    render(<MessageDisplay type="info" message="No action" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders and triggers the action button when both onAction and actionLabel are provided', () => {
    const onAction = vi.fn();
    render(
      <MessageDisplay
        type="error"
        message="Failed"
        onAction={onAction}
        actionLabel="Try again"
      />
    );

    fireEvent.click(screen.getByText('Try again'));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
