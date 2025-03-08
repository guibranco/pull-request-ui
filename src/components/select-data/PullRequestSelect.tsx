import React from 'react';
import { PullRequest } from '../../types';

interface PullRequestSelectProps {
  pullRequests: PullRequest[];
  selectedPR: string;
  onChange: (pr: string) => void;
  disabled: boolean;
}

export function PullRequestSelect({ pullRequests, selectedPR, onChange, disabled }: PullRequestSelectProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor="pullRequest"
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        Pull Request
      </label>
      <select
        id="pullRequest"
        value={selectedPR}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
        required
        disabled={disabled}
      >
        <option value="">Select a pull request</option>
        {pullRequests.map((pr) => (
          <option key={pr.number} value={pr.number.toString()}>
            #{pr.number} - {pr.title}
          </option>
        ))}
      </select>
    </div>
  );
}