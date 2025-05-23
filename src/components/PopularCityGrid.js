import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/PopularCityGrid.tsx
import { useEffect, useState } from 'react';
import { cityCoords } from '../data/cityCoords';
const popularZones = [
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Europe/London',
    'America/New_York',
    'Europe/Tallinn',
    'Asia/Dubai',
    'Australia/Sydney',
    'America/Sao_Paulo',
];
const PopularCityGrid = ({ onCityClick }) => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: popularZones.map((zone) => {
            const city = cityCoords[zone];
            const name = city?.name ?? zone.split('/').pop().replace(/_/g, ' ');
            const timeStr = now.toLocaleTimeString(undefined, {
                timeZone: zone,
                hour12: false,
            });
            return (_jsxs("div", { onClick: () => onCityClick(zone), className: "\r\n              cursor-pointer\r\n              bg-gray-100 dark:bg-gray-700\r\n              text-gray-900 dark:text-gray-100\r\n              hover:bg-gray-200 dark:hover:bg-gray-600\r\n              transition\r\n              rounded-lg\r\n              p-4\r\n              flex flex-col items-center\r\n            ", children: [_jsx("div", { className: "text-lg font-semibold", children: name }), _jsx("div", { className: "text-sm mt-1", children: timeStr })] }, zone));
        }) }));
};
export default PopularCityGrid;
