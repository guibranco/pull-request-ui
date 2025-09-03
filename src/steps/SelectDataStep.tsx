import React, { useState, useEffect, useCallback } from 'react';
import { SelectForm } from '../components/select-data/SelectForm';
import { ErrorMessage } from '../components/select-data/ErrorMessage';
import { RecentPullRequests } from '../components/select-data/RecentPullRequests';
import { RefreshButton } from '../components/select-data/RefreshButton';
import { ApiService } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import type { Repository, PullRequest, RecentPullRequest } from '../types';

interface SelectDataStepProps {
  apiKey: string;
  onSelect: (repo: string, pr: string) => void;
  preselectedRepo?: string;
}

export function SelectDataStep({
  apiKey,
  onSelect,
  preselectedRepo,
}: SelectDataStepProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [recentPullRequests, setRecentPullRequests] = useState<
    RecentPullRequest[]
  >([]);
  const [selectedRepo, setSelectedRepo] = useState(preselectedRepo || '');
  const [selectedPR, setSelectedPR] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentError, setRecentError] = useState<string | null>(null);

  const handleUnauthorized = (message: string) => {
    localStorage.removeItem('apiKey');
    const errorParam = encodeURIComponent(message);
    window.location.href = `${window.location.pathname}?error=${errorParam}`;
  };

  const fetchRecentPullRequests = useCallback(async () => {
    setLoadingRecent(true);
    setRecentError(null);
    try {
      const api = new ApiService(apiKey);
      const data = await api.getRecentPullRequests();
      setRecentPullRequests(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to fetch recent pull requests';
      if (errorMessage.includes('403')) {
        setRecentError(
          'Your API key does not have permission to access recent pull requests.'
        );
      } else {
        setRecentError(errorMessage);
      }
      setRecentPullRequests([]);
    } finally {
      setLoadingRecent(false);
    }
  }, [apiKey]);

  const fetchRepositories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const api = new ApiService(apiKey);
      const data = await api.getRepositories();
      setRepositories(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch repositories';
      if (errorMessage.includes('403')) {
        handleUnauthorized(
          'Your API key is invalid or has expired. Please enter a valid API key.'
        );
        return;
      }
      setError(errorMessage);
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const fetchPullRequests = useCallback(async () => {
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
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch pull requests';
      if (errorMessage.includes('403')) {
        handleUnauthorized(
          'Your API key is invalid or has expired. Please enter a valid API key.'
        );
        return;
      }
      setError(errorMessage);
      setPullRequests([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRepo, apiKey]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      fetchRepositories(),
      selectedRepo && fetchPullRequests(),
      fetchRecentPullRequests(),
    ]);
  }, [
    fetchRepositories,
    fetchPullRequests,
    fetchRecentPullRequests,
    selectedRepo,
  ]);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  useEffect(() => {
    fetchPullRequests();
  }, [fetchPullRequests]);

  useEffect(() => {
    fetchRecentPullRequests();
  }, [fetchRecentPullRequests]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect(selectedRepo, selectedPR);
  };

  const handleBackToApiKey = () => {
    window.location.hash = '#/api-key';
  };

  const handleRepoChange = (repo: string) => {
    setSelectedRepo(repo);
    setSelectedPR('');
    setPullRequests([]);
    setError(null);

    // Update hash with repository info
    if (repo) {
      const [owner, repoName] = repo.split('/');
      window.location.hash = `${owner}/${repoName}`;
    } else {
      window.location.hash = '';
    }
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

  const handleRetryRecent = () => {
    setRecentError(null);
    fetchRecentPullRequests();
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackToApiKey}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to API Key
        </button>

        <RefreshButton
          onRefresh={handleRefresh}
          isLoading={loading || loadingRecent}
        />
      </div>

      <SelectForm
        repositories={repositories}
        pullRequests={pullRequests}
        selectedRepo={selectedRepo}
        selectedPR={selectedPR}
        loading={loading}
        onRepoChange={handleRepoChange}
        onPRChange={setSelectedPR}
        onSubmit={handleSubmit}
      />

      <RecentPullRequests
        pullRequests={recentPullRequests}
        onSelect={handleRecentSelect}
        loading={loadingRecent}
        error={recentError}
        onRetry={handleRetryRecent}
      />
    </div>
  );
}
