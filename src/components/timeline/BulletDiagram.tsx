import React from 'react';
import { Circle, User, Code, Globe } from 'lucide-react';
import { Event } from '../../types';
import { getAppAvatarUrl } from '../../utils/avatar';
import { groupEventsByPayloadId } from '../../utils/events';

interface BulletDiagramProps {
  readonly events: readonly Event[];
  readonly onViewPayload: (payload: Record<string, unknown>) => void;
}

export function BulletDiagram({
  events,
  onViewPayload,
}: Readonly<BulletDiagramProps>) {
  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getEventLabel = (event: Event): string => {
    if (event.payload.issue) {
      return `Issue ${event.action}`;
    } else if (event.payload.pull_request) {
      return `PR ${event.action}`;
    } else if (event.payload.comment) {
      return `Comment ${event.action}`;
    } else if (event.payload.review) {
      return `Review ${event.action}`;
    } else if (event.payload.check_run) {
      return `Check ${event.action}`;
    } else if (event.payload.check_suite) {
      return `Suite ${event.action}`;
    } else if (event.payload.workflow_run) {
      return `Workflow ${event.action}`;
    } else if (event.payload.workflow_job) {
      return `Job ${event.action}`;
    } else if (event.payload.release) {
      return `Release ${event.action}`;
    }
    return `${event.type}${event.action ? `: ${event.action}` : ''}`;
  };

  const getEventColor = (event: Event): string => {
    // Check for conclusion in various payload types
    const conclusion =
      event.payload.check_run?.conclusion ||
      event.payload.check_suite?.conclusion ||
      event.payload.status?.state ||
      event.payload.review?.state ||
      event.payload.workflow_run?.conclusion ||
      event.payload.workflow_job?.conclusion;

    if (!conclusion) {
      // Check for status in workflow events
      const status =
        event.payload.workflow_run?.status ||
        event.payload.workflow_job?.status;

      if (status) {
        switch (status.toLowerCase()) {
          case 'completed':
            return 'bg-green-400';
          case 'in_progress':
            return 'bg-yellow-400';
          case 'queued':
            return 'bg-blue-400';
          case 'waiting':
            return 'bg-purple-400';
          default:
            return 'bg-blue-400';
        }
      }

      // Special handling for release events
      if (event.type === 'release') {
        switch (event.action) {
          case 'published':
            return 'bg-green-400';
          case 'unpublished':
            return 'bg-red-400';
          case 'created':
            return 'bg-blue-400';
          case 'edited':
            return 'bg-yellow-400';
          case 'deleted':
            return 'bg-red-400';
          case 'prereleased':
            return 'bg-purple-400';
          case 'released':
            return 'bg-green-400';
          default:
            return 'bg-blue-400';
        }
      }

      return 'bg-blue-400';
    }

    switch (conclusion.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'approved':
        return 'bg-green-400';
      case 'failure':
      case 'failed':
      case 'changes_requested':
        return 'bg-red-400';
      case 'cancelled':
      case 'timed_out':
      case 'dismissed':
        return 'bg-gray-400';
      case 'neutral':
      case 'pending':
      case 'queued':
      case 'in_progress':
        return 'bg-yellow-400';
      case 'skipped':
      case 'stale':
        return 'bg-purple-400';
      default:
        return 'bg-blue-400';
    }
  };

  // Group events by their delivery ID to maintain order
  const groupedEvents = groupEventsByPayloadId(events);

  // Flatten grouped events back into a single array
  const sortedEvents = Object.values(groupedEvents)
    .flat()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full w-max">
        <div className="flex items-center space-x-2 min-h-[160px] py-4">
          {sortedEvents.map((event, index) => {
            const appData = event.payload[event.type]?.app;

            return (
              <React.Fragment
                key={`${event.delivery_id}-${event.type}-${event.action}`}
              >
                {index > 0 && (
                  <div className="h-[2px] w-16 bg-gray-700 relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                      →
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex flex-col items-center gap-2 mb-1">
                    {appData && (
                      <div className="flex flex-col items-center">
                        {appData.id ? (
                          <img
                            src={getAppAvatarUrl(appData.id)}
                            alt={`${appData.name}'s avatar`}
                            className="w-6 h-6 rounded-sm mb-1"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-sm bg-gray-700 flex items-center justify-center mb-1">
                            <Globe className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <span className="text-xs text-gray-400">
                          {appData.name}
                        </span>
                      </div>
                    )}
                    {event.payload.sender && (
                      <div className="flex flex-col items-center">
                        {event.payload.sender.avatar_url ? (
                          <img
                            src={event.payload.sender.avatar_url}
                            alt={`${event.payload.sender.login}'s avatar`}
                            className="w-6 h-6 rounded-full mb-1"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <span className="text-xs text-gray-400">
                          {event.payload.sender.login}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onViewPayload(event.payload)}
                    className="group flex flex-col items-center hover:scale-105 transition-transform"
                    title="View event payload"
                  >
                    <div
                      className={`w-4 h-4 ${getEventColor(event)} rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-blue-400 group-hover:ring-offset-1 group-hover:ring-offset-gray-900 transition-all`}
                    >
                      <Circle className="w-3 h-3 text-gray-900" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-gray-300 whitespace-nowrap group-hover:text-blue-400 transition-colors">
                        {getEventLabel(event)}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDateTime(event.date)}
                      </span>
                    </div>
                    <Code className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </button>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
