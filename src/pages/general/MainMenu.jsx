import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useLocation } from 'react-router-dom';

export default function MainMenu({ links }) {
  const location = useLocation();

  return (
    <div className="flex items-center space-x-2 ml-4">
      {links.map(({ to, icon, label }) => {
        const isActive = location.pathname.startsWith(to);

        return (
          <div key={to} className="relative group">
            <NavLink
              to={to}
              className={`p-2 rounded transition-colors duration-200 ${
                isActive
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-label={label}
            >
              <FontAwesomeIcon icon={icon} className="h-5 w-5" />
            </NavLink>
            <div className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none whitespace-nowrap">
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
