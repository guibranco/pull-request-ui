import { useState, useEffect } from 'react';
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
      setCurrentStep('select-data');
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('apiKey', key);
    setApiKey(key);
    setCurrentStep('select-data');
  };

  const handleDataSelection = (repo: string, pr: string) => {
    setSelectedRepo(repo);
    setSelectedPR(pr);
    setCurrentStep('timeline');
  };

  const handleBackToSelect = () => {
    setCurrentStep('select-data');
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