import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  definition: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ definition }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      try {
        mermaid.initialize({ startOnLoad: false });
        mermaid.render("mermaid-diagram", definition).then(({ svg }) => { if (chartRef.current === null) { return; } chartRef.current.innerHTML = svg });
      } catch (error) {
        console.error("Error rendering Mermaid diagram:", error);
      }
    }
  }, [definition]);

  return <div ref={chartRef} />;
};

export default MermaidDiagram;