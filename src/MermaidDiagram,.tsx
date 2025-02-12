import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  definition: string;
}

/**
 * A React functional component that renders a Mermaid diagram based on the provided definition.
 *
 * @param {MermaidDiagramProps} props - The properties for the component.
 * @param {string} props.definition - The Mermaid diagram definition string that describes the diagram to be rendered.
 *
 * @returns {JSX.Element} A div element containing the rendered Mermaid diagram.
 *
 * @throws {Error} Throws an error if there is an issue initializing or rendering the Mermaid diagram.
 *
 * @example
 * const diagramDefinition = `
 *   graph TD;
 *   A-->B;
 *   A-->C;
 *   B-->D;
 *   C-->D;
 * `;
 *
 * <MermaidDiagram definition={diagramDefinition} />
 */
const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ definition }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      try {
        mermaid.initialize({ startOnLoad: false });
        mermaid
          .render("mermaid-diagram", definition, chartRef.current)
          .catch((error: Error) => {
            console.error("Error rendering Mermaid diagram:", error);
          });
      } catch (error) {
        console.error("Error rendering Mermaid diagram:", error);
      }
    }
  }, [definition]);

  return <div ref={chartRef} />;
};

export default MermaidDiagram;