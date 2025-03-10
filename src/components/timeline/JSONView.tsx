import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { isEqual } from 'lodash-es';

interface JSONViewProps {
  data: Record<string, unknown>;
  path?: string;
  expanded: Set<string>;
  onToggle: (path: string) => void;
  compareWith?: Record<string, unknown>;
  showDifferencesOnly?: boolean;
  side?: 'left' | 'right';
}

export function JSONView({ 
  data, 
  path = '', 
  expanded, 
  onToggle,
  compareWith,
  showDifferencesOnly = false,
  side = 'left'
}: JSONViewProps) {
  const isDifferent = compareWith !== undefined && !isEqual(data, compareWith);

  const shouldShow = !showDifferencesOnly || isDifferent;

  if (!shouldShow) {
    return null;
  }

  if (data === null) return (
    <span className={`text-gray-400 ${isDifferent ? 'bg-red-500/20' : ''}`}>
      null
    </span>
  );

  if (typeof data === 'boolean') return (
    <span className={`text-yellow-400 ${isDifferent ? 'bg-red-500/20' : ''}`}>
      {data.toString()}
    </span>
  );

  if (typeof data === 'number') return (
    <span className={`text-blue-400 ${isDifferent ? 'bg-red-500/20' : ''}`}>
      {data}
    </span>
  );

  if (typeof data === 'string') return (
    <span className={`text-green-400 ${isDifferent ? 'bg-red-500/20' : ''}`}>
      "{data}"
    </span>
  );

  const isArray = Array.isArray(data);
  const isEmpty = isArray ? data.length === 0 : Object.keys(data).length === 0;
  const isExpanded = expanded.has(path);

  if (isEmpty) {
    return (
      <span className={`text-gray-400 ${isDifferent ? 'bg-red-500/20' : ''}`}>
        {isArray ? '[]' : '{}'}
      </span>
    );
  }

  const toggleExpand = () => onToggle(path);
  const currentPath = (key: string) => path ? `${path}.${key}` : key;

  const getCompareValue = (key: string | number): Record<string, unknown> | undefined => {
    if (!compareWith) return undefined;
    return isArray ? compareWith[key as number] as Record<string, unknown> : compareWith[key as string] as Record<string, unknown>;
  };

  return (
    <div className={`relative ${isDifferent ? 'bg-red-500/20 rounded px-1' : ''}`}>
      <div 
        className="flex items-center cursor-pointer hover:text-blue-400 transition-colors"
        onClick={toggleExpand}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 mr-1" />
        ) : (
          <ChevronRight className="w-4 h-4 mr-1" />
        )}
        <span>{isArray ? '[' : '{'}</span>
        {!isExpanded && (
          <span className="text-gray-400 ml-1">
            {isArray ? `${data.length} items` : `${Object.keys(data).length} keys`}
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="ml-4 border-l border-gray-700 pl-4">
          {isArray ? (
            (data as unknown[]).map((item, index) => (
              <div key={index} className="py-1">
                <span className="text-gray-400 mr-2">{index}:</span>
                <JSONView
                  data={item as Record<string, unknown>}
                  path={currentPath(index.toString())}
                  expanded={expanded}
                  onToggle={onToggle}
                  compareWith={getCompareValue(index)}
                  showDifferencesOnly={showDifferencesOnly}
                  side={side}
                />
              </div>
            ))
          ) : (
            Object.entries(data).map(([key, value]) => (
              <div key={key} className="py-1">
                <span className="text-purple-400 mr-2">"{key}":</span>
                <JSONView
                  data={value as Record<string, unknown>}
                  path={currentPath(key)}
                  expanded={expanded}
                  onToggle={onToggle}
                  compareWith={getCompareValue(key)}
                  showDifferencesOnly={showDifferencesOnly}
                  side={side}
                />
              </div>
            ))
          )}
        </div>
      )}
      <div className="ml-0">{isArray ? ']' : '}'}</div>
    </div>
  );
}