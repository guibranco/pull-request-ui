import React from 'react';
import { Key, GitFork, GitPullRequest } from 'lucide-react';

interface HeaderProps {
  currentStep: 'api-key' | 'select-data' | 'timeline';
}

/**
 * Renders the header component for the Pull Request Flow Viewer.
 * This component displays the current step in a multi-step process,
 * along with navigation indicators for each step.
 *
 * @param {HeaderProps} props - The properties for the Header component.
 * @param {string} props.currentStep - The ID of the current step in the process.
 *
 * @returns {JSX.Element} The rendered header component.
 *
 * @throws {Error} Throws an error if the currentStep does not match any defined step IDs.
 */
export function Header({ currentStep }: HeaderProps) {
  const steps = [
    { id: 'api-key', label: 'API Key', icon: Key },
    { id: 'select-data', label: 'Select Data', icon: GitFork },
    { id: 'timeline', label: 'Timeline', icon: GitPullRequest },
  ];

  return (
    <div className="bg-gray-800 shadow-sm">
      <div className="container mx-auto px-6 lg:px-8 max-w-[90rem]">
        <div className="py-4">
          <div className="flex items-center justify-center mb-6">
            <GitPullRequest className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-2xl font-bold text-gray-100">
              Pull Request Flow Viewer
            </h1>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {index > 0 && (
                  <div className="h-0.5 w-16 bg-gray-700">
                    <div
                      className={`h-full ${
                        steps.findIndex((s) => s.id === currentStep) >= index
                          ? 'bg-blue-500'
                          : ''
                      }`}
                    />
                  </div>
                )}
                <div
                  className={`flex items-center space-x-2 ${
                    currentStep === step.id
                      ? 'text-blue-400'
                      : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === step.id
                        ? 'bg-blue-900'
                        : 'bg-gray-700'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{step.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}