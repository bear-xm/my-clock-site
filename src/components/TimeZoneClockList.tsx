// src/components/TimeZoneClockList.tsx
import React, { useState, useEffect, useRef } from 'react';

export interface TimeZoneClockListProps {
  selectedZone?: string | null;
  zones: string[];
  setZones: React.Dispatch<React.SetStateAction<string[]>>;
}

const staticNames: Record<string, string> = {
  // …（与之前版本相同）…
};

function deriveCityLabel(zone: string): string {
  return staticNames[zone] ?? zone.split('/').pop()!.replace(/_/g, ' ');
}

const TimeZoneClockList: React.FC<TimeZoneClockListProps> = ({
  selectedZone,
  zones,
  setZones
}) => {
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [now, setNow] = useState<Date>(new Date());
  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedZone && zoneRefs.current[selectedZone]) {
      zoneRefs.current[selectedZone]!.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedZone]);

  const addZone = () => {
    let zoneId = input.trim();
    if (!zoneId) return;

    const entry = Object.entries(staticNames).find(([, name]) => name === zoneId);
    if (entry) zoneId = entry[0];

    if (zones.includes(zoneId)) {
      setError('该时区已添加');
      return;
    }
    try {
      Intl.DateTimeFormat(undefined, { timeZone: zoneId });
    } catch {
      setError('无效的时区');
      return;
    }

    setZones([...zones, zoneId]);
    setInput('');
    setError('');
  };

  const removeZone = (zone: string) => {
    setZones(zones.filter(z => z !== zone));
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow rounded p-4 overflow-auto max-h-[50vh]">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        多时区时钟
      </h2>

      <div className="flex mb-2">
        <input
          list="tz-list"
          className="
            flex-grow p-2 border rounded
            bg-gray-50 dark:bg-gray-700
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setError('');
          }}
          placeholder="输入城市名称或时区 ID"
        />
        <button
          onClick={addZone}
          className="
            ml-2 p-2 bg-blue-600 text-white rounded
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        >
          添加
        </button>
      </div>
      {error && (
        <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
      )}

      <datalist id="tz-list">
        {Object.entries(staticNames).map(([id, name]) => (
          <option key={id} value={name} label={id} />
        ))}
      </datalist>

      <div className="grid grid-cols-2 gap-3">
        {zones.map(zone => (
          <div
            key={zone}
            ref={(el) => { zoneRefs.current[zone] = el; }}
            className={`
              flex justify-between items-center
              bg-gray-100 dark:bg-gray-700
              p-3 rounded transition
              ${selectedZone === zone
                ? 'ring-2 ring-yellow-400 dark:ring-yellow-600'
                : ''}
            `}
          >
            <span className="text-gray-900 dark:text-gray-100">
              {deriveCityLabel(zone)}
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {now.toLocaleTimeString(undefined, { timeZone: zone })}
            </span>
            <button
              onClick={() => removeZone(zone)}
              className="
                text-red-500 hover:text-red-700
                dark:text-red-400 dark:hover:text-red-600
                focus:outline-none
              "
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
