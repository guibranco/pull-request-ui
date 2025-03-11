import { useState } from 'react';
import { Event } from '../../types';
import { BulletDiagram } from './BulletDiagram';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface EventTimelineProps {
  readonly events: readonly Event[];
  readonly onViewPayload: (payload: Record<string, unknown>) => void;
}

export function EventTimeline({ events, onViewPayload }: Readonly<EventTimelineProps>) {
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('isBulletDiagramExpanded');
    return saved ? JSON.parse(saved) : true;
  });

  // Group events by their payload event ID
  const eventsByPayloadId = events.reduce((acc, event) => {
    // Extract the ID from various payload types
    let eventId = null;
    if (event.type === 'issue_comment' && event.payload.comment?.id) {
      eventId = `comment_${event.payload.comment.id}`;
    } else if (event.payload.issue?.id) {
      eventId = `issue_${event.payload.issue.id}`;
    } else if (event.payload.pull_request?.id) {
      eventId = `pr_${event.payload.pull_request.id}`;
    } else if (event.payload.comment?.id) {
      eventId = `comment_${event.payload.comment.id}`;
    } else if (event.payload.review?.id) {
      eventId = `review_${event.payload.review.id}`;
    } else if (event.payload.check_run?.id) {
      eventId = `check_${event.payload.check_run.id}`;
    } else if (event.payload.check_suite?.id) {
      eventId = `suite_${event.payload.check_suite.id}`;
    } else if (event.payload.workflow_run?.id) {
      eventId = `workflow_${event.payload.workflow_run.id}`;
    } else if (event.payload.workflow_job?.id) {
      eventId = `job_${event.payload.workflow_job.id}`;
    } else if (event.payload.release?.id) {
      eventId = `release_${event.payload.release.id}`;
    }

    if (eventId) {
      if (!acc[eventId]) {
        acc[eventId] = [];
      }
      acc[eventId].push(event);
    }
    return acc;
  }, {} as Record<string, Event[]>);

  // Sort events within each ID by date
  Object.values(eventsByPayloadId).forEach(idEvents => {
    idEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  // Only show groups that have more than one event
  const relevantIds = Object.entries(eventsByPayloadId)
    .filter(([, events]) => events.length > 1)
    .map(([id]) => id);

  if (relevantIds.length === 0) {
    return null;
  }

  const handleToggle = () => {
    setIsExpanded(prev => {
      const newValue = !prev;
      localStorage.setItem('isBulletDiagramExpanded', JSON.stringify(newValue));
      return newValue;
    });
  };

  const getEventTitle = (events: Event[]): string => {
    const firstEvent = events[0];
    if (firstEvent.payload.issue) {
      return `Issue #${firstEvent.payload.issue.number}`;
    } else if (firstEvent.payload.pull_request) {
      return `PR #${firstEvent.payload.pull_request.number}`;
    } else if (firstEvent.payload.comment) {
      return 'Comment Thread';
    } else if (firstEvent.payload.review) {
      return 'Review Thread';
    } else if (firstEvent.payload.check_run) {
      return `Check: ${firstEvent.payload.check_run.name}`;
    } else if (firstEvent.payload.check_suite) {
      return 'Check Suite';
    } else if (firstEvent.payload.workflow_run) {
      return `Workflow: ${firstEvent.payload.workflow_run.name || firstEvent.payload.workflow_run.workflow_name || 'Unknown'}`;
    } else if (firstEvent.payload.workflow_job) {
      return `Job: ${firstEvent.payload.workflow_job.name || 'Unknown'}`;
    } else if (firstEvent.payload.release) {
      return `Release: ${firstEvent.payload.release.name || firstEvent.payload.release.tag_name || 'Unknown'}`;
    }
    return 'Event Sequence';
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <div className="flex items-center space-x-3">
          <div className="text-lg font-medium text-gray-300">
            Event Sequences
          </div>
          <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
            {relevantIds.length} group{relevantIds.length !== 1 ? 's' : ''}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-6">
          {relevantIds.map(id => (
            <div key={id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-300 font-medium">
                  {getEventTitle(eventsByPayloadId[id])}
                </div>
                <div className="text-xs text-gray-500">
                  #{id.split('_')[1]}
                </div>
              </div>
              <BulletDiagram
                events={eventsByPayloadId[id]}
                onViewPayload={onViewPayload}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}