import React, { useEffect, useState } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-6xl font-mono text-gray-900 dark:text-gray-100">
      {time.toLocaleTimeString()}
    </div>
  );
};

export default Clock;
