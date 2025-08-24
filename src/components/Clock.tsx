// src/components/Clock.tsx
import React, { useEffect, useState } from 'react';

const Clock: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // 时间（24小时制，补零）
  const timeStr = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // 日期（YYYY年M月D日）与星期（星期一/二…）
  const dateStr = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);

  const weekdayStr = new Intl.DateTimeFormat('zh-CN', {
    weekday: 'long',
  }).format(now);

  return (
    <div className="w-full flex flex-col items-center justify-center select-none">
      {/* 主时间 */}
      <div
        className="font-bold text-gray-100"
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
      >
        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide">
          {timeStr}
        </span>
      </div>

      {/* 日期 + 星期 */}
      <div className="mt-2 text-gray-300 text-base sm:text-lg md:text-xl">
        {dateStr} · {weekdayStr}
      </div>
    </div>
  );
};

export default Clock;
