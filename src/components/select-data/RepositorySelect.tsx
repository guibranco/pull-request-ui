import React, { useState, useMemo } from 'react';
import { GitFork, Search } from 'lucide-react';
import { Repository } from '../../types';

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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRepositories = useMemo(() => {
    if (!searchQuery) return repositories;

    const query = searchQuery.toLowerCase();
    return repositories.filter(repo =>
      repo.full_name.toLowerCase().includes(query)
    );
  }, [repositories, searchQuery]);

  return (
    <div className="mb-6">
      <label
        htmlFor="repository"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Repository
      </label>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            id="repository"
            value={selectedRepo}
            onChange={e => {
              onChange(e.target.value);
              setSearchQuery('');
            }}
            onKeyDown={e => {
              if (e.key.length === 1) {
                setSearchQuery(prev => prev + e.key);
              }
            }}
            className={`w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm appearance-none
              focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed
              ${selectedRepo ? 'text-gray-100' : 'text-gray-400'}`}
            required
            disabled={disabled}
            dangerouslySetInnerHTML={{
              __html: `
                <option value="" class="text-gray-400">Select a repository</option>
                ${filteredRepositories
                  .map(
                    repo => `
                  <option value="${repo.full_name}" class="text-gray-100">
                    ${repo.full_name}
                  </option>
                `
                  )
                  .join('')}
              `,
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <GitFork className="w-5 h-5" />
          </div>
        </div>
        {filteredRepositories.length === 0 && (
          <p className="text-sm text-gray-400 mt-2">
            No repositories found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
