// src/App.tsx
import React, { useState } from 'react';
import ThemeSwitcher from './components/ThemeSwitcher';
import Clock from './components/Clock';
import TimeZoneClockList from './components/TimeZoneClockList';
import WorldMap from './components/WorldMap';
import PopularCityGrid from './components/PopularCityGrid';

function App() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [zoneList, setZoneList] = useState<string[]>(() => {
    const saved = localStorage.getItem('tz-zones');
    return saved ? JSON.parse(saved) : ['Asia/Shanghai'];
  });

  const handleCityClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    setZoneList(prev => {
      if (!prev.includes(zoneId)) {
        const updated = [...prev, zoneId];
        localStorage.setItem('tz-zones', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      {/* 1. 地图部分：全屏（100vh） */}
      <div className="w-full h-screen">
        <WorldMap zones={zoneList} onSelectZone={setSelectedZone} />
      </div>

      {/* 2. 下方功能区：限宽居中 */}
      <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
        {/* 右上角主题切换 */}
        <div className="w-full flex justify-end mb-4">
          <ThemeSwitcher />
        </div>

        {/* 主时钟 */}
        <div className="text-center mb-8">
          <Clock />
        </div>

        {/* 多时区列表 */}
        <div className="mb-8">
          <TimeZoneClockList
            selectedZone={selectedZone}
            zones={zoneList}
            setZones={setZoneList}
          />
        </div>

        {/* 热门城市网格 */}
        <div className="mb-8">
          <PopularCityGrid onCityClick={handleCityClick} />
        </div>
      </div>
    </div>
  );
}

export default App;
