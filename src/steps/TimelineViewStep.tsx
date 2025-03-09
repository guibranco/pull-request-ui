/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Loader2, GitPullRequest, GitFork } from 'lucide-react';
import { MermaidDiagram } from '../components/timeline/MermaidDiagram';
import { EventList } from '../components/timeline/EventList';
import { PayloadModal } from '../components/timeline/PayloadModal';
import { RefreshButton } from '../components/timeline/RefreshButton';
import { MessageDisplay } from '../components/timeline/MessageDisplay';
import { ApiService } from '../services/api';
import type { Event, PullRequest } from '../types';

interface TimelineViewStepProps {
  apiKey: string;
  repo: string;
  pr: string;
  onBack: () => void;
}

export function TimelineViewStep({ apiKey, repo, pr, onBack }: Readonly<TimelineViewStepProps>) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pullRequestInfo, setPullRequestInfo] = useState<PullRequest | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('expandedEventTypes');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [selectedPayload, setSelectedPayload] = useState<any>(null);
  const [isSequenceExpanded, setIsSequenceExpanded] = useState(() => {
    const saved = localStorage.getItem('isSequenceExpanded');
    return saved ? JSON.parse(saved) : true;
  });
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(() => {
    const saved = localStorage.getItem('isTimelineExpanded');
    return saved ? JSON.parse(saved) : true;
  });

  const fetchPullRequestInfo = useCallback(async () => {
    if (!repo || !pr) return;
    
    const api = new ApiService(apiKey);
    try {
      const [owner, repository] = repo.split('/');
      const data = await api.getPullRequests(owner, repository);
      const prInfo = data.pull_requests.find(p => p.number.toString() === pr);
      if (prInfo) {
        setPullRequestInfo(prInfo);
      }
    } catch (err) {
      console.error('Error fetching PR info:', err);
    }
  }, [apiKey, repo, pr]);

  const fetchEvents = useCallback(async () => {
    if (!repo || !pr) return;
    
    const api = new ApiService(apiKey);
    setLoading(true);
    setError(null);
    try {
      const [owner, repository] = repo.split('/');
      const data = await api.getEvents(owner, repository, pr);
      
      const sortedEvents = [...data.events].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setEvents(sortedEvents);

      if (sortedEvents.length === 0) {
        setError('No events found for this pull request');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      console.error('Pull requests error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiKey, repo, pr]);

  useEffect(() => {
    fetchEvents();
    fetchPullRequestInfo();
  }, [fetchEvents, fetchPullRequestInfo]);

  const handleRefresh = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      localStorage.setItem('expandedEventTypes', JSON.stringify([...newExpanded]));
      return newExpanded;
    });
  };

  const handleSequenceToggle = () => {
    setIsSequenceExpanded(prev => {
      const newValue = !prev;
      localStorage.setItem('isSequenceExpanded', JSON.stringify(newValue));
      return newValue;
    });
  };

  const handleTimelineToggle = () => {
    setIsTimelineExpanded(prev => {
      const newValue = !prev;
      localStorage.setItem('isTimelineExpanded', JSON.stringify(newValue));
      return newValue;
    });
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <MessageDisplay
        type="error"
        message={error}
        onAction={onBack}
        actionLabel="Go Back"
      />
    );
  }

  const hasEvents = events.length > 0;

  if (!hasEvents) {
    return (
      <MessageDisplay
        type="info"
        message="No events found for this pull request"
        onAction={onBack}
        actionLabel="Go Back"
      />
    );
  }

  const [owner, repository] = repo.split('/');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Select Data
        </button>

        <RefreshButton 
          onRefresh={handleRefresh}
          isLoading={loading}
        />
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-300">
              <GitFork className="w-5 h-5" />
              <span className="text-lg">
                <span className="text-blue-400">{owner}</span>
                <span className="mx-1">/</span>
                <span className="text-blue-400">{repository}</span>
              </span>
            </div>
            
            {pullRequestInfo && (
              <div className="flex items-center space-x-2">
                <GitPullRequest className="w-5 h-5 text-green-400" />
                <span className="text-xl font-medium text-gray-100">
                  #{pr} {pullRequestInfo.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <MermaidDiagram 
        events={events} 
        isExpanded={isSequenceExpanded}
        onToggle={handleSequenceToggle}
      />
      
      <EventList
        events={events}
        expandedItems={expandedItems}
        onToggleExpand={toggleExpand}
        onViewPayload={setSelectedPayload}
        isExpanded={isTimelineExpanded}
        onToggle={handleTimelineToggle}
      />

      {selectedPayload && (
        <PayloadModal
          payload={selectedPayload}
          onClose={() => setSelectedPayload(null)}
        />
      )}
    </div>
  );
}