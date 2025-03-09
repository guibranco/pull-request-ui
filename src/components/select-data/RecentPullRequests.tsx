import React from 'react';
import { GitPullRequest, Clock, User } from 'lucide-react';
import { RecentPullRequest } from '../../types';

interface RecentPullRequestsProps {
  pullRequests: RecentPullRequest[];
  onSelect: (owner: string, repo: string, pr: string) => void;
  loading: boolean;
}

export function RecentPullRequests({ pullRequests, onSelect, loading }: RecentPullRequestsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && pullRequests.length === 0) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-700/50 rounded-lg h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-300 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Pull Requests
        </h3>
        <div className="flex items-center">
          <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
            {pullRequests.length} PR{pullRequests.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {pullRequests.map((pr) => (
          <button
            key={`${pr.owner}/${pr.name}#${pr.number}`}
            onClick={() => onSelect(pr.owner, pr.name, pr.number.toString())}
            className="bg-gray-700 rounded-lg p-4 text-left hover:bg-gray-600 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <GitPullRequest className="w-4 h-4 text-green-400" />
                <span>#{pr.number}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {formatDate(pr.date)}
                </span>
              </div>
            </div>
            
            <h4 className="text-gray-200 font-medium mb-3 line-clamp-2 group-hover:text-white transition-colors">
              {pr.title}
            </h4>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {pr.owner}/{pr.name}
              </div>
              <div className="flex items-center space-x-2">
                {pr.sender_avatar ? (
                  <img
                    src={pr.sender_avatar}
                    alt={pr.sender}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <span className="text-sm text-gray-400">{pr.sender}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}