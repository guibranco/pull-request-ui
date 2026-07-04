import { render, screen, fireEvent, act } from '@testing-library/react';
import { RefreshButton } from '../../../src/components/select-data/RefreshButton';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('select-data RefreshButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with the initial 60s countdown', () => {
    render(<RefreshButton onRefresh={vi.fn()} isLoading={false} />);

    expect(screen.getByText(/Refreshing in 60s/)).toBeInTheDocument();
    expect(screen.getByTitle('Pause auto-refresh')).toBeInTheDocument();
  });

  it('counts down when not paused', async () => {
    render(<RefreshButton onRefresh={vi.fn()} isLoading={false} />);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/Refreshing in 59s/)).toBeInTheDocument();
  });

  it('pauses countdown and persists the preference', () => {
    render(<RefreshButton onRefresh={vi.fn()} isLoading={false} />);

    fireEvent.click(screen.getByTitle('Pause auto-refresh'));

    expect(screen.getByTitle('Resume auto-refresh')).toBeInTheDocument();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'isSelectDataRefreshPaused',
      'true'
    );
  });

  it('shows the loading label', () => {
    render(<RefreshButton onRefresh={vi.fn()} isLoading={true} />);

    expect(screen.getByText('Refreshing...')).toBeInTheDocument();
  });

  it('manually refreshes and resets the countdown', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    render(<RefreshButton onRefresh={onRefresh} isLoading={false} />);

    fireEvent.click(screen.getByText('Refresh Now'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
