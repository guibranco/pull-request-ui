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
          >
            <option value="" className="text-gray-400">Select a pull request</option>
            {filteredPullRequests.map((pr) => (
              <option key={pr.number} value={pr.number.toString()} className="flex items-center gap-2 py-2">
                <div className={`flex items-center gap-2 ${pr.state === 'OPEN' ? 'text-green-400' : 'text-red-400'}`}>
                  <div className="flex items-center gap-2">
                    {pr.sender_avatar ? (
                      <img
                        src={pr.sender_avatar}
                        alt={pr.sender}
                        className="w-6 h-6 rounded-full inline-block"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center inline-block">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    #{pr.number} - {pr.title} ({pr.sender})
                  </div>
                </div>
              </option>
            ))}
          </select>
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