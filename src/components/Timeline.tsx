import { TimelineEventRow } from "./TimelineEventRow";

/**
 * A functional component that renders a timeline of events in a table format.
 *
 * @component
 * @param {TimelineEventProps} props - The properties for the Timeline component.
 * @param {Array<TimelineEvent>} props.events - An array of event objects to be displayed in the timeline.
 *
 * @returns {JSX.Element} A JSX element representing the rendered timeline of events.
 *
 * @example
 * const events = [
 *   { delivery_id: '1', action: 'Delivered', date: '2023-01-01', details: 'Package delivered successfully', checkSuite: 'Passed' },
 *   { delivery_id: '2', action: 'Pending', date: '2023-01-02', details: 'Awaiting confirmation', checkSuite: 'Pending' }
 * ];
 *
 * <Timeline events={events} />
 *
 * @throws {Error} Throws an error if the events prop is not an array.
 */
const Timeline: React.FC<TimelineEventProps> = ({ events }) => {
  return (
    <div className="relative bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Events Timeline
      </h2>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Event</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Details</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Check Suite</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <TimelineEventRow key={event.delivery_id} event={event} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timeline;