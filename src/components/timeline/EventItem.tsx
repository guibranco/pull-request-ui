import { Calendar, Code, User } from 'lucide-react';
import { Event } from '../../types';

interface EventItemProps {
  event: Event;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewPayload: (payload: any) => void;
}

export function EventItem({ event, onViewPayload }: EventItemProps) {
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
        <span className="text-base font-medium text-blue-400">
          {event.action}
        </span>
      </div>
      
      {event.payload.sender && (
        <div className="flex items-center space-x-3 mt-2 mb-3">
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