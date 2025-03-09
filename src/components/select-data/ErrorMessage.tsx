import React from 'react';
import { XCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

/**
 * Renders an error message component with a retry button.
 *
 * This component displays a message indicating an error and provides
 * a button that allows the user to attempt an action again.
 *
 * @param {Object} props - The properties for the component.
 * @param {string} props.message - The error message to display.
 * @param {function} props.onRetry - The function to call when the retry button is clicked.
 *
 * @returns {JSX.Element} The rendered error message component.
 *
 * @throws {Error} Throws an error if the onRetry function is not provided.
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center text-red-400 mb-4">
          <XCircle className="w-8 h-8 mr-2" />
          <p>{message}</p>
        </div>
        <button
          onClick={onRetry}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Retry
        </button>
      </div>
    </div>
  );
}