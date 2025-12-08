import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ items = [] }) {
  return (
    <aside
      id="sidebar"
      className="group bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-16 hover:w-48 transition-[width] duration-300 overflow-hidden"
    >
      <div className="flex flex-col items-start py-4 h-full">
        <nav className="space-y-2 text-gray-700 dark:text-gray-300 w-full px-2">
          {items.map((item) => (
            <NavLink
              key={item.key}
              to={item.link}
              end={false}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded transition ${
                  isActive
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <FontAwesomeIcon icon={item.icon} className="text-base w-5" />
              <span className="label group-hover:inline hidden text-sm">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
