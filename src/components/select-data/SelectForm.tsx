import React from 'react';
import { GitFork, Loader2, ArrowLeft } from 'lucide-react';
import { RepositorySelect } from './RepositorySelect';
import { PullRequestSelect } from './PullRequestSelect';
import type { Repository, PullRequest } from '../../types';

interface SelectFormProps {
  repositories: Repository[];
  pullRequests: PullRequest[];
  selectedRepo: string;
  selectedPR: string;
  loading: boolean;
  onRepoChange: (repo: string) => void;
  onPRChange: (pr: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLogout: () => void;
}

/**
 * A functional component that renders a form for selecting a repository and a pull request.
 * It allows users to choose from available repositories and pull requests, and provides
 * buttons for submission and logout.
 *
 * @param {Object} props - The properties for the component.
 * @param {Array} props.repositories - An array of available repositories.
 * @param {Array} props.pullRequests - An array of available pull requests.
 * @param {string} props.selectedRepo - The currently selected repository.
 * @param {string} props.selectedPR - The currently selected pull request.
 * @param {boolean} props.loading - Indicates if the form is in a loading state.
 * @param {Function} props.onRepoChange - Callback function triggered when the repository selection changes.
 * @param {Function} props.onPRChange - Callback function triggered when the pull request selection changes.
 * @param {Function} props.onSubmit - Callback function triggered when the form is submitted.
 * @param {Function} props.onLogout - Callback function triggered when the logout button is clicked.
 *
 * @throws {Error} Throws an error if required props are not provided.
 *
 * @returns {JSX.Element} The rendered form component.
 */
export function SelectForm({
  repositories,
  pullRequests,
  selectedRepo,
  selectedPR,
  loading,
  onRepoChange,
  onPRChange,
  onSubmit,
  onLogout,
}: SelectFormProps) {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-900 rounded-full mx-auto mb-4">
        <GitFork className="w-6 h-6 text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">
        Select Repository and Pull Request
      </h2>
      <form onSubmit={onSubmit} className="max-w-md mx-auto">
        <RepositorySelect
          repositories={repositories}
          selectedRepo={selectedRepo}
          onChange={onRepoChange}
          disabled={loading}
        />

        {selectedRepo && (
          <PullRequestSelect
            pullRequests={pullRequests}
            selectedPR={selectedPR}
            onChange={onPRChange}
            disabled={loading}
          />
        )}

        <div className="space-y-2">
          <button
            type="submit"
            disabled={!selectedRepo || !selectedPR || loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-blue-800 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Continue'
            )}
          </button>
          
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center text-gray-300 hover:text-gray-100 py-2 px-4 rounded-md border border-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to API Key
          </button>
        </div>
      </form>
    </div>
  );
}