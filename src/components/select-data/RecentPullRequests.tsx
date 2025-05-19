import React, { useState } from 'react';
import { GitPullRequest, Clock, User, ExternalLink } from 'lucide-react';
import { RecentPullRequest } from '../../types';

interface RecentPullRequestsProps {
  pullRequests: RecentPullRequest[];
  onSelect: (owner: string, repo: string, pr: string) => void;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function RecentPullRequests({ pullRequests, onSelect, loading, error, onRetry }: RecentPullRequestsProps) {
  const [showOpenOnly, setShowOpenOnly] = useState(() => {
    const saved = localStorage.getItem('showOpenPRsOnly');
    return saved ? JSON.parse(saved) : true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleOpenOnly = () => {
    setShowOpenOnly(prev => {
      const newValue = !prev;
      localStorage.setItem('showOpenPRsOnly', JSON.stringify(newValue));
      return newValue;
    });
  };

  const filteredPullRequests = showOpenOnly 
    ? pullRequests.filter(pr => pr.state === 'OPEN')
    : pullRequests;

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
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer" onClick={handleToggleOpenOnly}>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showOpenOnly ? 'bg-green-600' : 'bg-gray-600'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showOpenOnly ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm text-gray-300">Show Open Only</span>
          </label>
          <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
            {filteredPullRequests.length} PR{filteredPullRequests.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredPullRequests.map((pr) => {
          const githubUrl = `https://github.com/${pr.owner}/${pr.name}/pull/${pr.number}`;
          
          return (
            <div
              key={`${pr.owner}/${pr.name}#${pr.number}`}
              className="bg-gray-700 rounded-lg p-4 text-left hover:bg-gray-600 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <GitPullRequest className={`w-4 h-4 ${pr.state === 'OPEN' ? 'text-green-400' : 'text-red-400'} shrink-0`} />
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
              
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="text-sm text-gray-400 break-all">
                  <span className="inline-block max-w-[200px] truncate">
                    {pr.owner}/{pr.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {pr.sender_avatar ? (
                    <img
                      src={pr.sender_avatar}
                      alt={pr.sender}
                      className="w-6 h-6 rounded-full shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <span className="text-sm text-gray-400 truncate max-w-[100px]">
                    {pr.sender}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => onSelect(pr.owner, pr.name, pr.number.toString())}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  View Timeline
                </button>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-colors text-sm"
                  onClick={e => e.stopPropagation()}
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}