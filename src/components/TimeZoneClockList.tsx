// src/components/TimeZoneClockList.tsx
import React, { useState, useEffect, useRef } from 'react';
import AutoCompleteInput from './AutoCompleteInput';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useSwipeable } from 'react-swipeable';

export interface TimeZoneClockListProps {
  selectedZone?: string | null;
  zones: string[];
  setZones: React.Dispatch<React.SetStateAction<string[]>>;
}

const staticNames: Record<string, string> = {
  // 亚洲
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
  // 欧洲
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
  // 北美
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
  // 南美
  'America/Sao_Paulo': '圣保罗',
  'America/Argentina/Buenos_Aires': '布宜诺斯艾利斯',
  // 非洲
  'Africa/Cairo': '开罗',
  'Africa/Johannesburg': '约翰内斯堡',
  'Africa/Nairobi': '内罗毕',
  'Africa/Lagos': '拉各斯',
  // 大洋洲
  'Australia/Sydney': '悉尼',
  'Australia/Melbourne': '墨尔本',
  'Pacific/Auckland': '奥克兰',
  'Pacific/Fiji': '斐济',
};

function deriveCityLabel(zone: string): string {
  return staticNames[zone] ?? zone.split('/').pop()!.replace(/_/g, ' ');
}

// 抽离出的列表项组件，保证 Hooks 在顶层调用
interface TimeZoneItemProps {
  zone: string;
  index: number;
  selectedZone?: string | null;
  now: Date;
  removeZone: (zone: string) => void;
  zoneRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
}

const TimeZoneItem: React.FC<TimeZoneItemProps> = ({
  zone,
  index,
  selectedZone,
  now,
  removeZone,
  zoneRefs,
}) => {
  // Hook 必须写在组件顶层
  const handlers = useSwipeable({
    onSwipedLeft: () => removeZone(zone),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <Draggable draggableId={zone} index={index} key={zone}>
      {(prov) => (
        <div
          ref={(el) => {
            prov.innerRef(el);
            zoneRefs.current[zone] = el;
          }}
          {...prov.draggableProps}
          {...prov.dragHandleProps}
          {...handlers}
          className={`flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded transition ${
            selectedZone === zone
              ? 'ring-2 ring-yellow-400 dark:ring-yellow-600'
              : ''
          }`}
        >
          <span className="text-gray-900 dark:text-gray-100">
            {deriveCityLabel(zone)}
          </span>
          <span className="text-gray-900 dark:text-gray-100">
            {now.toLocaleTimeString(undefined, { timeZone: zone })}
          </span>
          <button
            onClick={() => removeZone(zone)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 focus:outline-none"
          >
            删除
          </button>
        </div>
      )}
    </Draggable>
  );
};

const TimeZoneClockList: React.FC<TimeZoneClockListProps> = ({
  selectedZone,
  zones,
  setZones,
}) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState<Date>(new Date());
  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 新增时区
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

  // 删除时区
  const removeZone = (zone: string) => {
    setZones(zones.filter((z) => z !== zone));
  };

  // 拖拽排序
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const updated = Array.from(zones);
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    setZones(updated);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow rounded p-4 overflow-auto max-h-[50vh]">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        多时区时钟
      </h2>

      {/* 自动补全输入 */}
      <div className="flex mb-2 gap-2">
        <div className="flex-grow">
          <AutoCompleteInput
            items={Object.values(staticNames)}
            value={input}
            onChange={(v) => { setInput(v); setError(''); }}
            onSelect={() => addZone()}
            placeholder="输入城市名称或时区中文名"
          />
        </div>
        <button
          onClick={addZone}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          添加
        </button>
      </div>
      {error && <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>}

      {/* 拖拽＋滑动＋响应式网格 */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tz-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {zones.map((zone, idx) => (
                <TimeZoneItem
                  key={zone}
                  zone={zone}
                  index={idx}
                  selectedZone={selectedZone}
                  now={now}
                  removeZone={removeZone}
                  zoneRefs={zoneRefs}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TimeZoneClockList;
