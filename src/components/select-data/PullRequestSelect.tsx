import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { GitPullRequest, GitMerge, Search, User, ChevronDown, Check } from 'lucide-react';
import { PullRequest } from '../../types';

interface PullRequestSelectProps {
  readonly pullRequests: readonly PullRequest[];
  readonly selectedPR: string;
  readonly onChange: (pr: string) => void;
  readonly disabled: boolean;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-green-500/30 text-green-300 rounded-sm not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function StateBadge({ state }: { readonly state: 'OPEN' | 'CLOSED' }) {
  if (state === 'OPEN') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 shrink-0">
        <GitPullRequest className="w-3 h-3" />
        Open
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 shrink-0">
      <GitMerge className="w-3 h-3" />
      Closed
    </span>
  );
}

export function PullRequestSelect({
  pullRequests,
  selectedPR,
  onChange,
  disabled,
}: Readonly<PullRequestSelectProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredPullRequests = useMemo(() => {
    if (!searchQuery.trim()) return [...pullRequests];
    const query = searchQuery.toLowerCase().trim();
    return pullRequests.filter(
      pr =>
        pr.title.toLowerCase().includes(query) ||
        pr.number.toString().includes(query) ||
        pr.sender.toLowerCase().includes(query)
    );
  }, [pullRequests, searchQuery]);

  const selectedPullRequest = useMemo(
    () => pullRequests.find(pr => pr.number.toString() === selectedPR),
    [pullRequests, selectedPR]
  );

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
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(i => Math.min(i + 1, filteredPullRequests.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && filteredPullRequests[activeIndex]) {
            onChange(filteredPullRequests[activeIndex].number.toString());
            setIsOpen(false);
          }
          break;
      }
    },
    [filteredPullRequests, activeIndex, onChange]
  );

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Pull Request
        {pullRequests.length > 0 && (
          <span className="ml-2 text-xs text-gray-500">
            {pullRequests.length} available
          </span>
        )}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleTriggerKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full pl-10 pr-10 py-3 bg-zinc-700 border rounded-lg shadow-sm text-left transition-colors
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isOpen ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-600 hover:border-gray-500'}`}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          {selectedPullRequest ? (
            <div className="flex items-center gap-2 min-w-0">
              {selectedPullRequest.sender_avatar ? (
                <img
                  src={selectedPullRequest.sender_avatar}
                  alt={selectedPullRequest.sender}
                  className="w-5 h-5 rounded-full shrink-0"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-zinc-600 flex items-center justify-center shrink-0">
                  <User className="w-3 h-3 text-gray-400" />
                </div>
              )}
              <StateBadge state={selectedPullRequest.state} />
              <span className="text-gray-400 shrink-0 text-sm">#{selectedPullRequest.number}</span>
              <span className="text-gray-100 truncate text-sm">{selectedPullRequest.title}</span>
            </div>
          ) : (
            <span className="text-gray-400">Select a pull request…</span>
          )}
          <ChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-20 w-full mt-1 bg-zinc-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden">
            <div className="p-2 border-b border-zinc-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-100 text-sm placeholder-gray-500"
                  placeholder={`Search by title, number, or author…`}
                />
              </div>
              {searchQuery && (
                <p className="text-xs text-gray-500 mt-1.5 px-1">
                  {filteredPullRequests.length === 0
                    ? 'No matches'
                    : `${filteredPullRequests.length} of ${pullRequests.length} pull requests`}
                </p>
              )}
            </div>

            <div ref={listRef} className="max-h-72 overflow-y-auto" role="listbox">
              {filteredPullRequests.length === 0 ? (
                <div className="p-4 text-gray-400 text-center text-sm">
                  No pull requests match &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <div className="py-1">
                  {filteredPullRequests.map((pr, index) => {
                    const isActive = index === activeIndex;
                    const isSelected = pr.number.toString() === selectedPR;
                    return (
                      <div
                        key={pr.number}
                        data-option
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onChange(pr.number.toString());
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                          ${isActive ? 'bg-zinc-600' : isSelected ? 'bg-green-900/30' : 'hover:bg-zinc-700'}`}
                      >
                        {pr.sender_avatar ? (
                          <img
                            src={pr.sender_avatar}
                            alt={pr.sender}
                            className="w-7 h-7 rounded-full shrink-0 mt-0.5"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-600 flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <StateBadge state={pr.state} />
                            <span className="text-gray-400 text-xs shrink-0">#{pr.number}</span>
                            <span className="text-gray-500 text-xs shrink-0 ml-auto">{relativeTime(pr.date)}</span>
                          </div>
                          <p className="text-sm text-gray-100 leading-snug truncate">
                            {highlightMatch(pr.title, searchQuery)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {highlightMatch(pr.sender, searchQuery)}
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-green-400 shrink-0 mt-1" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
