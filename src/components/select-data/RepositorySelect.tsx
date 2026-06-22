import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { GitFork, Search, ChevronDown, Check } from 'lucide-react';
import { Repository } from '../../types';

interface RepositorySelectProps {
  readonly repositories: readonly Repository[];
  readonly selectedRepo: string;
  readonly onChange: (repo: string) => void;
  readonly disabled: boolean;
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

export function RepositorySelect({
  repositories,
  selectedRepo,
  onChange,
  disabled,
}: Readonly<RepositorySelectProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredRepositories = useMemo(() => {
    if (!searchQuery.trim()) return [...repositories];
    const query = searchQuery.toLowerCase().trim();
    return repositories.filter(repo =>
      repo.full_name.toLowerCase().includes(query)
    );
  }, [repositories, searchQuery]);

  const groupedRepositories = useMemo(() => {
    const groups: Record<string, Repository[]> = {};
    for (const repo of filteredRepositories) {
      if (!groups[repo.owner]) groups[repo.owner] = [];
      groups[repo.owner].push(repo);
    }
    return groups;
  }, [filteredRepositories]);

  const selectedRepository = useMemo(
    () => repositories.find(r => r.full_name === selectedRepo),
    [repositories, selectedRepo]
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
          setActiveIndex(i => Math.min(i + 1, filteredRepositories.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && filteredRepositories[activeIndex]) {
            onChange(filteredRepositories[activeIndex].full_name);
            setIsOpen(false);
          }
          break;
      }
    },
    [filteredRepositories, activeIndex, onChange]
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
        Repository
        {repositories.length > 0 && (
          <span className="ml-2 text-xs text-gray-500">
            {repositories.length} available
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
          <GitFork className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          {selectedRepository ? (
            <span>
              <span className="text-gray-500">{selectedRepository.owner}/</span>
              <span className="text-gray-100">{selectedRepository.name}</span>
            </span>
          ) : (
            <span className="text-gray-400">Select a repository…</span>
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
                  placeholder={`Search ${repositories.length} repositories…`}
                />
              </div>
              {searchQuery && (
                <p className="text-xs text-gray-500 mt-1.5 px-1">
                  {filteredRepositories.length === 0
                    ? 'No matches'
                    : `${filteredRepositories.length} of ${repositories.length} repositories`}
                </p>
              )}
            </div>

            <div ref={listRef} className="max-h-64 overflow-y-auto" role="listbox">
              {filteredRepositories.length === 0 ? (
                <div className="p-4 text-gray-400 text-center text-sm">
                  No repositories match &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                Object.entries(groupedRepositories).map(([owner, repos]) => (
                  <div key={owner}>
                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-zinc-900/60 sticky top-0">
                      {owner}
                    </div>
                    {repos.map(repo => {
                      const flatIndex = filteredRepositories.indexOf(repo);
                      const isActive = flatIndex === activeIndex;
                      const isSelected = repo.full_name === selectedRepo;
                      return (
                        <div
                          key={repo.full_name}
                          data-option
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            onChange(repo.full_name);
                            setIsOpen(false);
                          }}
                          onMouseEnter={() => setActiveIndex(flatIndex)}
                          className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors text-sm
                            ${isActive ? 'bg-zinc-600' : isSelected ? 'bg-green-900/30' : 'hover:bg-zinc-700'}`}
                        >
                          <span className="text-gray-100">
                            {highlightMatch(repo.name, searchQuery)}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-green-400 shrink-0 ml-2" />}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
