// src/App.tsx
import React, { useState, useEffect } from 'react';
// … 其他 imports …

function App() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [zoneList, setZoneList] = useState<string[]>(() => {
    const saved = localStorage.getItem('tz-zones');
    return saved ? JSON.parse(saved) : ['Asia/Shanghai'];
  });

  // ← 新增：当 zoneList 变化时写入 localStorage
  useEffect(() => {
    localStorage.setItem('tz-zones', JSON.stringify(zoneList));
  }, [zoneList]);

  const handleCityClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    setZoneList(prev => {
      if (!prev.includes(zoneId)) {
        return [...prev, zoneId];
      }
      return prev;
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* 地图全屏区域 */}
      <div className="w-full h-screen">
        <WorldMap zones={zoneList} onSelectZone={setSelectedZone} />
      </div>

      {/* 下方功能区 */}
      <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
        <div className="w-full flex justify-end mb-4">
          <ThemeSwitcher />
        </div>

        <div className="text-center mb-8">
          <Clock />
        </div>

        <div className="mb-8">
          <TimeZoneClockList
            selectedZone={selectedZone}
            zones={zoneList}
            setZones={setZoneList}   // 仍然用这个 setter
          />
        </div>

        <div className="mb-8">
          <PopularCityGrid onCityClick={handleCityClick} />
        </div>
      </div>
    </div>
  );
}

export default App;
