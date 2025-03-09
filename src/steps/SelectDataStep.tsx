import React, { useState, useEffect } from 'react';
import { GitFork, Loader2, ArrowLeft } from 'lucide-react';
import { RepositorySelect } from '../components/select-data/RepositorySelect';
import { PullRequestSelect } from '../components/select-data/PullRequestSelect';
import { ApiService } from '../services/api';
import type { Repository, PullRequest } from '../types';

interface SelectDataStepProps {
  apiKey: string;
  onSelect: (repo: string, pr: string) => void;
}

export function SelectDataStep({ apiKey, onSelect }: Readonly<SelectDataStepProps>) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [selectedPR, setSelectedPR] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepositories() {
      setLoading(true);
      setError(null);
      try {
        const api = new ApiService(apiKey);
        const data = await api.getRepositories();
        setRepositories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRepositories();
  }, [apiKey]);

  useEffect(() => {
    async function fetchPullRequests() {
      if (!selectedRepo) return;

      setLoading(true);
      setError(null);
      setPullRequests([]);

      try {
        const api = new ApiService(apiKey);
        const [owner, repo] = selectedRepo.split('/');
        const data = await api.getPullRequests(owner, repo);
        setPullRequests(data.pull_requests);
        
        if (data.pull_requests.length === 0) {
          setError('No pull requests found for this repository');
        }
      } catch (err) {
        console.error('Pull requests error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch pull requests');
        setPullRequests([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPullRequests();
  }, [selectedRepo, apiKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect(selectedRepo, selectedPR);
  };

  const handleLogout = () => {
    localStorage.removeItem('apiKey');
    window.location.reload();
  };

  const handleRepoChange = (repo: string) => {
    setSelectedRepo(repo);
    setSelectedPR('');
    setPullRequests([]);
    setError(null);
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="text-red-400 text-center mb-4">
            <p>{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setLoading(false);
              if (!selectedRepo) {
                window.location.reload();
              } else {
                setSelectedPR('');
                setPullRequests([]);
              }
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-900 rounded-full mx-auto mb-4">
          <GitFork className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">
          Select Repository and Pull Request
        </h2>
        <form onSubmit={handleSubmit}>
          <RepositorySelect
            repositories={repositories}
            selectedRepo={selectedRepo}
            onChange={handleRepoChange}
            disabled={loading}
          />

          {selectedRepo && (
            <PullRequestSelect
              pullRequests={pullRequests}
              selectedPR={selectedPR}
              onChange={setSelectedPR}
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
              onClick={handleLogout}
              className="w-full flex items-center justify-center text-gray-300 hover:text-gray-100 py-2 px-4 rounded-md border border-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to API Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}