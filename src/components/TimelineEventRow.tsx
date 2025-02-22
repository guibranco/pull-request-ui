/**
 * A functional component that renders a row in a timeline event table.
 * Displays various details about an event, including its type, action,
 * status, date, title or name, and check suite ID. Also includes a button
 * to view the payload of the event.
 *
 * @param {Object} props - The properties for the component.
 * @param {TimelineEventRowProps} props.event - The event object containing
 *        details to be displayed in the row.
 * @param {Function} props.onViewPayload - A callback function that is called
 *        when the "View Payload" button is clicked.
 *
 * @returns {JSX.Element} A table row element containing event details.
 *
 * @example
 * const event = {
 *   type: 'push',
 *   action: 'created',
 *   payload: {
 *     workflow_job: { status: 'completed' },
 *     check_suite: { id: '12345' },
 *     title: 'New Feature',
 *   },
 *   date: '2023-10-01T12:00:00Z'
 * };
 *
 * const handleViewPayload = () => {
 *   console.log('Viewing payload');
 * };
 *
 * <TimelineEventRow event={event} onViewPayload={handleViewPayload} />
 */
const TimelineEventRow: React.FC<TimelineEventRowProps & { onViewPayload: () => void }> = ({ event, onViewPayload }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = event.payload[event.type as keyof EventPayload] as any;

  return (
      <tr className="odd:bg-white even:bg-gray-50">
          <td className="border border-gray-300 px-4 py-2">{event.type}</td>
          <td className="border border-gray-300 px-4 py-2">{event.action}</td>
          <td className="border border-gray-300 px-4 py-2">{event.payload.workflow_job?.status ?? "N/A"}</td>
          <td className="border border-gray-300 px-4 py-2">{new Date(event.date).toLocaleString()}</td>
          <td className="border border-gray-300 px-4 py-2">
              <pre className="overflow-x-auto text-sm bg-gray-100 p-2 rounded">{data?.title ?? data?.name ?? ''}</pre>
          </td>
          <td className="border border-gray-300 px-4 py-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={onViewPayload}>
                  View Payload
              </button>
          </td>
      </tr>
  );
};

export default TimelineEventRow;
