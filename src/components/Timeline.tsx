import { TimelineEventRow } from "./TimelineEventRow";

const Timeline: React.FC<TimelineProps> = ({ events }) => {
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
            <TimelineEventRow key={event.id} event={event} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timeline;