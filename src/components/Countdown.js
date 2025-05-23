import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
/**
 * Countdown component: allows the user to set a time and starts countdown with alert on finish.
 */
const Countdown = () => {
    const [input, setInput] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [remaining, setRemaining] = useState(null);
    const timerRef = useRef(null);
    // Start the countdown based on input values
    const start = () => {
        const total = input.hours * 3600 + input.minutes * 60 + input.seconds;
        if (total <= 0)
            return;
        setRemaining(total);
    };
    // Countdown effect
    useEffect(() => {
        if (remaining === null)
            return;
        timerRef.current = setInterval(() => {
            setRemaining(prev => {
                if (prev === null)
                    return null;
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    alert('倒计时结束！');
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, [remaining]);
    // Format seconds to HH:MM:SS
    const formatTime = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };
    return (_jsx("div", { className: "p-6 bg-white shadow-lg rounded-xl", children: remaining === null ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "number", className: "w-16 p-2 border rounded", value: input.hours, onChange: e => setInput({ ...input, hours: +e.target.value }), placeholder: "h" }), _jsx("input", { type: "number", className: "w-16 p-2 border rounded", value: input.minutes, onChange: e => setInput({ ...input, minutes: +e.target.value }), placeholder: "m" }), _jsx("input", { type: "number", className: "w-16 p-2 border rounded", value: input.seconds, onChange: e => setInput({ ...input, seconds: +e.target.value }), placeholder: "s" })] }), _jsx("button", { className: "px-4 py-2 bg-blue-500 text-white rounded", onClick: start, children: "Start" })] })) : (_jsx("div", { className: "text-4xl font-mono text-center", children: formatTime(remaining) })) }));
};
export default Countdown;
