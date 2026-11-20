import React from 'react';
import { AlertCircle, XCircle, Settings } from 'lucide-react';

interface MessageDisplayProps {
  type: 'error' | 'info';
  message: string;
  onAction?: () => void;
  actionLabel?: string;
  onChangeSettings?: () => void;
}

export function MessageDisplay({
  type,
  message,
  onAction,
  actionLabel,
  onChangeSettings,
}: MessageDisplayProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-sm">
        <div
          className={`flex items-center justify-center mb-4 ${
            type === 'error' ? 'text-red-400' : 'text-gray-300'
          }`}
        >
          {type === 'error' ? (
            <XCircle className="w-6 h-6 mr-2 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 mr-2 shrink-0" />
          )}
          <p className="break-words min-w-0">{message}</p>
        </div>
        <div className="space-y-3">
          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {actionLabel}
            </button>
          )}
          {onChangeSettings && (
            <button
              onClick={onChangeSettings}
              className="w-full flex items-center justify-center space-x-2 text-gray-300 hover:text-gray-100 py-2 px-4 rounded-md border border-gray-600 hover:border-gray-500 focus:outline-hidden focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <Settings className="w-4 h-4" />
              <span>Change API settings</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
