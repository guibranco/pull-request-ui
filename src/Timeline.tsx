import { TimelineEventRow } from "./TimelineEventRow";

/**
 * A functional component that renders a timeline of events.
 *
 * This component displays a table containing a list of events, each with associated actions, dates, details, and check suite information.
 *
 * @component
 * @param {TimelineProps} props - The properties for the Timeline component.
 * @param {Array<Event>} props.events - An array of event objects to be displayed in the timeline.
 * @returns {JSX.Element} A JSX element representing the rendered timeline.
 *
 * @example
 * const events = [
 *   { action: 'Created', date: '2023-01-01', details: 'Initial commit', checkSuite: 'Passed' },
 *   { action: 'Updated', date: '2023-01-02', details: 'Added new feature', checkSuite: 'Failed' },
 * ];
 *
 * <Timeline events={events} />
 *
 * @throws {Error} Throws an error if the events prop is not an array.
 */
export const Timeline: React.FC<TimelineProps> = ({ events }) => {
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
          {events.map((event, index) => (
            <TimelineEventRow key={index} event={event} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

