import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Pause, Play } from 'lucide-react';

interface RefreshButtonProps {
  readonly onRefresh: () => Promise<void>;
  readonly isLoading: boolean;
}

export function RefreshButton({ onRefresh, isLoading }: Readonly<RefreshButtonProps>) {
  const INITIAL_COUNTDOWN = 15;
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const [isPaused, setIsPaused] = useState(() => {
    const saved = localStorage.getItem('isRefreshPaused');
    return saved ? JSON.parse(saved) : false;
  });

  const handleRefreshNow = useCallback(async () => {
    if (!isLoading) {
      await onRefresh();
      setCountdown(INITIAL_COUNTDOWN);
    }
  }, [isLoading, onRefresh]);

  const handleTogglePause = () => {
    setIsPaused(prev => {
      const newValue = !prev;
      localStorage.setItem('isRefreshPaused', JSON.stringify(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const tick = async () => {
      if (!isPaused && !isLoading) {
        if (countdown <= 0) {
          await handleRefreshNow();
        } else {
          setCountdown(prev => prev - 1);
        }
      }
    };

    if (!isPaused && !isLoading) {
      timeoutId = setTimeout(tick, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [countdown, isPaused, isLoading, handleRefreshNow]);

  return (
    <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-lg">
      <button
        onClick={handleTogglePause}
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          isPaused 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-700 hover:bg-gray-600'
        } transition-colors`}
        disabled={isLoading}
        title={isPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
      >
        {isPaused ? (
          <Play className="w-4 h-4 text-white" />
        ) : (
          <Pause className="w-4 h-4 text-white" />
        )}
      </button>
      
      <div className="flex items-center space-x-2">
        <RefreshCw 
          className={`w-5 h-5 text-blue-400 ${isLoading ? 'animate-spin' : ''}`} 
        />
        <span className="text-gray-300">
          {isLoading ? 'Refreshing...' : `Refreshing in ${countdown}s`}
        </span>
      </div>

      <button
        onClick={handleRefreshNow}
        disabled={isLoading}
        className="px-3 py-1 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed text-sm"
      >
        Refresh Now
      </button>
    </div>
  );
}