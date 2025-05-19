import React, { useState, useMemo } from 'react';
import { GitPullRequest, Search, User } from 'lucide-react';
import { PullRequest } from '../../types';

interface PullRequestSelectProps {
  readonly pullRequests: readonly PullRequest[];
  readonly selectedPR: string;
  readonly onChange: (pr: string) => void;
  readonly disabled: boolean;
}

export function PullRequestSelect({ pullRequests, selectedPR, onChange, disabled }: Readonly<PullRequestSelectProps>) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPullRequests = useMemo(() => {
    if (!searchQuery) return pullRequests;
    
    const query = searchQuery.toLowerCase();
    return pullRequests.filter(pr => 
      pr.title.toLowerCase().includes(query) ||
      pr.number.toString().includes(query) ||
      pr.sender.toLowerCase().includes(query)
    );
  }, [pullRequests, searchQuery]);

  return (
    <div className="mb-6">
      <label
        htmlFor="pullRequest"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Pull Request
      </label>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            id="pullRequest"
            value={selectedPR}
            onChange={(e) => {
              onChange(e.target.value);
              setSearchQuery('');
            }}
            onKeyDown={(e) => {
              if (e.key.length === 1) {
                setSearchQuery(prev => prev + e.key);
              }
            }}
            className={`w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm appearance-none
              focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed
              ${selectedPR ? 'text-gray-100' : 'text-gray-400'}`}
            required
            disabled={disabled}
            dangerouslySetInnerHTML={{
              __html: `
                <option value="" class="text-gray-400">Select a pull request</option>
                ${filteredPullRequests.map(pr => `
                  <option value="${pr.number}" class="${pr.state === 'OPEN' ? 'text-green-400' : 'text-red-400'}">
                    <div class="flex items-center space-x-2">
                      ${pr.sender_avatar ? `
                        <img src="${pr.sender_avatar}" alt="${pr.sender}" class="w-4 h-4 rounded-full" />
                      ` : `
                        <span class="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center">
                          <svg class="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </span>
                      `}
                      <span>#${pr.number} - ${pr.title}</span>
                      <span class="text-gray-400">(${pr.sender})</span>
                    </div>
                  </option>
                `).join('')}
              `
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <GitPullRequest className="w-5 h-5" />
          </div>
        </div>
        {filteredPullRequests.length === 0 && (
          <p className="text-sm text-gray-400 mt-2">No pull requests found matching your search.</p>
        )}
      </div>
    </div>
  );
}