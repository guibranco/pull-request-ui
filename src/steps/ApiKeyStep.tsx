import React, { useState, useEffect } from 'react';
import {
  Key,
  LogOut,
  AlertCircle,
  Lock,
  Unlock,
  ArrowRight,
} from 'lucide-react';

interface ApiKeyStepProps {
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyStep({ onSubmit }: ApiKeyStepProps) {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('apiKey') || ''
  );
  const [isEditing, setIsEditing] = useState(!apiKey);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const errorMessage = searchParams.get('error');
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
      // Clean up the URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey);
  };

  const handleClearApiKey = () => {
    setApiKey('');
    setIsEditing(true);
  };

  const handleContinue = () => {
    onSubmit(apiKey);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mx-auto mb-6">
          <Key className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-8">
          API Key
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center text-red-400">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label
              htmlFor="apiKey"
              className="block text-lg font-medium text-gray-300 mb-2"
            >
              API Key
            </label>
            <div className="relative">
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100 text-lg disabled:opacity-75 disabled:cursor-not-allowed"
                placeholder="Enter your API key"
                required
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {isEditing ? (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
              >
                Continue
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Continue to Select Data</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleClearApiKey}
                  className="w-full flex items-center justify-center text-gray-300 hover:text-gray-100 py-3 px-6 rounded-lg text-lg border border-gray-600 hover:border-gray-500 focus:outline-hidden focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all space-x-2"
                >
                  <Unlock className="w-5 h-5" />
                  <span>Change API Key</span>
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
