import React, { useEffect, useRef, useCallback } from 'react';
import mermaid from 'mermaid';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Event } from '../../types';

interface MermaidDiagramProps {
  readonly events: readonly Event[];
  readonly isExpanded: boolean;
  readonly onToggle: () => void;
}

export function MermaidDiagram({ events, isExpanded, onToggle }: Readonly<MermaidDiagramProps>) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  const truncateText = (text: string, maxLength: number = 30): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const getEventTitle = (event: Event): string => {
    if (event.payload.issue) {
      return `Issue #${event.payload.issue.number}`;
    }
    if (event.payload.pull_request) {
      return `PR #${event.payload.pull_request.number}`;
    }
    if (event.payload.check_run) {
      return `Check: ${event.payload.check_run.name}`;
    }
    if (event.payload.workflow_run) {
      return `Workflow: ${event.payload.workflow_run.name}`;
    }
    if (event.payload.workflow_job) {
      return `Job: ${event.payload.workflow_job.name}`;
    }
    if (event.payload.release) {
      return `Release: ${event.payload.release.tag_name}`;
    }
    return 'Event';
  };

  const getEventStatus = (event: Event): string | null => {
    return event.payload.check_run?.conclusion ||
      event.payload.check_suite?.conclusion ||
      event.payload.status?.state ||
      event.payload.review?.state ||
      event.payload.workflow_run?.conclusion ||
      event.payload.workflow_job?.conclusion ||
      null;
  };

  const generateSequenceDiagram = useCallback(() => {
    if (!events.length) {
      return `sequenceDiagram
    participant GH as GitHub
    participant PR as Pull Request
    Note over GH,PR: No events found`;
    }

    // Group events by their type and ID
    const groupedEvents = events.reduce((acc, event) => {
      const id = event.payload.issue?.id ||
        event.payload.pull_request?.id ||
        event.payload.check_run?.id ||
        event.payload.workflow_run?.id ||
        event.payload.workflow_job?.id ||
        event.payload.release?.id ||
        event.delivery_id;

      const key = `${event.type}_${id}`;
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(event);
      return acc;
    }, {} as Record<string, Event[]>);

    // Sort events within each group by date
    Object.values(groupedEvents).forEach(group => {
      group.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    let diagram = 'sequenceDiagram\n';
    diagram += '    participant GH as GitHub\n';
    diagram += '    participant PR as Pull Request\n';

    // Create a map for actors to ensure unique IDs
    const actorMap = new Map<string, string>();
    let actorCounter = 0;

    const getActorId = (name: string): string => {
      if (!actorMap.has(name)) {
        actorMap.set(name, `Actor${actorCounter++}`);
      }
      return actorMap.get(name)!;
    };

    // Add actors (limit to 5 most active)
    const actorCounts = new Map<string, number>();
    events.forEach(event => {
      const sender = event.payload.sender?.login;
      if (sender) {
        actorCounts.set(sender, (actorCounts.get(sender) || 0) + 1);
      }
    });

    // Sort actors by frequency and take top 5
    const topActors = Array.from(actorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([actor]) => actor);

    // Add actor participants
    topActors.forEach(actor => {
      const actorId = getActorId(actor);
      diagram += `    participant ${actorId} as ${truncateText(actor, 15)}\n`;
    });

    // Add event groups
    Object.values(groupedEvents).forEach(group => {
      const title = getEventTitle(group[0]);
      diagram += `\n    Note over GH,PR: ${title}\n`;

      group.forEach(event => {
        // Determine the actor
        let actor = 'GH';
        if (event.payload.sender?.login && topActors.includes(event.payload.sender.login)) {
          actor = getActorId(event.payload.sender.login);
        }

        // Create the event message
        const message = event.action ? `${event.type}:${event.action}` : event.type;
        diagram += `    ${actor}->>PR: ${truncateText(message, 25)}\n`;

        // Add status if available
        const status = getEventStatus(event);
        if (status) {
          diagram += `    Note right of PR: ${status}\n`;
        }
      });
    });

    return diagram;
  }, [events]);

  useEffect(() => {
    if (!mermaidRef.current || !events.length || !isExpanded) {
      return;
    }

    const initializeMermaid = async () => {
      try {
        await mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          sequence: {
            showSequenceNumbers: false,
            actorMargin: 80,
            messageMargin: 40,
            mirrorActors: false,
            bottomMarginAdj: 10,
            useMaxWidth: true,
            rightAngles: true,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageAlign: 'center',
            actorFontSize: 14,
            noteFontSize: 13,
            messageFontSize: 13,
            wrap: true,
            maxMessageWidth: 150,
          },
          themeVariables: {
            primaryColor: '#1e40af',
            primaryTextColor: '#fff',
            primaryBorderColor: '#60a5fa',
            lineColor: '#4b5563',
            secondaryColor: '#1f2937',
            tertiaryColor: '#374151',
            noteBkgColor: '#374151',
            noteTextColor: '#fff',
            noteBorderColor: '#60a5fa',
            actorBkg: '#1e40af',
            actorTextColor: '#fff',
            actorLineColor: '#60a5fa'
          }
        });

        const diagram = generateSequenceDiagram();
        const { svg } = await mermaid.render('mermaid-diagram', diagram);
        
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `
            <div class="p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
              <p class="text-red-400">Error rendering diagram. Please try again later.</p>
            </div>
          `;
        }
      }
    };

    initializeMermaid();
  }, [events, isExpanded, generateSequenceDiagram]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg w-full overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700/50 transition-colors"
      >
        <h3 className="text-2xl font-medium text-gray-100">
          Event Sequence
        </h3>
        {isExpanded ? (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronRight className="w-6 h-6 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-6 pt-0">
          <div ref={mermaidRef} className="w-full overflow-x-auto" />
        </div>
      )}
    </div>
  );
}