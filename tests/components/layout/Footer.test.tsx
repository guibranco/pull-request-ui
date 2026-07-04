import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '../../../src/components/layout/Footer';

describe('Footer', () => {
  it('renders the author name and a link to GitHub', () => {
    render(<Footer />);

    expect(screen.getByText('Guilherme Branco Stracini')).toBeInTheDocument();
    expect(screen.getByText('GitHub').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/guibranco/pull-request-ui'
    );
  });
});
