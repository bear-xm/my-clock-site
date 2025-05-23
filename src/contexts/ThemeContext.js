import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useEffect } from 'react';
export const themes = {
    light: {
        '--bg': '#f7fafc',
        '--text': '#2d3748',
        '--primary': '#3182ce',
    },
    dark: {
        '--bg': '#1a202c',
        '--text': '#edf2f7',
        '--primary': '#63b3ed',
    },
    ocean: {
        '--bg': '#2a4365',
        '--text': '#e2e8f0',
        '--primary': '#90cdf4',
    },
    sunset: {
        '--bg': '#ffedd5',
        '--text': '#7f1d1d',
        '--primary': '#f97316',
    },
};
const ThemeContext = createContext({
    themeName: 'light',
    setThemeName: () => { },
});
export const ThemeProvider = ({ children }) => {
    const [themeName, setThemeName] = useState('light');
    useEffect(() => {
        const root = document.documentElement;
        // 1. 切换 CSS 变量
        const vars = themes[themeName];
        Object.entries(vars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        // 2. 切换 Tailwind 的 dark: 样式
        if (themeName === 'dark') {
            root.classList.add('dark');
        }
        else {
            root.classList.remove('dark');
        }
    }, [themeName]);
    return (_jsx(ThemeContext.Provider, { value: { themeName, setThemeName }, children: children }));
};
export const useTheme = () => useContext(ThemeContext);
