/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { X, ArrowLeftRight } from 'lucide-react';
import { JSONView } from './JSONView';

interface PayloadCompareModalProps {
  leftPayload: any;
  rightPayload: any;
  onClose: () => void;
}

export function PayloadCompareModal({ leftPayload, rightPayload, onClose }: PayloadCompareModalProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['']));
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

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
    
    collectPaths(leftPayload);
    collectPaths(rightPayload);
    setExpandedPaths(allPaths);
  };

  const handleCollapseAll = () => {
    setExpandedPaths(new Set());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-gray-100">Compare Payloads</h3>
            <ArrowLeftRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showDifferencesOnly}
                onChange={(e) => setShowDifferencesOnly(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-300">Show differences only</span>
            </label>
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
          <div className="grid grid-cols-2 gap-6">
            <div className="font-mono text-sm">
              <div className="mb-2 text-gray-400 font-semibold">Left Payload</div>
              <JSONView
                data={leftPayload}
                expanded={expandedPaths}
                onToggle={handleToggle}
                compareWith={rightPayload}
                showDifferencesOnly={showDifferencesOnly}
                side="left"
              />
            </div>
            <div className="font-mono text-sm border-l border-gray-700 pl-6">
              <div className="mb-2 text-gray-400 font-semibold">Right Payload</div>
              <JSONView
                data={rightPayload}
                expanded={expandedPaths}
                onToggle={handleToggle}
                compareWith={leftPayload}
                showDifferencesOnly={showDifferencesOnly}
                side="right"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}