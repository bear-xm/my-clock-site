// src/components/ThemePicker.tsx
import React from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';

const ThemePicker: React.FC = () => {
  const { themeName, setThemeName } = useTheme();
  return (
    <select
      value={themeName}
      onChange={(e) => setThemeName(e.target.value)}
      className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
    >
      {Object.keys(themes).map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
};

export default ThemePicker;
