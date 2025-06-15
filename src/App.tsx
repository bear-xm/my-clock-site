// src/App.tsx
import React, { useState, useEffect } from 'react';
import Clock from './components/Clock';
import TimeZoneClockList from './components/TimeZoneClockList';
import WorldMap from './components/WorldMap';
import PopularCityGrid from './components/PopularCityGrid';

const App: React.FC = () => {
  // 从 localStorage 读取已保存的时区列表，保证类型为 string[]
  const [zoneList, setZoneList] = useState<string[]>(() => {
    const saved = localStorage.getItem('tz-zones');
    try {
      return saved ? JSON.parse(saved) as string[] : ['Asia/Shanghai'];
    } catch {
      return ['Asia/Shanghai'];
    }
  });

  // 当前选中的时区 ID，或 null
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // 同步到 localStorage
  useEffect(() => {
    localStorage.setItem('tz-zones', JSON.stringify(zoneList));
  }, [zoneList]);

  // 点击热门城市或地图标记时调用
  const handleSelectZone = (zoneId: string) => {
    setSelectedZone(zoneId);
    setZoneList(prev => (prev.includes(zoneId) ? prev : [...prev, zoneId]));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* 世界地图，全屏 */}
      <div className="w-full h-screen">
        <WorldMap zones={zoneList} onSelectZone={handleSelectZone} />
      </div>

      {/* 下方功能区 */}
      <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
        {/* 主时钟 */}
        <div className="text-center mb-8">
          <Clock />
        </div>

        {/* 多时区时钟列表 */}
        <div className="mb-8">
          <TimeZoneClockList
            selectedZone={selectedZone}
            zones={zoneList}
            setZones={setZoneList}
          />
        </div>

        {/* 热门城市网格 */}
        <div className="mb-8">
          <PopularCityGrid onCityClick={handleSelectZone} />
        </div>
      </div>
    </div>
  );
};

export default App;
