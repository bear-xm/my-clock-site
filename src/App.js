import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemePicker from './components/ThemePicker';
import Clock from './components/Clock';
import TimeZoneClockList from './components/TimeZoneClockList';
import WorldMap from './components/WorldMap';
import PopularCityGrid from './components/PopularCityGrid';
function App() {
    const [zoneList, setZoneList] = useState(() => {
        const saved = localStorage.getItem('tz-zones');
        return saved ? JSON.parse(saved) : ['Asia/Shanghai'];
    });
    const [selectedZone, setSelectedZone] = useState(null);
    useEffect(() => {
        localStorage.setItem('tz-zones', JSON.stringify(zoneList));
    }, [zoneList]);
    const handleCityClick = (zoneId) => {
        setSelectedZone(zoneId);
        setZoneList((prev) => prev.includes(zoneId) ? prev : [...prev, zoneId]);
    };
    return (_jsx(ThemeProvider, { children: _jsxs("div", { className: "min-h-screen bg-gray-100 dark:bg-gray-900", children: [_jsx("div", { className: "w-full h-screen", children: _jsx(WorldMap, { zones: zoneList, onSelectZone: setSelectedZone }) }), _jsxs("div", { className: "w-full max-w-screen-xl mx-auto px-4 py-8", children: [_jsx("div", { className: "flex justify-end mb-4", children: _jsx(ThemePicker, {}) }), _jsx("div", { className: "text-center mb-8", children: _jsx(Clock, {}) }), _jsx("div", { className: "mb-8", children: _jsx(TimeZoneClockList, { selectedZone: selectedZone, zones: zoneList, setZones: setZoneList }) }), _jsx("div", { className: "mb-8", children: _jsx(PopularCityGrid, { onCityClick: handleCityClick }) })] })] }) }));
}
export default App;
