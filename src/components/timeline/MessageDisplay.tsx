import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

interface MessageDisplayProps {
  type: 'error' | 'info';
  message: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function MessageDisplay({
  type,
  message,
  onAction,
  actionLabel,
}: MessageDisplayProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
        <div
          className={`flex items-center justify-center mb-4 ${
            type === 'error' ? 'text-red-400' : 'text-gray-300'
          }`}
        >
          {type === 'error' ? (
            <XCircle className="w-6 h-6 mr-2" />
          ) : (
            <AlertCircle className="w-6 h-6 mr-2" />
          )}
          <p>{message}</p>
        </div>
        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
