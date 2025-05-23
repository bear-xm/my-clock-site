import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
/**
 * Stopwatch component: start/stop/reset timer with lap recording.
 */
const Stopwatch = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0); // milliseconds
    const [laps, setLaps] = useState([]);
    const timerRef = useRef(null);
    // Start or stop the stopwatch
    const toggle = () => {
        if (isRunning) {
            clearInterval(timerRef.current);
        }
        else {
            const startTime = Date.now() - elapsed;
            timerRef.current = setInterval(() => {
                setElapsed(Date.now() - startTime);
            }, 10);
        }
        setIsRunning(prev => !prev);
    };
    // Reset stopwatch and laps
    const reset = () => {
        if (timerRef.current)
            clearInterval(timerRef.current);
        setIsRunning(false);
        setElapsed(0);
        setLaps([]);
    };
    // Record current lap
    const lap = () => {
        setLaps(prev => [elapsed, ...prev]);
    };
    // Format milliseconds to mm:ss:ms
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
    };
    useEffect(() => {
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, []);
    return (_jsxs("div", { className: "p-6 bg-white shadow-lg rounded-xl w-full max-w-md", children: [_jsx("div", { className: "text-4xl font-mono text-center mb-4", children: formatTime(elapsed) }), _jsxs("div", { className: "flex justify-center space-x-4 mb-4", children: [_jsx("button", { onClick: toggle, className: "px-4 py-2 bg-green-500 text-white rounded", children: isRunning ? 'Stop' : 'Start' }), _jsx("button", { onClick: reset, className: "px-4 py-2 bg-red-500 text-white rounded", children: "Reset" }), _jsx("button", { onClick: lap, disabled: !isRunning, className: "px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50", children: "Lap" })] }), laps.length > 0 && (_jsx("div", { className: "max-h-32 overflow-auto", children: laps.map((time, i) => (_jsxs("div", { className: "flex justify-between border-b py-1", children: [_jsxs("span", { children: ["Lap ", laps.length - i] }), _jsx("span", { children: formatTime(time) })] }, i))) }))] }));
};
export default Stopwatch;
