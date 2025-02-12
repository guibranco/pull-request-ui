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
            <tr key={index} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{event.type}</td>
              <td className="border border-gray-300 px-4 py-2">{event.action}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(event.date).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <pre className="overflow-x-auto text-sm bg-gray-100 p-2 rounded">{event.payload[event.type]?.title ?? event.payload[event.type]?.name ?? ''}</pre>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {event.payload.check_suite?.id ?? event.payload[event.type]?.check_suite?.id ?? ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};