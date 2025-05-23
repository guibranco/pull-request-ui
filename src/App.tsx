import React, { useState, useEffect } from 'react';
import { ApiKeyStep } from './steps/ApiKeyStep';
import { SelectDataStep } from './steps/SelectDataStep';
import { TimelineViewStep } from './steps/TimelineViewStep';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';

type Step = 'api-key' | 'select-data' | 'timeline';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('api-key');
  const [apiKey, setApiKey] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const [selectedPR, setSelectedPR] = useState('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);

      // Check if we're explicitly on the API key screen
      if (window.location.hash === '#/api-key') {
        setCurrentStep('api-key');
        return;
      }

      // Parse hash parameters
      const hash = window.location.hash.slice(1);
      if (hash && hash !== '/api-key') {
        const [owner, repo, pr] = hash.split('/').filter(Boolean);
        if (owner && repo) {
          const fullRepo = `${owner}/${repo}`;
          setSelectedRepo(fullRepo);
          
          if (pr) {
            setSelectedPR(pr);
            setCurrentStep('timeline');
          } else {
            setCurrentStep('select-data');
          }
        } else {
          setCurrentStep('select-data');
        }
      } else {
        setCurrentStep('select-data');
      }
    }
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/api-key') {
        setCurrentStep('api-key');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('apiKey', key);
    setApiKey(key);
    setCurrentStep('select-data');
    window.location.hash = '';
  };

  const handleDataSelection = (repo: string, pr: string) => {
    setSelectedRepo(repo);
    setSelectedPR(pr);
    setCurrentStep('timeline');
    
    // Update hash
    const [owner, repoName] = repo.split('/');
    window.location.hash = `${owner}/${repoName}/${pr}`;
  };

  const handleBackToSelect = () => {
    setCurrentStep('select-data');
    
    // Update hash to keep only repository info
    if (selectedRepo) {
      const [owner, repo] = selectedRepo.split('/');
      window.location.hash = `${owner}/${repo}`;
    } else {
      window.location.hash = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header currentStep={currentStep} />

      <div className="container mx-auto px-6 lg:px-8 py-8 flex-1 max-w-[90rem]">
        {currentStep === 'api-key' && (
          <ApiKeyStep onSubmit={handleApiKeySubmit} />
        )}
        {currentStep === 'select-data' && (
          <SelectDataStep
            apiKey={apiKey}
            onSelect={handleDataSelection}
            preselectedRepo={selectedRepo}
          />
        )}
        {currentStep === 'timeline' && (
          <TimelineViewStep
            apiKey={apiKey}
            repo={selectedRepo}
            pr={selectedPR}
            onBack={handleBackToSelect}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;