import { useState, useEffect } from "react";
import MermaidDiagram  from "./MermaidDiagram,";

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
