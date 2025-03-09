import React from 'react';
import { GitFork } from 'lucide-react';
import { Repository } from '../../types';

interface RepositorySelectProps {
  repositories: Repository[];
  selectedRepo: string;
  onChange: (repo: string) => void;
  disabled: boolean;
}

/**
 * A functional component that renders a dropdown select for choosing a repository.
 *
 * @param {Object} props - The properties for the component.
 * @param {Array} props.repositories - An array of repository objects to be displayed in the select dropdown.
 * @param {string} props.selectedRepo - The currently selected repository's full name.
 * @param {function} props.onChange - A callback function that is called when the selected repository changes.
 * @param {boolean} props.disabled - A flag indicating whether the select dropdown should be disabled.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @throws {Error} Throws an error if the repositories prop is not an array.
 */
export function RepositorySelect({ repositories, selectedRepo, onChange, disabled }: RepositorySelectProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="repository"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Repository
      </label>
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
          {repositories.map((repo) => (
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
    </div>
  );
}