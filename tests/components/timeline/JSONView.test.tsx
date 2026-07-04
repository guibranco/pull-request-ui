import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JSONView } from '../../../src/components/timeline/JSONView';

describe('JSONView', () => {
  it('renders null as the literal null', () => {
    render(
      <JSONView data={null as never} expanded={new Set()} onToggle={vi.fn()} />
    );

    expect(screen.getByText('null')).toBeInTheDocument();
  });

  it('renders booleans', () => {
    render(
      <JSONView data={true as never} expanded={new Set()} onToggle={vi.fn()} />
    );

    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('renders numbers', () => {
    render(
      <JSONView data={42 as never} expanded={new Set()} onToggle={vi.fn()} />
    );

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders strings with quotes', () => {
    render(
      <JSONView data={'hello' as never} expanded={new Set()} onToggle={vi.fn()} />
    );

    expect(screen.getByText('"hello"')).toBeInTheDocument();
  });

  it('renders an empty object as {}', () => {
    render(<JSONView data={{}} expanded={new Set()} onToggle={vi.fn()} />);

    expect(screen.getByText('{}')).toBeInTheDocument();
  });

  it('renders an empty array as []', () => {
    render(
      <JSONView data={[] as never} expanded={new Set()} onToggle={vi.fn()} />
    );

    expect(screen.getByText('[]')).toBeInTheDocument();
  });

  it('shows a collapsed summary when the path is not expanded', () => {
    render(
      <JSONView
        data={{ a: 1, b: 2 }}
        expanded={new Set()}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('2 keys')).toBeInTheDocument();
  });

  it('expands to show nested keys when the path is in the expanded set', () => {
    render(
      <JSONView
        data={{ a: 1 }}
        expanded={new Set([''])}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('"a":')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows an item count for collapsed arrays', () => {
    render(
      <JSONView
        data={[1, 2, 3] as never}
        expanded={new Set()}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('3 items')).toBeInTheDocument();
  });

  it('calls onToggle with the current path when clicked', () => {
    const onToggle = vi.fn();
    render(
      <JSONView data={{ a: 1 }} expanded={new Set()} onToggle={onToggle} path="root" />
    );

    fireEvent.click(screen.getByText('1 keys').closest('div')!);

    expect(onToggle).toHaveBeenCalledWith('root');
  });

  it('highlights differences when compareWith is provided', () => {
    const { container } = render(
      <JSONView
        data={{ a: 1 }}
        compareWith={{ a: 2 }}
        expanded={new Set()}
        onToggle={vi.fn()}
      />
    );

    expect(container.querySelector('.bg-red-500\\/20')).toBeInTheDocument();
  });

  it('hides equal nodes when showDifferencesOnly is set', () => {
    const { container } = render(
      <JSONView
        data={{ a: 1 }}
        compareWith={{ a: 1 }}
        expanded={new Set()}
        onToggle={vi.fn()}
        showDifferencesOnly
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
