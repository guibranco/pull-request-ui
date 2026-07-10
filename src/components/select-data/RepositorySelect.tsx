import React, { useMemo } from 'react';
import { GitFork, Search, ChevronDown, Check } from 'lucide-react';
import { Repository } from '../../types';
import { highlightMatch } from '../../utils/highlightMatch';
import { useSearchableDropdown } from '../../hooks/useSearchableDropdown';

interface RepositorySelectProps {
  readonly repositories: readonly Repository[];
  readonly selectedRepo: string;
  readonly onChange: (repo: string) => void;
  readonly disabled: boolean;
}

export function RepositorySelect({
  repositories,
  selectedRepo,
  onChange,
  disabled,
}: Readonly<RepositorySelectProps>) {
  const {
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
  } = useSearchableDropdown();

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

  const onSearchKeyDown = (e: React.KeyboardEvent) =>
    handleSearchKeyDown(e, filteredRepositories.length, index => {
      onChange(filteredRepositories[index].full_name);
    });

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
                  onKeyDown={onSearchKeyDown}
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
