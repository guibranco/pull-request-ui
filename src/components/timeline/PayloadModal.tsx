/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { X, ArrowLeftRight } from 'lucide-react';
import { JSONView } from './JSONView';
import { PayloadCompareModal } from './PayloadCompareModal';

interface PayloadModalProps {
  payload: any;
  onClose: () => void;
  comparePayload?: any;
  onCompare?: (payload: any) => void;
  selectedCount?: number;
}

export function PayloadModal({ payload, onClose, comparePayload, onCompare, selectedCount = 0 }: PayloadModalProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['']));

  // If we have a comparePayload, directly render the compare modal
  if (comparePayload) {
    return (
      <PayloadCompareModal
        leftPayload={payload}
        rightPayload={comparePayload}
        onClose={onClose}
      />
    );
  }

  const handleToggle = (path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    const allPaths = new Set<string>();
    
    function collectPaths(obj: any, path = '') {
      if (obj && typeof obj === 'object') {
        allPaths.add(path);
        Object.keys(obj).forEach(key => {
          const newPath = path ? `${path}.${key}` : key;
          collectPaths(obj[key], newPath);
        });
      }
    }
    
    collectPaths(payload);
    setExpandedPaths(allPaths);
  };

  const handleCollapseAll = () => {
    setExpandedPaths(new Set());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-100">Event Payload</h3>
            {selectedCount === 1 && onCompare && (
              <button
                onClick={() => onCompare(payload)}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Compare with selected event</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExpandAll}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Collapse All
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-auto flex-1">
          <div className="font-mono text-sm">
            <JSONView
              data={payload}
              expanded={expandedPaths}
              onToggle={handleToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}