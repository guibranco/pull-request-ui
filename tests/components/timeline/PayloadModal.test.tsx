import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PayloadModal } from '../../../src/components/timeline/PayloadModal';

describe('PayloadModal', () => {
  it('renders the payload as JSON', () => {
    render(<PayloadModal payload={{ a: 1 }} onClose={vi.fn()} />);

    expect(screen.getByText('Event Payload')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <PayloadModal payload={{ a: 1 }} onClose={onClose} />
    );

    const closeButton = container.querySelector(
      'svg.lucide-x'
    )?.closest('button');
    fireEvent.click(closeButton!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('expands and collapses all nested paths', () => {
    render(
      <PayloadModal payload={{ a: { b: 1 } }} onClose={vi.fn()} />
    );

    fireEvent.click(screen.getByText('Expand All'));
    expect(screen.getByText('"b":')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Collapse All'));
    expect(screen.queryByText('"b":')).not.toBeInTheDocument();
  });

  it('shows a compare link only when exactly one event is selected and onCompare is provided', () => {
    render(
      <PayloadModal
        payload={{ a: 1 }}
        onClose={vi.fn()}
        onCompare={vi.fn()}
        selectedCount={1}
      />
    );

    expect(
      screen.getByText('Compare with selected event')
    ).toBeInTheDocument();
  });

  it('calls onCompare with the payload when the compare link is clicked', () => {
    const onCompare = vi.fn();
    const payload = { a: 1 };
    render(
      <PayloadModal
        payload={payload}
        onClose={vi.fn()}
        onCompare={onCompare}
        selectedCount={1}
      />
    );

    fireEvent.click(screen.getByText('Compare with selected event'));

    expect(onCompare).toHaveBeenCalledWith(payload);
  });

  it('toggles a single path via handleToggle', () => {
    const { container } = render(
      <PayloadModal payload={{ a: { b: 1 } }} onClose={vi.fn()} />
    );

    expect(screen.getByText('"a":')).toBeInTheDocument();

    const rootToggle = container.querySelectorAll('.cursor-pointer')[0];
    fireEvent.click(rootToggle);

    expect(screen.queryByText('"a":')).not.toBeInTheDocument();
  });

  it('does not show a compare link when selectedCount is not 1', () => {
    render(
      <PayloadModal
        payload={{ a: 1 }}
        onClose={vi.fn()}
        onCompare={vi.fn()}
        selectedCount={0}
      />
    );

    expect(
      screen.queryByText('Compare with selected event')
    ).not.toBeInTheDocument();
  });

  it('renders the compare modal directly when a comparePayload is given', () => {
    render(
      <PayloadModal
        payload={{ a: 1 }}
        comparePayload={{ a: 2 }}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Compare Payloads')).toBeInTheDocument();
    expect(screen.queryByText('Event Payload')).not.toBeInTheDocument();
  });
});
