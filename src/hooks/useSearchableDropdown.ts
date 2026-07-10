import { useState, useEffect, useRef, useCallback } from 'react';

export function useSearchableDropdown() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(-1);
      setTimeout(() => searchRef.current?.focus(), 0);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll<HTMLElement>('[data-option]');
      items[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent, itemCount: number, onSelect: (index: number) => void) => {
      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(i => Math.min(i + 1, itemCount - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < itemCount) {
            onSelect(activeIndex);
            setIsOpen(false);
          }
          break;
      }
    },
    [activeIndex]
  );

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    dropdownRef,
    searchRef,
    listRef,
    handleSearchKeyDown,
    handleTriggerKeyDown,
  };
}
