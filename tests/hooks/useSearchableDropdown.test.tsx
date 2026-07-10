import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSearchableDropdown } from '../../src/hooks/useSearchableDropdown';

function TestDropdown() {
  const {
    isOpen,
    setIsOpen,
    activeIndex,
    dropdownRef,
    searchRef,
    listRef,
    handleSearchKeyDown,
    handleTriggerKeyDown,
  } = useSearchableDropdown();

  return (
    <div>
      <div ref={dropdownRef} data-testid="dropdown">
        <button
          data-testid="trigger"
          onKeyDown={handleTriggerKeyDown}
          onClick={() => setIsOpen(true)}
        >
          trigger
        </button>
        {isOpen && (
          <div ref={listRef} data-testid="list">
            <input
              data-testid="search"
              ref={searchRef}
              onKeyDown={e => handleSearchKeyDown(e, 3, () => {})}
            />
            <div data-option>0</div>
            <div data-option>1</div>
            <div data-option>2</div>
          </div>
        )}
      </div>
      <div data-testid="outside">outside</div>
      <span data-testid="active-index">{activeIndex}</span>
    </div>
  );
}

describe('useSearchableDropdown', () => {
  it('closes the dropdown when clicking outside of it', () => {
    render(<TestDropdown />);

    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByTestId('list')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(screen.queryByTestId('list')).not.toBeInTheDocument();
  });

  it('keeps the dropdown open when clicking inside of it', () => {
    render(<TestDropdown />);

    fireEvent.click(screen.getByTestId('trigger'));
    fireEvent.mouseDown(screen.getByTestId('trigger'));

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('clamps the active index between 0 and the item count on arrow key navigation', () => {
    render(<TestDropdown />);

    fireEvent.click(screen.getByTestId('trigger'));
    const search = screen.getByTestId('search');

    fireEvent.keyDown(search, { key: 'ArrowDown' });
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    expect(screen.getByTestId('active-index')).toHaveTextContent('1');

    fireEvent.keyDown(search, { key: 'ArrowUp' });
    expect(screen.getByTestId('active-index')).toHaveTextContent('0');

    fireEvent.keyDown(search, { key: 'ArrowUp' });
    expect(screen.getByTestId('active-index')).toHaveTextContent('0');
  });

  it.each(['Enter', ' ', 'ArrowDown'])(
    'opens the dropdown when %s is pressed on the trigger',
    key => {
      render(<TestDropdown />);

      expect(screen.queryByTestId('list')).not.toBeInTheDocument();
      fireEvent.keyDown(screen.getByTestId('trigger'), { key });

      expect(screen.getByTestId('list')).toBeInTheDocument();
    }
  );

  it('ignores unrelated keys on the trigger', () => {
    render(<TestDropdown />);

    fireEvent.keyDown(screen.getByTestId('trigger'), { key: 'a' });

    expect(screen.queryByTestId('list')).not.toBeInTheDocument();
  });
});
