// src/components/TimeZoneClockList.tsx
import React, { useState, useEffect, useRef } from 'react';

export interface TimeZoneClockListProps {
  selectedZone?: string | null;
  zones: string[];
  setZones: React.Dispatch<React.SetStateAction<string[]>>;
}

const staticNames: Record<string, string> = {
  /* 完整映射，包括 'Europe/Tallinn': '马尔杜' */
  'Asia/Tokyo': '东京',
  /* ... 其他时区 ... */
  'Europe/Tallinn': '马尔杜',
  /* ... */
};

function deriveCityLabel(zone: string): string {
  return staticNames[zone] ?? zone.split('/').pop()!.replace(/_/g, ' ');
}

const TimeZoneClockList: React.FC<TimeZoneClockListProps> = ({
  selectedZone,
  zones,
  setZones,
}) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedZone && refs.current[selectedZone]) {
      refs.current[selectedZone]!.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedZone]);

  const addZone = () => {
    let z = input.trim();
    if (!z) return;
    const found = Object.entries(staticNames).find(([, name]) => name === z);
    if (found) z = found[0];
    try {
      Intl.DateTimeFormat(undefined, { timeZone: z });
    } catch {
      setError('无效时区');
      return;
    }
    if (zones.includes(z)) {
      setError('该时区已添加');
    } else {
      setZones([...zones, z]);
      setError('');
    }
    setInput('');
  };

  const removeZone = (z: string) => setZones(zones.filter((x) => x !== z));

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow rounded p-4 overflow-auto max-h-[50vh]">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        多时区时钟
      </h2>

      <div className="flex mb-2">
        <input
          list="tz-list"
          className="flex-grow p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="输入城市或时区中文名"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
        />
        <button
          onClick={addZone}
          className="ml-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          添加
        </button>
      </div>
      {error && <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>}

      <datalist id="tz-list">
        {Object.entries(staticNames).map(([id, name]) => (
          <option key={id} value={name} />
        ))}
      </datalist>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {zones.map((z) => (
          <div
            key={z}
            ref={(el) => {
              refs.current[z] = el;
            }}
            className={`flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded transition ${
              selectedZone === z ? 'ring-2 ring-yellow-400 dark:ring-yellow-600' : ''
            }`}
          >
            <span className="text-base sm:text-lg text-gray-900 dark:text-gray-100">
              {deriveCityLabel(z)}
            </span>
            <span className="text-base sm:text-lg text-gray-900 dark:text-gray-100">
              {now.toLocaleTimeString(undefined, { timeZone: z })}
            </span>
            <button
              onClick={() => removeZone(z)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 focus:outline-none"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeZoneClockList;
