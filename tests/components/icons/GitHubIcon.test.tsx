import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GitHubIcon } from '../../../src/components/icons/GitHubIcon';

describe('GitHubIcon', () => {
  it('renders an svg element', () => {
    const { container } = render(<GitHubIcon />);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('forwards additional props to the svg element', () => {
    const { container } = render(<GitHubIcon className="w-6 h-6" data-testid="icon" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-6', 'h-6');
    expect(svg).toHaveAttribute('data-testid', 'icon');
  });
});
