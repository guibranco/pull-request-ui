import React from 'react';
import { Key, GitFork, GitPullRequest } from 'lucide-react';

interface HeaderProps {
  currentStep: 'api-key' | 'select-data' | 'timeline';
  onApiKeyClick?: () => void;
}

export function Header({ currentStep, onApiKeyClick }: HeaderProps) {
  const steps = [
    { id: 'api-key', label: 'API Key', icon: Key },
    { id: 'select-data', label: 'Select Data', icon: GitFork },
    { id: 'timeline', label: 'Timeline', icon: GitPullRequest },
  ];

  return (
    <div className="bg-zinc-800 shadow-sm">
      <div className="container mx-auto px-6 lg:px-8 max-w-[90rem]">
        <div className="py-4">
          <div className="flex items-center justify-center mb-6">
            <GitPullRequest className="w-8 h-8 text-green-400 mr-3" />
            <h1 className="text-2xl font-bold text-gray-100">
              Pull Request Flow Viewer
            </h1>
          </div>

          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => {
              const content = (
                <>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === step.id ? 'bg-green-900' : 'bg-zinc-700'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{step.label}</span>
                </>
              );
              const colour =
                currentStep === step.id ? 'text-green-400' : 'text-gray-400';
              const isClickable =
                step.id === 'api-key' &&
                currentStep !== 'api-key' &&
                !!onApiKeyClick;

              return (
                <React.Fragment key={step.id}>
                  {index > 0 && (
                    <div className="h-0.5 w-16 bg-zinc-700">
                      <div
                        className={`h-full ${
                          steps.findIndex(s => s.id === currentStep) >= index
                            ? 'bg-green-500'
                            : ''
                        }`}
                      />
                    </div>
                  )}
                  {isClickable ? (
                    <button
                      type="button"
                      onClick={onApiKeyClick}
                      title="Change API key or address"
                      className={`flex items-center space-x-2 ${colour} hover:text-green-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-green-500 cursor-pointer`}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className={`flex items-center space-x-2 ${colour}`}>
                      {content}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
