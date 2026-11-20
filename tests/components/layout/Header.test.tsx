import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../../../src/components/layout/Header';

describe('Header', () => {
  it('renders the title and all step labels', () => {
    render(<Header currentStep="api-key" />);

    expect(screen.getByText('Pull Request Flow Viewer')).toBeInTheDocument();
    expect(screen.getByText('API Key')).toBeInTheDocument();
    expect(screen.getByText('Select Data')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });

  it('highlights the current step', () => {
    render(<Header currentStep="select-data" />);

    expect(screen.getByText('Select Data').closest('div')).toHaveClass(
      'text-green-400'
    );
  });

  it('renders correctly for the final step', () => {
    render(<Header currentStep="timeline" />);

    expect(screen.getByText('Timeline').closest('div')).toHaveClass(
      'text-green-400'
    );
  });

  it('lets the user jump back to the API key step from a later step', () => {
    const onApiKeyClick = vi.fn();
    render(<Header currentStep="select-data" onApiKeyClick={onApiKeyClick} />);

    fireEvent.click(screen.getByRole('button', { name: /API Key/ }));

    expect(onApiKeyClick).toHaveBeenCalledTimes(1);
  });

  it('does not render the API key step as a button when already on it', () => {
    render(<Header currentStep="api-key" onApiKeyClick={vi.fn()} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
