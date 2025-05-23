// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

export const themes = {
  light: { '--bg': '#f7fafc', '--text': '#2d3748', '--primary': '#3182ce' },
  dark: { '--bg': '#1a202c', '--text': '#edf2f7', '--primary': '#63b3ed' },
  ocean: { '--bg': '#2a4365', '--text': '#e2e8f0', '--primary': '#90cdf4' },
  sunset: { '--bg': '#ffedd5', '--text': '#7f1d1d', '--primary': '#f97316' },
};

type ThemeName = keyof typeof themes;

interface ThemeContextValue {
  themeName: ThemeName;
  setThemeName: (t: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeName: 'light',
  setThemeName: () => {},
});

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  // 1. 从 localStorage 读取初始主题
  const stored = localStorage.getItem('theme') as ThemeName | null;
  const [themeName, setThemeName] = useState<ThemeName>(stored ?? 'light');

  useEffect(() => {
    const root = document.documentElement;
    // 写 CSS 变量
    const vars = themes[themeName];
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v as string));
    // 切换 Tailwind dark 类
    if (themeName === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    // 持久化到 localStorage
    localStorage.setItem('theme', themeName);
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
