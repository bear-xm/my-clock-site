import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const Clock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);
    return (_jsx("div", { className: "text-6xl font-mono text-gray-900 dark:text-gray-100", children: time.toLocaleTimeString() }));
};
export default Clock;
