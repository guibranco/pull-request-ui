import React, { useState, useEffect, useCallback } from 'react';
import { SelectForm } from '../components/select-data/SelectForm';
import { ErrorMessage } from '../components/select-data/ErrorMessage';
import { RecentPullRequests } from '../components/select-data/RecentPullRequests';
import { ApiService } from '../services/api';
import type { Repository, PullRequest, RecentPullRequest } from '../types';

interface SelectDataStepProps {
  apiKey: string;
  onSelect: (repo: string, pr: string) => void;
}

export function SelectDataStep({ apiKey, onSelect }: SelectDataStepProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [recentPullRequests, setRecentPullRequests] = useState<RecentPullRequest[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [selectedPR, setSelectedPR] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentPullRequests = useCallback(async () => {
    setLoadingRecent(true);
    try {
      const api = new ApiService(apiKey);
      const data = await api.getRecentPullRequests();
      setRecentPullRequests(data);
    } catch (err) {
      console.error('Recent PRs error:', err);
    } finally {
      setLoadingRecent(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchRecentPullRequests();
    const interval = setInterval(fetchRecentPullRequests, 30000);
    return () => clearInterval(interval);
  }, [fetchRecentPullRequests]);

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

  const handleRecentSelect = (owner: string, repo: string, pr: string) => {
    const fullName = `${owner}/${repo}`;
    setSelectedRepo(fullName);
    setSelectedPR(pr);
    onSelect(fullName, pr);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(false);
    if (!selectedRepo) {
      window.location.reload();
    } else {
      setSelectedPR('');
      setPullRequests([]);
    }
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <SelectForm
        repositories={repositories}
        pullRequests={pullRequests}
        selectedRepo={selectedRepo}
        selectedPR={selectedPR}
        loading={loading}
        onRepoChange={handleRepoChange}
        onPRChange={setSelectedPR}
        onSubmit={handleSubmit}
        onLogout={handleLogout}
      />

      <RecentPullRequests
        pullRequests={recentPullRequests}
        onSelect={handleRecentSelect}
        loading={loadingRecent}
      />
    </div>
  );
}