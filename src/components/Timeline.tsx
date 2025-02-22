import { useState } from "react";
import Diagram from "./Diagram";
import TimelineEventRow from "./TimelineEventRow";
import PayloadPanel from "./PayloadPanel";

/**
 * A React functional component that displays a timeline of events grouped by Check Suite, Workflow Run, and Workflow Job.
 *
 * @param {Object} props - The properties for the component.
 * @param {TimelineEvent[]} props.events - An array of timeline events to be displayed.
 *
 * @returns {JSX.Element} The rendered timeline component.
 *
 * @example
 * const events = [
 *   { payload: { check_suite: { id: 'suite1' }, workflow_run: { id: 'run1' }, workflow_job: { id: 'job1' } } },
 *   // more events...
 * ];
 *
 * <Timeline events={events} />
 */
const Timeline: React.FC<TimelineEventProps> = ({ events }) => {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [selectedPayload, setSelectedPayload] = useState<object | null>(null);

    // Function to toggle visibility of a group
    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    // Group events by Check Suite → Workflow Run → Workflow Job
    const groupedEvents = events.reduce((acc, event) => {
        const checkSuiteId = event.payload.check_suite?.id ?? "no-check-suite";
        const workflowRunId = event.payload.workflow_run?.id ?? "no-workflow-run";
        const workflowJobId = event.payload.workflow_job?.id ?? "no-workflow-job";

        if (!acc[checkSuiteId]) acc[checkSuiteId] = {};
        if (!acc[checkSuiteId][workflowRunId]) acc[checkSuiteId][workflowRunId] = {};
        if (!acc[checkSuiteId][workflowRunId][workflowJobId]) acc[checkSuiteId][workflowRunId][workflowJobId] = [];

        acc[checkSuiteId][workflowRunId][workflowJobId].push(event);

        return acc;
    }, {} as Record<string, Record<string, Record<string, TimelineEvent[]>>>);

    return (
        <div className="relative flex">
            {/* Main Content */}
            <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Events Timeline</h2>

                {Object.entries(groupedEvents).map(([checkSuiteId, workflowRuns]) => (
                    <div key={checkSuiteId} className="mb-6 border border-gray-300 rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-300 p-4 cursor-pointer flex justify-between items-center"
                            onClick={() => toggleGroup(checkSuiteId)}
                        >
                            <span className="font-semibold text-lg">
                                {checkSuiteId === "no-check-suite" ? "No Check Suite" : `Check Suite: ${checkSuiteId}`}
                            </span>
                            <span>{expandedGroups[checkSuiteId] ? "▲" : "▼"}</span>
                        </div>

                        {expandedGroups[checkSuiteId] && (
                            <div className="p-4 bg-gray-100">
                                {Object.entries(workflowRuns).map(([workflowRunId, workflowJobs]) => (
                                    <div key={workflowRunId} className="mb-4 border border-gray-400 rounded-lg">
                                        <div
                                            className="bg-gray-200 p-3 cursor-pointer flex justify-between items-center"
                                            onClick={() => toggleGroup(workflowRunId)}
                                        >
                                            <span className="font-semibold text-md">
                                                {workflowRunId === "no-workflow-run"
                                                    ? "No Workflow Run"
                                                    : `Workflow Run: ${workflowRunId}`}
                                            </span>
                                            <span>{expandedGroups[workflowRunId] ? "▲" : "▼"}</span>
                                        </div>

                                        {expandedGroups[workflowRunId] && (
                                            <div className="p-3 bg-gray-50">
                                                {Object.entries(workflowJobs).map(([workflowJobId, jobEvents]) => (
                                                    <div key={workflowJobId} className="mb-3 border border-gray-500 rounded-lg">
                                                        <div
                                                            className="bg-gray-100 p-2 cursor-pointer flex justify-between items-center"
                                                            onClick={() => toggleGroup(workflowJobId)}
                                                        >
                                                            <span className="font-semibold text-sm">
                                                                {workflowJobId === "no-workflow-job"
                                                                    ? "No Workflow Job"
                                                                    : `Workflow Job: ${workflowJobId}`}
                                                            </span>
                                                            <span>{expandedGroups[workflowJobId] ? "▲" : "▼"}</span>
                                                        </div>

                                                        {expandedGroups[workflowJobId] && (
                                                            <div className="p-2">
                                                                <table className="w-full table-auto border-collapse border border-gray-300">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="border border-gray-300 px-4 py-2 text-left">Event</th>
                                                                            <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                                                                            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                                                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                                                                            <th className="border border-gray-300 px-4 py-2 text-left">Details</th>
                                                                            <th className="border border-gray-300 px-4 py-2 text-left">Check Suite</th>
                                                                            <th className="border border-gray-300 px-4 py-2 text-left">Payload</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {jobEvents.map(event => (
                                                                            <TimelineEventRow
                                                                                key={event.delivery_id}
                                                                                event={event}
                                                                                onViewPayload={() => setSelectedPayload(event.payload)}
                                                                            />
                                                                        ))}
                                                                    </tbody>
                                                                </table>

                                                                {/* Display Diagram for the job group */}
                                                                <Diagram events={jobEvents} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Payload Panel */}
            <PayloadPanel payload={selectedPayload} onClose={() => setSelectedPayload(null)} />
        </div>
    );
};

export default Timeline;
