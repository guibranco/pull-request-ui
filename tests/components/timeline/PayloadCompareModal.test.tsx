import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PayloadCompareModal } from '../../../src/components/timeline/PayloadCompareModal';

describe('PayloadCompareModal', () => {
  it('renders both payload columns', () => {
    render(
      <PayloadCompareModal
        leftPayload={{ a: 1 }}
        rightPayload={{ a: 2 }}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Left Payload')).toBeInTheDocument();
    expect(screen.getByText('Right Payload')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <PayloadCompareModal
        leftPayload={{ a: 1 }}
        rightPayload={{ a: 2 }}
        onClose={onClose}
      />
    );

    const closeButton = container.querySelector('svg.lucide-x')?.closest('button');
    fireEvent.click(closeButton!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('toggles the show-differences-only checkbox', () => {
    render(
      <PayloadCompareModal
        leftPayload={{ a: 1, b: 1 }}
        rightPayload={{ a: 2, b: 1 }}
        onClose={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('expands and collapses all nested paths across both payloads', () => {
    render(
      <PayloadCompareModal
        leftPayload={{ nested: { value: 1 } }}
        rightPayload={{ nested: { value: 2 } }}
        onClose={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Expand All'));
    expect(screen.getAllByText('"value":')).toHaveLength(2);

    fireEvent.click(screen.getByText('Collapse All'));
    expect(screen.queryByText('"value":')).not.toBeInTheDocument();
  });

  it('toggles a single path via handleToggle', () => {
    const { container } = render(
      <PayloadCompareModal
        leftPayload={{ a: 1 }}
        rightPayload={{ a: 2 }}
        onClose={vi.fn()}
      />
    );

    expect(screen.getAllByText('"a":')).toHaveLength(2);

    const rootToggle = container.querySelectorAll('.cursor-pointer')[0];
    fireEvent.click(rootToggle);

    expect(screen.queryByText('"a":')).not.toBeInTheDocument();
  });
});
