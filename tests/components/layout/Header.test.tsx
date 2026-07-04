import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
});
