import React, { useState, useEffect, useRef } from 'react';
import AutoCompleteInput from './AutoCompleteInput';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useSwipeable, SwipeableHandlers } from 'react-swipeable';

export interface TimeZoneClockListProps {
  selectedZone?: string | null;
  zones: string[];
  setZones: React.Dispatch<React.SetStateAction<string[]>>;
}

const staticNames: Record<string, string> = {
  /* 省略… 保持你原有的完整映射，包括 'Europe/Tallinn': '马尔杜' */
};

function deriveCityLabel(zone: string): string {
  return staticNames[zone] ?? zone.split('/').pop()!.replace(/_/g, ' ');
}

interface TimeZoneItemProps {
  zone: string;
  index: number;
  isSelected: boolean;
  currentTime: Date;
  onRemove: (zone: string) => void;
  onRef: (el: HTMLDivElement | null, zone: string) => void;
}

const TimeZoneItem: React.FC<TimeZoneItemProps> = ({
  zone,
  index,
  isSelected,
  currentTime,
  onRemove,
  onRef,
}) => {
  // 仅在此组件调用 Hook，保证顺序稳定
  const handlers: SwipeableHandlers = useSwipeable({
    onSwipedLeft: () => onRemove(zone),
    trackMouse: true,
  });

  const timeStr = currentTime.toLocaleTimeString(undefined, {
    timeZone: zone,
    hour12: false,
  });

  return (
    <Draggable draggableId={zone} index={index}>
      {(prov) => {
        // 合并 ref：既给 react-beautiful-dnd 也给父组件保存 DOM
        const setRefs = (el: HTMLDivElement | null) => {
          prov.innerRef(el);
          onRef(el, zone);
        };

        return (
          <div
            {...handlers}
            ref={setRefs}
            {...prov.draggableProps}
            {...prov.dragHandleProps}
            className={`flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded transition ${
              isSelected ? 'ring-2 ring-yellow-400 dark:ring-yellow-600' : ''
            }`}
          >
            <span className="text-gray-900 dark:text-gray-100">
              {deriveCityLabel(zone)}
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {timeStr}
            </span>
            <button
              onClick={() => onRemove(zone)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 focus:outline-none"
            >
              删除
            </button>
          </div>
        );
      }}
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
    const entry = Object.entries(staticNames).find(
      ([, name]) => name === zoneId
    );
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
    setZones(zones.filter((z) => z !== zone));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const updated = Array.from(zones);
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    setZones(updated);
  };

  const handleRef = (el: HTMLDivElement | null, zone: string) => {
    zoneRefs.current[zone] = el;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow rounded p-4 overflow-auto max-h-[50vh]">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        多时区时钟
      </h2>

      <div className="flex mb-2 gap-2">
        <div className="flex-grow">
          <AutoCompleteInput
            items={Object.values(staticNames)}
            value={input}
            onChange={(v) => {
              setInput(v);
              setError('');
            }}
            onSelect={addZone}
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
                  isSelected={selectedZone === zone}
                  currentTime={now}
                  onRemove={removeZone}
                  onRef={handleRef}
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
