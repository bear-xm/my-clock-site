// src/components/PopularCityGrid.tsx
import React, { useEffect, useState } from 'react';
import { cityCoords } from '../data/cityCoords';

interface PopularCityGridProps {
  onCityClick: (zoneId: string) => void;
}

const popularZones: string[] = [
  'America/Los_Angeles',
  'Asia/Tokyo',
  'Europe/London',
  'America/New_York',
  'Europe/Tallinn',
  'Asia/Dubai',
  'Australia/Sydney',
  'America/Sao_Paulo',
  'Africa/Tripoli',
  'Asia/Dubai',
];

const PopularCityGrid: React.FC<PopularCityGridProps> = ({ onCityClick }) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {popularZones.map((zone) => {
        const city = cityCoords[zone];
        const name = city?.name ?? zone.split('/').pop()!.replace(/_/g, ' ');
        const timeStr = now.toLocaleTimeString(undefined, {
          timeZone: zone,
          hour12: false,
        });
        return (
          <div
            key={zone}
            onClick={() => onCityClick(zone)}
            className="
              cursor-pointer
              bg-gray-100 dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              hover:bg-gray-200 dark:hover:bg-gray-600
              transition
              rounded-lg
              p-4
              flex flex-col items-center
            "
          >
            <div className="text-lg font-semibold">{name}</div>
            <div className="text-sm mt-1">{timeStr}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PopularCityGrid;
