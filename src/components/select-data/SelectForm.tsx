import React from 'react';
import { GitFork, Loader2 } from 'lucide-react';
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
}

export function SelectForm({
  repositories,
  pullRequests,
  selectedRepo,
  selectedPR,
  loading,
  onRepoChange,
  onPRChange,
  onSubmit,
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

        <button
          type="submit"
          disabled={!selectedRepo || !selectedPR || loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-blue-800 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            'Continue'
          )}
        </button>
      </form>
    </div>
  );
}