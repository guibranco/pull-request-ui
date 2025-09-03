import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GitPullRequest, Search, User, ChevronDown } from 'lucide-react';
import { PullRequest } from '../../types';

interface PullRequestSelectProps {
  readonly pullRequests: readonly PullRequest[];
  readonly selectedPR: string;
  readonly onChange: (pr: string) => void;
  readonly disabled: boolean;
}

export function PullRequestSelect({
  pullRequests,
  selectedPR,
  onChange,
  disabled,
}: Readonly<PullRequestSelectProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredPullRequests = useMemo(() => {
    if (!searchQuery) return pullRequests;

    const query = searchQuery.toLowerCase();
    return pullRequests.filter(
      pr =>
        pr.title.toLowerCase().includes(query) ||
        pr.number.toString().includes(query) ||
        pr.sender.toLowerCase().includes(query)
    );
  }, [pullRequests, searchQuery]);

  const selectedPullRequest = useMemo(
    () => pullRequests.find(pr => pr.number.toString() === selectedPR),
    [pullRequests, selectedPR]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mb-6">
      <label
        htmlFor="pullRequest"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Pull Request
      </label>
      <div className="relative" ref={dropdownRef}>
        <div
          className={`relative cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <div
            className={`w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm
              focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${selectedPR ? 'text-gray-100' : 'text-gray-400'}`}
          >
            {selectedPullRequest ? (
              <div className="flex items-center space-x-3">
                {selectedPullRequest.sender_avatar ? (
                  <img
                    src={selectedPullRequest.sender_avatar}
                    alt={selectedPullRequest.sender}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <span
                  className={
                    selectedPullRequest.state === 'OPEN'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  #{selectedPullRequest.number} - {selectedPullRequest.title}
                </span>
                <span className="text-gray-400">
                  ({selectedPullRequest.sender})
                </span>
              </div>
            ) : (
              'Select a pull request'
            )}
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <ChevronDown
              className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border-b border-gray-600 rounded-t-lg focus:outline-none text-gray-100"
              placeholder="Search pull requests..."
              onClick={e => e.stopPropagation()}
            />
            {filteredPullRequests.length === 0 ? (
              <div className="p-4 text-gray-400 text-center">
                No pull requests found
              </div>
            ) : (
              <div className="py-1">
                {filteredPullRequests.map(pr => (
                  <div
                    key={pr.number}
                    className={`px-4 py-2 hover:bg-gray-600 cursor-pointer ${
                      pr.number.toString() === selectedPR ? 'bg-gray-600' : ''
                    }`}
                    onClick={() => {
                      onChange(pr.number.toString());
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <div className="flex items-center space-x-3">
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
                      <span
                        className={
                          pr.state === 'OPEN'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
                      >
                        #{pr.number} - {pr.title}
                      </span>
                      <span className="text-gray-400">({pr.sender})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
