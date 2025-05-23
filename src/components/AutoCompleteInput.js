import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Downshift from 'downshift';
const AutoCompleteInput = ({ items, value, onChange, onSelect, placeholder, }) => (_jsx(Downshift, { inputValue: value, onChange: (selection) => {
        if (selection)
            onSelect(selection.toString());
    }, onInputValueChange: (inputVal) => onChange(inputVal ?? ''), itemToString: (item) => (item ? item.toString() : ''), children: ({ getInputProps, getItemProps, getMenuProps, isOpen, highlightedIndex, inputValue, }) => {
        const safeInput = inputValue ?? '';
        return (_jsxs("div", { className: "relative w-full", children: [_jsx("input", { ...getInputProps({
                        placeholder,
                        className: 'w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400',
                    }) }), _jsx("ul", { ...getMenuProps(), className: "absolute z-10 w-full max-h-60 overflow-auto bg-white dark:bg-gray-800 rounded shadow", children: isOpen &&
                        items
                            .filter((item) => item.toLowerCase().includes(safeInput.toLowerCase()))
                            .map((item, index) => (_jsx("li", { ...getItemProps({ item, index }), className: `px-3 py-1 cursor-pointer ${highlightedIndex === index
                                ? 'bg-blue-100 dark:bg-gray-600'
                                : ''}`, children: item }, item))) })] }));
    } }));
export default AutoCompleteInput;
