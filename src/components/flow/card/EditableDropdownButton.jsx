import { useState, useRef, useEffect, memo } from 'react';

export const EditableDropdownButton = ({ items }) => {
  const [allItems] = useState(items);
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setOpen(false);
  };

  const handleFilter = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredItems(allItems.filter(item => item.name.toLowerCase().includes(query)));
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-2 py-1 border rounded text-sm bg-white dark:bg-gray-800 dark:text-white shadow-sm hover:bg-gray-50"
      >
        {selectedItem ? selectedItem.name : <i className="bi bi-list-task" />}
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-48 origin-top-right bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to filter..."
              onChange={handleFilter}
              className="w-full px-2 py-1 text-sm border rounded outline-none dark:bg-gray-600 dark:text-white"
            />
          </div>
          <ul className="max-h-60 overflow-auto text-sm">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {item.name}
              </li>
            ))}
            {filteredItems.length === 0 && (
              <li className="px-4 py-2 text-gray-500 dark:text-gray-300">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(EditableDropdownButton);
