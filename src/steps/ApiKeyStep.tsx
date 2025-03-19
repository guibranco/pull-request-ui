import React, { useState } from 'react';
import { Key, LogOut } from 'lucide-react';

interface ApiKeyStepProps {
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyStep({ onSubmit }: ApiKeyStepProps) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey);
  };

  const handleLogout = () => {
    localStorage.removeItem('apiKey');
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mx-auto mb-6">
          <Key className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-8">
          Enter API Key
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label
              htmlFor="apiKey"
              className="block text-lg font-medium text-gray-300 mb-2"
            >
              API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100 text-lg"
              placeholder="Enter your API key"
              required
            />
          </div>
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
            >
              Continue
            </button>
            {localStorage.getItem('apiKey') && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center text-gray-300 hover:text-gray-100 py-3 px-6 rounded-lg text-lg border border-gray-600 hover:border-gray-500 focus:outline-hidden focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}