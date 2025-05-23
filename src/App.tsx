// src/App.tsx
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';
import Clock from './components/Clock';
import TimeZoneClockList from './components/TimeZoneClockList';
import WorldMap from './components/WorldMap';
import PopularCityGrid from './components/PopularCityGrid';

function App() {
  const [zoneList, setZoneList] = useState<string[]>(() => {
    const saved = localStorage.getItem('tz-zones');
    return saved ? JSON.parse(saved) : ['Asia/Shanghai'];
  });
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('tz-zones', JSON.stringify(zoneList));
  }, [zoneList]);

  const handleCityClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    setZoneList((prev) => (prev.includes(zoneId) ? prev : [...prev, zoneId]));
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full h-screen">
          <WorldMap zones={zoneList} onSelectZone={setSelectedZone} />
        </div>

        <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex justify-end mb-4">
            <ThemeSwitcher />
          </div>
          <div className="text-center mb-8">
            <Clock />
          </div>
          <div className="mb-8">
            <TimeZoneClockList
              selectedZone={selectedZone}
              zones={zoneList}
              setZones={setZoneList}
            />
          </div>
          <div className="mb-8">
            <PopularCityGrid onCityClick={handleCityClick} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
