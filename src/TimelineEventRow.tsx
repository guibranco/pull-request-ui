/**
 * A functional component that renders a row in a timeline event table.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {TimelineEventRowProps} props.event - The event object containing details to display.
 *
 * @returns {JSX.Element} A table row element containing information about the event.
 *
 * @example
 * const event = {
 *   type: 'push',
 *   action: 'created',
 *   date: '2021-01-01T12:00:00Z',
 *   payload: {
 *     title: 'New Feature',
 *     check_suite: { id: 123 }
 *   }
 * };
 *
 * <TimelineEventRow event={event} />
 *
 * @throws {TypeError} If the event object does not conform to the expected structure.
 */
export const TimelineEventRow: React.FC<TimelineEventRowProps> = ({ event }) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = event.payload[event.type as keyof EventPayload] as any;

    return (<tr className="odd:bg-white even:bg-gray-50">
        <td className="border border-gray-300 px-4 py-2">{event.type}</td>
        <td className="border border-gray-300 px-4 py-2">{event.action}</td>
        <td className="border border-gray-300 px-4 py-2">
            {new Date(event.date).toLocaleString()}
        </td>
        <td className="border border-gray-300 px-4 py-2">
            <pre className="overflow-x-auto text-sm bg-gray-100 p-2 rounded">{data?.title ?? data?.name ?? ''}</pre>
        </td>
        <td className="border border-gray-300 px-4 py-2">
            {event.payload.check_suite?.id ?? data?.check_suite?.id ?? ''}
        </td>
    </tr>)
}