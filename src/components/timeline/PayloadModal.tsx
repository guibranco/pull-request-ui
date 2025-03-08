import React from 'react';

interface PayloadModalProps {
  payload: any;
  onClose: () => void;
}

export function PayloadModal({ payload, onClose }: PayloadModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-100">Event Payload</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(80vh-8rem)]">
          <pre className="bg-gray-900 p-4 rounded overflow-auto text-gray-300">
            <code>{JSON.stringify(payload, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}