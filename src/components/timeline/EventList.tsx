/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Event } from '../../types';
import { EventTimeline } from './EventTimeline';
import { EventItem } from './EventItem';
import { PayloadModal } from './PayloadModal';
import { orderBy } from 'lodash-es';

interface EventListProps {
  events: Event[];
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Renders a list of events grouped by type, allowing users to expand and collapse sections,
 * select events for comparison, and view payloads.
 *
 * @param {Object} props - The properties for the EventList component.
 * @param {Event[]} props.events - An array of events to display.
 * @param {Set<string>} props.expandedItems - A set of currently expanded item types.
 * @param {Function} props.onToggleExpand - Callback function to handle expanding or collapsing an event type.
 * @param {boolean} props.isExpanded - Indicates if the event list is currently expanded.
 * @param {Function} props.onToggle - Callback function to toggle the visibility of the event list.
 *
 * @returns {JSX.Element} The rendered EventList component.
 *
 * @throws {Error} Throws an error if the events prop is not an array.
 */
export function EventList({ events, expandedItems, onToggleExpand, isExpanded, onToggle }: Readonly<EventListProps>) {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showingPayload, setShowingPayload] = useState<{
    payload: any;
    comparePayload?: any;
  } | null>(null);

  // Group events by type and sort the types alphabetically
  const eventsByType = events.reduce((acc, event) => {
    if (!acc[event.type]) {
      acc[event.type] = [];
    }
    acc[event.type].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Sort events within each type by date
  Object.keys(eventsByType).forEach(type => {
    eventsByType[type] = orderBy(eventsByType[type], ['date'], ['asc']);
  });

  // Get sorted type entries
  const sortedTypeEntries = orderBy(
    Object.entries(eventsByType),
    [([type]) => type.toLowerCase()],
    ['asc']
  );

  const totalEvents = events.length;
  const totalTypes = sortedTypeEntries.length;

  const handleEventSelect = (event: Event) => {
    const eventId = `${event.delivery_id}-${event.type}-${event.action}`;
    setSelectedEvents(prev => {
      let newSelected;
      if (prev.includes(eventId)) {
        newSelected = prev.filter(id => id !== eventId);
      } else if (prev.length < 2) {
        newSelected = [...prev, eventId];
      } else {
        newSelected = [prev[1], eventId];
      }

      // If we have exactly 2 items selected, automatically show the compare modal
      if (newSelected.length === 2) {
        const selectedPayloads = events
          .filter(e => newSelected.includes(`${e.delivery_id}-${e.type}-${e.action}`))
          .map(e => e.payload);
        setShowingPayload({ 
          payload: selectedPayloads[0],
          comparePayload: selectedPayloads[1]
        });
      } else {
        setShowingPayload(null);
      }

      return newSelected;
    });
  };

  const handleViewPayload = (payload: any) => {
    if (selectedEvents.length === 2) {
      // If two items are selected, do nothing when clicking view payload
      return;
    }
    
    setShowingPayload({ payload });
  };

  const handleCompare = (payload: any) => {
    const selectedEvent = events.find(e => 
      selectedEvents.includes(`${e.delivery_id}-${e.type}-${e.action}`)
    );

    if (selectedEvent) {
      setShowingPayload({
        payload,
        comparePayload: selectedEvent.payload
      });
    }
  };

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
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
              {totalEvents} event{totalEvents !== 1 ? 's' : ''}
            </span>
            <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
              {totalTypes} type{totalTypes !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronRight className="w-6 h-6 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 pt-0 space-y-6">
          {sortedTypeEntries.map(([type, typeEvents]) => (
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
                  <EventTimeline events={typeEvents} onViewPayload={handleViewPayload} />
                  
                  {typeEvents.map((event) => {
                    const eventId = `${event.delivery_id}-${event.type}-${event.action}`;
                    const isSelected = selectedEvents.includes(eventId);
                    return (
                      <div key={event.delivery_id} className="flex items-start space-x-4">
                        <div className="relative flex items-center group">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleEventSelect(event)}
                            className="peer"
                            id={eventId}
                          />
                          <label 
                            htmlFor={eventId}
                            className="absolute inset-0 cursor-pointer"
                          />
                          <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 peer-focus:opacity-100 transition-opacity bg-blue-500/10 pointer-events-none" />
                        </div>
                        <div className="flex-1">
                          <EventItem
                            event={event}
                            onViewPayload={handleViewPayload}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showingPayload && (
        <PayloadModal
          payload={showingPayload.payload}
          comparePayload={showingPayload.comparePayload}
          onClose={() => setShowingPayload(null)}
          onCompare={handleCompare}
          selectedCount={selectedEvents.length}
        />
      )}
    </div>
  );
}