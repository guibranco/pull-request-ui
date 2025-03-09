import { ChevronDown, ChevronRight } from 'lucide-react';
import { Event } from '../../types';
import { EventTimeline } from './EventTimeline';
import { EventItem } from './EventItem';

interface EventListProps {
  events: Event[];
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewPayload: (payload: any) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EventList({ events, expandedItems, onToggleExpand, onViewPayload, isExpanded, onToggle }: EventListProps) {
  // Group events by type
  const eventsByType = events.reduce((acc, event) => {
    if (!acc[event.type]) {
      acc[event.type] = [];
    }
    acc[event.type].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const totalEvents = events.length;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg w-full overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <h3 className="text-2xl font-medium text-gray-100">
            Event Timeline
          </h3>
          <span className="text-gray-400 text-lg">
            ({totalEvents} event{totalEvents !== 1 ? 's' : ''})
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronRight className="w-6 h-6 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 pt-0 space-y-6">
          {Object.entries(eventsByType).map(([type, typeEvents]) => (
            <div key={type} className="border border-gray-700 rounded-lg p-6">
              <button
                className="flex items-center w-full text-left"
                onClick={() => onToggleExpand(type)}
              >
                {expandedItems.has(type) ? (
                  <ChevronDown className="w-6 h-6 mr-3" />
                ) : (
                  <ChevronRight className="w-6 h-6 mr-3" />
                )}
                <span className="text-lg font-medium">{type}</span>
                <span className="ml-3 text-gray-400 text-base">
                  ({typeEvents.length} event{typeEvents.length !== 1 ? 's' : ''})
                </span>
              </button>

              {expandedItems.has(type) && (
                <div className="mt-6 space-y-6">
                  <EventTimeline events={typeEvents} onViewPayload={onViewPayload} />
                  
                  {typeEvents.map((event) => (
                    <EventItem
                      key={event.delivery_id}
                      event={event}
                      onViewPayload={onViewPayload}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}