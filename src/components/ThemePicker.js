import { jsx as _jsx } from "react/jsx-runtime";
import { useTheme, themes } from '../contexts/ThemeContext';
const ThemePicker = () => {
    const { themeName, setThemeName } = useTheme();
    return (_jsx("select", { value: themeName, onChange: (e) => setThemeName(e.target.value), className: "p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none", children: Object.keys(themes).map((t) => (_jsx("option", { value: t, children: t }, t))) }));
};
export default ThemePicker;
