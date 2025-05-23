// src/components/AutoCompleteInput.tsx
import React from 'react';
import Downshift from 'downshift';

interface AutoCompleteInputProps {
  items: string[];
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
  placeholder?: string;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  items,
  value,
  onChange,
  onSelect,
  placeholder,
}) => (
  <Downshift
    inputValue={value}
    onChange={(selection) => {
      if (selection) onSelect(selection.toString());
    }}
    onInputValueChange={(inputVal) => onChange(inputVal)}
    itemToString={(item) => (item ? item.toString() : '')}
  >
    {({
      getInputProps,
      getItemProps,
      getMenuProps,
      isOpen,
      highlightedIndex,
      inputValue,
    }) => (
      <div className="relative w-full">
        <input
          {...getInputProps({
            placeholder,
            className:
              'w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400',
          })}
        />
        <ul
          {...getMenuProps()}
          className="absolute z-10 w-full max-h-60 overflow-auto bg-white dark:bg-gray-800 rounded shadow"
        >
          {isOpen &&
            items
              .filter((item) =>
                item.toLowerCase().includes(inputValue.trim().toLowerCase())
              )
              .map((item, index) => (
                <li
                  key={item}
                  {...getItemProps({ item, index })}
                  className={`px-3 py-1 cursor-pointer ${
                    highlightedIndex === index
                      ? 'bg-blue-100 dark:bg-gray-600'
                      : ''
                  }`}
                >
                  {item}
                </li>
              ))}
        </ul>
      </div>
    )}
  </Downshift>
);

export default AutoCompleteInput;
