import React, { useState, useRef, useEffect } from 'react';

/**
 * Stopwatch component: start/stop/reset timer with lap recording.
 */
const Stopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // milliseconds
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start or stop the stopwatch
  const toggle = () => {
    if (isRunning) {
      clearInterval(timerRef.current!);
    } else {
      const startTime = Date.now() - elapsed;
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 10);
    }
    setIsRunning(prev => !prev);
  };

  // Reset stopwatch and laps
  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  // Record current lap
  const lap = () => {
    setLaps(prev => [elapsed, ...prev]);
  };

  // Format milliseconds to mm:ss:ms
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl w-full max-w-md">
      <div className="text-4xl font-mono text-center mb-4">{formatTime(elapsed)}</div>
      <div className="flex justify-center space-x-4 mb-4">
        <button onClick={toggle} className="px-4 py-2 bg-green-500 text-white rounded">
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button onClick={reset} className="px-4 py-2 bg-red-500 text-white rounded">
          Reset
        </button>
        <button onClick={lap} disabled={!isRunning} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Lap
        </button>
      </div>
      {laps.length > 0 && (
        <div className="max-h-32 overflow-auto">
          {laps.map((time, i) => (
            <div key={i} className="flex justify-between border-b py-1">
              <span>Lap {laps.length - i}</span>
              <span>{formatTime(time)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stopwatch;
