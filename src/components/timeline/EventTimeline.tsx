/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Event } from '../../types';
import { BulletDiagram } from './BulletDiagram';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface EventTimelineProps {
  events: Event[];
  onViewPayload: (payload: any) => void;
}

/**
 * Renders an event timeline component that displays a sequence of events.
 * The component allows users to toggle the visibility of the event details.
 *
 * @param {Readonly<EventTimelineProps>} props - The properties for the EventTimeline component.
 * @param {Event[]} props.events - An array of events to be displayed in the timeline.
 * @param {function} props.onViewPayload - A callback function to handle viewing the payload of an event.
 *
 * @returns {JSX.Element | null} Returns a JSX element representing the event timeline, or null if there are no relevant events.
 *
 * @throws {Error} Throws an error if the events cannot be processed correctly.
 */
export function EventTimeline({ events, onViewPayload }: Readonly<EventTimelineProps>) {
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('isBulletDiagramExpanded');
    return saved ? JSON.parse(saved) : true;
  });

  const eventsByPayloadId = events.reduce((acc, event) => {
    let eventId = null;
    if (event.payload.issue?.id) {
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

  Object.values(eventsByPayloadId).forEach(idEvents => {
    idEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  const relevantIds = Object.entries(eventsByPayloadId)
    .filter(([_, events]) => events.length > 1)
    .map(([id]) => id);

  if (relevantIds.length === 0) {
    return null;
  }

  /**
   * Toggles the expanded state of a diagram and stores the new state in local storage.
   *
   * This function updates the `isExpanded` state by negating its previous value.
   * It also saves the new state to local storage under the key 'isBulletDiagramExpanded'.
   *
   * @function handleToggle
   * @returns {void} This function does not return a value.
   *
   * @throws {Error} Throws an error if there is an issue accessing local storage.
   */
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