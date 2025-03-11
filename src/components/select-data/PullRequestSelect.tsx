import React, { useState, useMemo } from 'react';
import { GitPullRequest, Search } from 'lucide-react';
import { PullRequest } from '../../types';

interface PullRequestSelectProps {
  readonly pullRequests: readonly PullRequest[];
  readonly selectedPR: string;
  readonly onChange: (pr: string) => void;
  readonly disabled: boolean;
}

/**
 * A React component that allows users to select a pull request from a list.
 * It includes a search input to filter the pull requests based on their title or number.
 *
 * @param {Object} props - The properties for the component.
 * @param {Array} props.pullRequests - An array of pull request objects to display.
 * @param {string} props.selectedPR - The currently selected pull request number.
 * @param {function} props.onChange - Callback function to handle changes in selection.
 * @param {boolean} props.disabled - Indicates whether the component is disabled.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @throws {Error} Throws an error if the pullRequests prop is not an array.
 */
export function PullRequestSelect({ pullRequests, selectedPR, onChange, disabled }: Readonly<PullRequestSelectProps>) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPullRequests = useMemo(() => {
    if (!searchQuery) return pullRequests;
    
    const query = searchQuery.toLowerCase();
    return pullRequests.filter(pr => 
      pr.title.toLowerCase().includes(query) ||
      pr.number.toString().includes(query)
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
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pull requests..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          />
        </div>
        <div className="relative">
          <select
            id="pullRequest"
            value={selectedPR}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm appearance-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed
              pr-12 ${selectedPR ? 'text-gray-100' : 'text-gray-400'}`}
            required
            disabled={disabled}
          >
            <option value="" className="text-gray-400">Select a pull request</option>
            {filteredPullRequests.map((pr) => (
              <option key={pr.number} value={pr.number.toString()} className="text-gray-100 bg-gray-700">
                #{pr.number} - {pr.title}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" stroke="currentColor" fill="none"/>
            </svg>
          </div>
        </div>
        {filteredPullRequests.length === 0 && (
          <p className="text-sm text-gray-400">No pull requests found matching your search.</p>
        )}
      </div>
    </div>
  );
}