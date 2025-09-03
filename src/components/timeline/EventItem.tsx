import React from 'react';
import { Calendar, Code, User } from 'lucide-react';
import { Event } from '../../types';

interface EventItemProps {
  readonly event: Event;
  readonly onViewPayload: (payload: Record<string, unknown>) => void;
}

export function EventItem({ event, onViewPayload }: Readonly<EventItemProps>) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getEventId = (event: Event): string => {
    if (event.payload.issue?.id) {
      return `#${event.payload.issue.id}`;
    } else if (event.payload.pull_request?.id) {
      return `#${event.payload.pull_request.id}`;
    } else if (event.payload.comment?.id) {
      return `#${event.payload.comment.id}`;
    } else if (event.payload.review?.id) {
      return `#${event.payload.review.id}`;
    } else if (event.payload.check_run?.id) {
      return `#${event.payload.check_run.id}`;
    } else if (event.payload.check_suite?.id) {
      return `#${event.payload.check_suite.id}`;
    } else if (event.payload.workflow_run?.id) {
      return `#${event.payload.workflow_run.id}`;
    } else if (event.payload.workflow_job?.id) {
      return `#${event.payload.workflow_job.id}`;
    } else if (event.payload.release?.id) {
      return `#${event.payload.release.id}`;
    }
    return '';
  };

  const getEventConclusion = (
    event: Event
  ): { text: string; color: string } | null => {
    const conclusion =
      event.payload.check_run?.conclusion ||
      event.payload.check_suite?.conclusion ||
      event.payload.status?.state ||
      event.payload.review?.state ||
      event.payload.workflow_run?.conclusion ||
      event.payload.workflow_job?.conclusion;

    if (!conclusion) {
      const status =
        event.payload.workflow_run?.status ||
        event.payload.workflow_job?.status ||
        event.payload.check_suite?.status ||
        event.payload.check_run?.status;

      if (status) {
        switch (status.toLowerCase()) {
          case 'completed':
            return { text: 'Completed', color: 'bg-green-400 text-green-900' };
          case 'in_progress':
            return {
              text: 'In Progress',
              color: 'bg-yellow-400 text-yellow-900',
            };
          case 'queued':
            return { text: 'Queued', color: 'bg-blue-400 text-blue-900' };
          case 'waiting':
            return { text: 'Waiting', color: 'bg-purple-400 text-purple-900' };
          default:
            return { text: status, color: 'bg-blue-400 text-blue-900' };
        }
      }
      return null;
    }

    switch (conclusion.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'approved':
        return { text: conclusion, color: 'bg-green-400 text-green-900' };
      case 'failure':
      case 'failed':
      case 'changes_requested':
        return { text: conclusion, color: 'bg-red-400 text-red-900' };
      case 'cancelled':
      case 'timed_out':
      case 'dismissed':
        return { text: conclusion, color: 'bg-gray-400 text-gray-900' };
      case 'neutral':
      case 'pending':
      case 'queued':
      case 'in_progress':
        return { text: conclusion, color: 'bg-yellow-400 text-yellow-900' };
      case 'skipped':
      case 'stale':
        return { text: conclusion, color: 'bg-purple-400 text-purple-900' };
      default:
        return { text: conclusion, color: 'bg-blue-400 text-blue-900' };
    }
  };

  const conclusion = getEventConclusion(event);

  return (
    <div className="border-l-2 border-gray-700 pl-6 py-4 ml-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-400">
              {getEventId(event)}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-base text-gray-300">
              {formatDate(event.date)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {conclusion && (
            <span
              className={`px-2 py-1 rounded-sm text-sm font-medium ${conclusion.color}`}
            >
              {conclusion.text}
            </span>
          )}
          <span className="text-base font-medium text-blue-400">
            {event.action}
          </span>
        </div>
      </div>

      {event.payload.sender && (
        <div className="flex items-center space-x-3 mb-3">
          {event.payload.sender.avatar_url ? (
            <img
              src={event.payload.sender.avatar_url}
              alt={`${event.payload.sender.login}'s avatar`}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <span className="text-sm text-gray-300">
            {event.payload.sender.login}
          </span>
        </div>
      )}

      <div className="flex items-center justify-end mt-3">
        <button
          onClick={() => onViewPayload(event.payload)}
          className="text-base text-blue-400 hover:text-blue-300 flex items-center transition-colors"
        >
          <Code className="w-5 h-5 mr-2" />
          View Payload
        </button>
      </div>
    </div>
  );
}
