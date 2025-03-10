import React, { useState, useMemo } from 'react';
import { GitFork, Search } from 'lucide-react';
import { Repository } from '../../types';

interface RepositorySelectProps {
  readonly repositories: readonly Repository[];
  readonly selectedRepo: string;
  readonly onChange: (repo: string) => void;
  readonly disabled: boolean;
}

export function RepositorySelect({ repositories, selectedRepo, onChange, disabled }: Readonly<RepositorySelectProps>) {
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
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          />
        </div>
        <div className="relative">
          <select
            id="repository"
            value={selectedRepo}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm appearance-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed
              pr-12 ${selectedRepo ? 'text-gray-100' : 'text-gray-400'}`}
            required
            disabled={disabled}
          >
            <option value="" className="text-gray-400">Select a repository</option>
            {filteredRepositories.map((repo) => (
              <option key={repo.id} value={repo.full_name} className="text-gray-100 bg-gray-700">
                {repo.full_name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <GitFork className="w-5 h-5" />
          </div>
          <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" stroke="currentColor" fill="none"/>
            </svg>
          </div>
        </div>
        {filteredRepositories.length === 0 && (
          <p className="text-sm text-gray-400">No repositories found matching your search.</p>
        )}
      </div>
    </div>
  );
}