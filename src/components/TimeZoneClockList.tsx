// src/components/TimeZoneClockList.tsx
import React, { useState, useEffect, useRef } from 'react';

export interface TimeZoneClockListProps {
  selectedZone?: string | null;
  zones: string[];
  setZones: React.Dispatch<React.SetStateAction<string[]>>;
}

const staticNames: Record<string, string> = {
  // — 亚洲 —
  'Asia/Tokyo': '东京',
  'Asia/Shanghai': '上海',
  'Asia/Beijing': '北京',
  'Asia/Chongqing': '重庆',
  'Asia/Harbin': '哈尔滨',
  'Asia/Urumqi': '乌鲁木齐',
  'Asia/Hong_Kong': '香港',
  'Asia/Taipei': '台北',
  'Asia/Seoul': '首尔',
  'Asia/Kolkata': '孟买',
  'Asia/Singapore': '新加坡',
  'Asia/Kuala_Lumpur': '吉隆坡',
  'Asia/Jakarta': '雅加达',
  'Asia/Bangkok': '曼谷',
  'Asia/Dubai': '迪拜',
  'Asia/Tel_Aviv': '特拉维夫',
  'Asia/Tehran': '德黑兰',
  // — 欧洲 —
  'Europe/London': '伦敦',
  'Europe/Paris': '巴黎',
  'Europe/Berlin': '柏林',
  'Europe/Moscow': '莫斯科',
  'Europe/Rome': '罗马',
  'Europe/Madrid': '马德里',
  'Europe/Amsterdam': '阿姆斯特丹',
  'Europe/Istanbul': '伊斯坦布尔',
  'Europe/Zurich': '苏黎世',
  'Europe/Stockholm': '斯德哥尔摩',
  'Europe/Tallinn': '马尔杜',
  // — 北美 —
  'America/New_York': '纽约',
  'America/Toronto': '多伦多',
  'America/Vancouver': '温哥华',
  'America/Chicago': '芝加哥',
  'America/Denver': '丹佛',
  'America/Los_Angeles': '洛杉矶',
  'America/Mexico_City': '墨西哥城',
  'America/Phoenix': '凤凰城',
  'America/Anchorage': '安克雷奇',
  'Pacific/Honolulu': '檀香山',
  // — 南美 —
  'America/Sao_Paulo': '圣保罗',
  'America/Argentina/Buenos_Aires': '布宜诺斯艾利斯',
  // — 非洲 —
  'Africa/Cairo': '开罗',
  'Africa/Johannesburg': '约翰内斯堡',
  'Africa/Nairobi': '内罗毕',
  'Africa/Lagos': '拉各斯',
  // — 大洋洲 —
  'Australia/Sydney': '悉尼',
  'Australia/Melbourne': '墨尔本',
  'Pacific/Auckland': '奥克兰',
  'Pacific/Fiji': '斐济',
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
            ref={(el) => (refs.current[z] = el)}
            className={`flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded transition ${
              selectedZone === z ? 'ring-2 ring-yellow-400 dark:ring-yellow-600' : ''
            }`}
          >
            <span className="text-gray-900 dark:text-gray-100">{deriveCityLabel(z)}</span>
            <span className="text-gray-900 dark:text-gray-100">
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
