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
          <td className="border border-gray-300 px-4 py-2">{event.payload.check_suite?.id ?? "N/A"}</td>
          <td className="border border-gray-300 px-4 py-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={onViewPayload}>
                  View Payload
              </button>
          </td>
      </tr>
  );
};

export default TimelineEventRow;
