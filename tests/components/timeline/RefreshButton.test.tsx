import { render, screen, fireEvent, act } from '@testing-library/react';
import { RefreshButton } from '../../../src/components/timeline/RefreshButton';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('RefreshButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with initial state', () => {
    render(<RefreshButton onRefresh={vi.fn()} isLoading={false} />);

    expect(screen.getByText(/Refreshing in 15s/)).toBeInTheDocument();
    expect(screen.getByTitle('Pause auto-refresh')).toBeInTheDocument();
    expect(screen.getByText('Refresh Now')).toBeInTheDocument();
  });

  it('counts down when not paused', async () => {
    render(<RefreshButton onRefresh={vi.fn()} isLoading={false} />);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/Refreshing in 14s/)).toBeInTheDocument();
  });

  it('pauses countdown when pause button is clicked', async () => {
    render(<RefreshButton onRefresh={vi.fn()} isLoading={false} />);

    fireEvent.click(screen.getByTitle('Pause auto-refresh'));

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/Refreshing in 15s/)).toBeInTheDocument();
  });

  it('calls onRefresh when countdown reaches 0', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    render(<RefreshButton onRefresh={onRefresh} isLoading={false} />);

    // Advance time by 15 seconds (initial countdown value)
    for (let i = 0; i < 16; i++) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
      });
    }

    // Verify the countdown reached 0 and reset and refresh was called
    expect(screen.getByText(/Refreshing in 15s/)).toBeInTheDocument();
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<RefreshButton onRefresh={vi.fn()} isLoading={true} />);

    expect(screen.getByText('Refreshing...')).toBeInTheDocument();
  });

  it('manually refreshes when clicking refresh now button', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    render(<RefreshButton onRefresh={onRefresh} isLoading={false} />);

    const refreshButton = screen.getByText('Refresh Now');
    fireEvent.click(refreshButton);

    await act(async () => {
      await Promise.resolve();
    });

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
