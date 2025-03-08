import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { MermaidDiagram } from '../components/timeline/MermaidDiagram';
import { EventList } from '../components/timeline/EventList';
import { PayloadModal } from '../components/timeline/PayloadModal';
import { RefreshButton } from '../components/timeline/RefreshButton';
import { ApiService } from '../services/api';
import type { Event } from '../types';

interface TimelineViewStepProps {
  apiKey: string;
  repo: string;
  pr: string;
  onBack: () => void;
}

export function TimelineViewStep({ apiKey, repo, pr, onBack }: TimelineViewStepProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  }, [fetchEvents]);

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

  // Create a reusable component for message displays
  const MessageDisplay = ({ 
    title, 
    message, 
    isError = false,
    onBack 
  }: {
    title?: string;
    message: string;
    isError?: boolean;
    onBack: () => void;
  }) => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        {title && <h3 className="text-xl text-gray-100 mb-4">{title}</h3>}
        <div className={`text-center mb-4 ${isError ? 'text-red-400' : 'text-gray-300'}`}>
          <p>{message}</p>
        </div>
        <button
          onClick={onBack}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Go Back
        </button>
      </div>
    </div>
  );
  
  // Handle loading state
  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }
  
  // Handle error or no events
  if ((error && events.length === 0) || events.length === 0) {
    return (
      <MessageDisplay
        message={error || "No events found for this pull request"}
        isError={!!error}
        onBack={onBack}
      />
    );
  }

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