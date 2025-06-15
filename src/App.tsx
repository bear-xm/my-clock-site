// src/App.js
import React, { useState, useEffect } from 'react';
import Clock from './components/Clock';
import TimeZoneClockList from './components/TimeZoneClockList';
import WorldMap from './components/WorldMap';
import PopularCityGrid from './components/PopularCityGrid';

function App() {
  // 从 localStorage 读取已保存的时区列表
  const [zoneList, setZoneList] = useState(() => {
    const saved = localStorage.getItem('tz-zones');
    try {
      return saved ? JSON.parse(saved) : ['Asia/Shanghai'];
    } catch {
      return ['Asia/Shanghai'];
    }
  });
  const [selectedZone, setSelectedZone] = useState(null);

  // 每当 zoneList 变化时，同步到 localStorage
  useEffect(() => {
    localStorage.setItem('tz-zones', JSON.stringify(zoneList));
  }, [zoneList]);

  // 点击热门城市时添加到列表
  const handleCityClick = (zoneId) => {
    setSelectedZone(zoneId);
    setZoneList((prev) =>
      prev.includes(zoneId) ? prev : [...prev, zoneId]
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* 世界地图 全屏 */}
      <div className="w-full h-screen">
        <WorldMap zones={zoneList} onSelectZone={setSelectedZone} />
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
          <PopularCityGrid onCityClick={handleCityClick} />
        </div>
      </div>
    </div>
  );
}

export default App;
