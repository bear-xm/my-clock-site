import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';
import Clock from './components/Clock';
import TimeZoneClockList from './components/TimeZoneClockList';
import WorldMap from './components/WorldMap';
import PopularCityGrid from './components/PopularCityGrid';

const App: React.FC = () => {
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
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* 地图全屏显示 */}
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

          {/* 底部主题切换 */}
          <div className="flex justify-center mt-8">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
