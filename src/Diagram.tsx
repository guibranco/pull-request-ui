import { useState, useEffect } from "react";
import MermaidDiagram  from "./MermaidDiagram,";

/**
 * A functional component that renders a diagram based on a list of timeline events.
 *
 * @param {Object} props - The properties object.
 * @param {TimelineEvent[]} props.events - An array of timeline events used to generate the diagram.
 *
 * @returns {JSX.Element} The rendered diagram component.
 *
 * @example
 * const events = [
 *   { type: 'Start', action: 'Initiated' },
 *   { type: 'Process', action: 'In Progress' },
 *   { type: 'End', action: 'Completed' }
 * ];
 *
 * <Diagram events={events} />
 *
 * @throws {Error} Throws an error if the events prop is not an array.
 */
const Diagram = ({ events }: { events: TimelineEvent[] }) => {
  const [definition, setDefinition] = useState("");

  useEffect(() => {
    const diagramDef = `
      graph TD
      ${events
        .map(
          (event, index) =>
            `${event.type}_${index}([${event.type} - ${event.action}])`
        )
        .join("\n")}
    `;
    setDefinition(diagramDef);
  }, [events]);

  console.log(definition);

  return (
    <div className="diagram-container">
      <MermaidDiagram definition={definition} />
    </div>
  );
};

export default Diagram;
