// src/App.tsx
import React, { useState, useEffect } from 'react';
import Clock from './components/Clock';
import TimeZoneClockList from './components/TimeZoneClockList';
import WorldMap from './components/WorldMap';
import PopularCityGrid from './components/PopularCityGrid';

const App: React.FC = () => {
  // 读取/持久化多时区列表
  const [zoneList, setZoneList] = useState<string[]>(() => {
    const saved = localStorage.getItem('tz-zones');
    try {
      return saved ? JSON.parse(saved) : ['Asia/Shanghai'];
    } catch {
      return ['Asia/Shanghai'];
    }
  });
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('tz-zones', JSON.stringify(zoneList));
  }, [zoneList]);

  const handleCityClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    setZoneList(prev => (prev.includes(zoneId) ? prev : [...prev, zoneId]));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* 地图全屏 */}
      <div className="w-full h-screen">
        <WorldMap zones={zoneList} onSelectZone={setSelectedZone} />
      </div>

      {/* 下方功能区 */}
      <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
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
};

export default App;
