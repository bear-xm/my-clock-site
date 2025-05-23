import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import AutoCompleteInput from './AutoCompleteInput';
import { DragDropContext, Droppable, Draggable, } from 'react-beautiful-dnd';
import { useSwipeable } from 'react-swipeable';
const staticNames = {
/* 省略… 保持你原有的完整映射，包括 'Europe/Tallinn': '马尔杜' */
};
function deriveCityLabel(zone) {
    return staticNames[zone] ?? zone.split('/').pop().replace(/_/g, ' ');
}
const TimeZoneItem = ({ zone, index, isSelected, currentTime, onRemove, onRef, }) => {
    // 仅在此组件调用 Hook，保证顺序稳定
    const handlers = useSwipeable({
        onSwipedLeft: () => onRemove(zone),
        trackMouse: true,
    });
    const timeStr = currentTime.toLocaleTimeString(undefined, {
        timeZone: zone,
        hour12: false,
    });
    return (_jsx(Draggable, { draggableId: zone, index: index, children: (prov) => {
            // 合并 ref：既给 react-beautiful-dnd 也给父组件保存 DOM
            const setRefs = (el) => {
                prov.innerRef(el);
                onRef(el, zone);
            };
            return (_jsxs("div", { ...handlers, ref: setRefs, ...prov.draggableProps, ...prov.dragHandleProps, className: `flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded transition ${isSelected ? 'ring-2 ring-yellow-400 dark:ring-yellow-600' : ''}`, children: [_jsx("span", { className: "text-gray-900 dark:text-gray-100", children: deriveCityLabel(zone) }), _jsx("span", { className: "text-gray-900 dark:text-gray-100", children: timeStr }), _jsx("button", { onClick: () => onRemove(zone), className: "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 focus:outline-none", children: "\u5220\u9664" })] }));
        } }));
};
const TimeZoneClockList = ({ selectedZone, zones, setZones, }) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [now, setNow] = useState(new Date());
    const zoneRefs = useRef({});
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        if (selectedZone && zoneRefs.current[selectedZone]) {
            zoneRefs.current[selectedZone].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [selectedZone]);
    const addZone = () => {
        let zoneId = input.trim();
        if (!zoneId)
            return;
        const entry = Object.entries(staticNames).find(([, name]) => name === zoneId);
        if (entry)
            zoneId = entry[0];
        if (zones.includes(zoneId)) {
            setError('该时区已添加');
            return;
        }
        try {
            Intl.DateTimeFormat(undefined, { timeZone: zoneId });
        }
        catch {
            setError('无效的时区');
            return;
        }
        setZones([...zones, zoneId]);
        setInput('');
        setError('');
    };
    const removeZone = (zone) => {
        setZones(zones.filter((z) => z !== zone));
    };
    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination)
            return;
        const updated = Array.from(zones);
        const [moved] = updated.splice(source.index, 1);
        updated.splice(destination.index, 0, moved);
        setZones(updated);
    };
    const handleRef = (el, zone) => {
        zoneRefs.current[zone] = el;
    };
    return (_jsxs("div", { className: "w-full bg-white dark:bg-gray-800 shadow rounded p-4 overflow-auto max-h-[50vh]", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2", children: "\u591A\u65F6\u533A\u65F6\u949F" }), _jsxs("div", { className: "flex mb-2 gap-2", children: [_jsx("div", { className: "flex-grow", children: _jsx(AutoCompleteInput, { items: Object.values(staticNames), value: input, onChange: (v) => {
                                setInput(v);
                                setError('');
                            }, onSelect: addZone, placeholder: "\u8F93\u5165\u57CE\u5E02\u540D\u79F0\u6216\u65F6\u533A\u4E2D\u6587\u540D" }) }), _jsx("button", { onClick: addZone, className: "p-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400", children: "\u6DFB\u52A0" })] }), error && _jsx("p", { className: "text-red-500 dark:text-red-400 mb-2", children: error }), _jsx(DragDropContext, { onDragEnd: onDragEnd, children: _jsx(Droppable, { droppableId: "tz-list", children: (provided) => (_jsxs("div", { ref: provided.innerRef, ...provided.droppableProps, className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: [zones.map((zone, idx) => (_jsx(TimeZoneItem, { zone: zone, index: idx, isSelected: selectedZone === zone, currentTime: now, onRemove: removeZone, onRef: handleRef }, zone))), provided.placeholder] })) }) })] }));
};
export default TimeZoneClockList;
