import { useState, useEffect } from "react";
import MermaidDiagram from "./MermaidDiagram";

const Diagram = ({ events }: { events: TimelineEvent[] }) => {
    const [definition, setDefinition] = useState("");

    useEffect(() => {
        let diagramDef = `graph TD\n`;

        events.forEach((event, i) => {
            const nodeId = `${event.type}_${i}`;
            diagramDef += `${nodeId}(["${event.type} - ${event.action}"])\n`;

            if (event.payload.workflow_job?.id) {
                const jobId = `Job_${event.payload.workflow_job.id}`;
                diagramDef += `${jobId} --> ${nodeId}\n`;
            }

            if (event.payload.workflow_run?.id) {
                const runId = `Run_${event.payload.workflow_run.id}`;
                diagramDef += `${runId} --> ${nodeId}\n`;
            }

            if (event.payload.check_suite?.id) {
                const suiteId = `Suite_${event.payload.check_suite.id}`;
                diagramDef += `${suiteId} --> ${nodeId}\n`;
            }
        });

        setDefinition(diagramDef);
    }, [events]);

    return (
        <div className="diagram-container border border-gray-300 p-4 rounded-md">
            <MermaidDiagram definition={definition} />
        </div>
    );
};

export default Diagram;
