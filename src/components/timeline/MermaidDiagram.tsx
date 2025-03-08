import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Event } from '../../types';

interface MermaidDiagramProps {
  events: Event[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function MermaidDiagram({ events, isExpanded, onToggle }: MermaidDiagramProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  const sanitizeParticipant = (name: string): string => {
    return name.replace(/[^\w]/g, '_').substring(0, 20);
  };

  const truncateText = (text: string, maxLength: number = 30): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatEventTime = (date: string): string => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateSequenceDiagram = () => {
    if (!events.length) {
      return `sequenceDiagram
    participant GH as GitHub
    participant PR as Pull Request
    Note over GH,PR: No events found`;
    }

    let diagram = 'sequenceDiagram\n';
    
    // Add core participants
    diagram += '    participant GH as GitHub\n';
    diagram += '    participant PR as Pull Request\n';
    
    // Track unique actors to avoid duplicates
    const actors = new Set<string>();
    
    // First pass: collect all actors (limited to first 5 unique actors)
    let actorCount = 0;
    for (const event of events) {
      const sender = event.payload?.sender?.login;
      if (sender && !actors.has(sender) && actorCount < 5) {
        const safeSender = sanitizeParticipant(sender);
        actors.add(sender);
        diagram += `    participant ${safeSender} as ${truncateText(sender, 15)}\n`;
        actorCount++;
      }
    }

    // Second pass: add events with proper timing
    let lastEventTime = '';
    events.forEach((event, index) => {
      const eventTime = formatEventTime(event.date);
      const sender = event.payload?.sender?.login && actors.has(event.payload.sender.login)
        ? sanitizeParticipant(event.payload.sender.login)
        : 'GH';
      
      // Truncate action text
      const action = truncateText(
        event.action ? `${event.type}:${event.action}` : event.type,
        25
      );
      
      diagram += `    ${sender}->PR: ${action}\n`;
      
      // Only add time note if it's different from the last one
      if (eventTime !== lastEventTime) {
        diagram += `    Note over PR: ${eventTime}\n`;
        lastEventTime = eventTime;
      }
      
      // Add minimal payload information
      if (event.payload) {
        const notes = [];
        if (event.payload.comment?.body) {
          notes.push('Comment');
        }
        if (event.payload.review?.state) {
          notes.push(event.payload.review.state);
        }
        if (event.payload.check_suite?.conclusion) {
          notes.push(event.payload.check_suite.conclusion);
        }
        
        if (notes.length > 0) {
          diagram += `    Note over ${sender},PR: ${truncateText(notes.join(', '), 20)}\n`;
        }
      }
      
      // Add spacing between events
      if (index < events.length - 1) {
        diagram += '\n';
      }
    });

    return diagram;
  };

  useEffect(() => {
    if (mermaidRef.current && events.length > 0 && isExpanded) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        sequence: {
          showSequenceNumbers: false,
          actorMargin: 50,
          messageMargin: 40,
          boxMargin: 10,
          noteMargin: 10,
          mirrorActors: false,
          bottomMarginAdj: 2,
          useMaxWidth: true,
          diagramMarginX: 50,
          diagramMarginY: 30,
          boxTextMargin: 5,
          noteMarginX: 10,
          noteMarginY: 10,
          messageAlign: 'center',
          actorFontSize: 14,
          noteFontSize: 13,
          messageFontSize: 13,
          wrap: true,
          maxMessageWidth: 200,
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
      
      try {
        mermaid.render('mermaid-diagram', diagram).then((result) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = result.svg;
          }
        }).catch((error) => {
          console.error('Mermaid rendering error:', error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = '<div class="text-red-400">Error rendering diagram</div>';
          }
        });
      } catch (error) {
        console.error('Mermaid error:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = '<div class="text-red-400">Error rendering diagram</div>';
        }
      }
    }
  }, [events, isExpanded]);

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