import React from 'react';
import { GitPullRequest } from 'lucide-react';
import { PullRequest } from '../../types';

interface PullRequestSelectProps {
  pullRequests: PullRequest[];
  selectedPR: string;
  onChange: (pr: string) => void;
  disabled: boolean;
}

/**
 * A functional component that renders a dropdown selection for pull requests.
 *
 * @param {Object} props - The properties for the component.
 * @param {Array} props.pullRequests - An array of pull request objects to display in the dropdown.
 * @param {string} props.selectedPR - The currently selected pull request number.
 * @param {function} props.onChange - Callback function that is called when the selected pull request changes.
 * @param {boolean} props.disabled - A flag indicating whether the dropdown should be disabled.
 *
 * @returns {JSX.Element} The rendered dropdown component.
 *
 * @throws {Error} Throws an error if the onChange function is not provided.
 */
export function PullRequestSelect({ pullRequests, selectedPR, onChange, disabled }: PullRequestSelectProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="pullRequest"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Pull Request
      </label>
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
          {pullRequests.map((pr) => (
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
    </div>
  );
}