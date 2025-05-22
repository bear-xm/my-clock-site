// src/App.tsx
import React, { useState, useEffect } from 'react';
import ThemeSwitcher from './components/ThemeSwitcher';
import Clock from './components/Clock';
import TimeZoneClockList from './components/TimeZoneClockList';
import WorldMap from './components/WorldMap';
import PopularCityGrid from './components/PopularCityGrid';

function App() {
  // 1. 初始化：优先从 localStorage 读，没有再用默认 ['Asia/Shanghai']
  const [zoneList, setZoneList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tz-zones');
      return saved ? JSON.parse(saved) as string[] : ['Asia/Shanghai'];
    } catch {
      return ['Asia/Shanghai'];
    }
  });

  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // 2. 任何 zoneList 变动，都写回 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tz-zones', JSON.stringify(zoneList));
    } catch {
      // 如果禁用了 localStorage，可以在这里做降级处理
      console.warn('无法写入 localStorage');
    }
  }, [zoneList]);

  // 3. 地图点击添加
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
      {/* 地图：全屏 */}
      <div className="w-full h-screen">
        <WorldMap zones={zoneList} onSelectZone={setSelectedZone} />
      </div>

      {/* 下方功能区：限宽居中 */}
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
            setZones={setZoneList}  // 传入同一个 setter！
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
