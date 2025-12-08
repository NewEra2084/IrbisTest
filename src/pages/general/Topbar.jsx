import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
} from '@fortawesome/free-solid-svg-icons';

import LanguageSelector from '@/components/ui/LanguageSelector';
import ThemeSelector from '@/components/ui/ThemeSelector';
import FilterToggleButton from '@/components/ui/FilterToggleButton';
import MainMenu from './MainMenu';
import Logo from './Logo';

export default function Topbar() {
  return (
    <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-white shadow-sm dark:bg-gray-900">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Logo/>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">DAGMind</span>
        </div>

        {/* Main Menu */}
        <MainMenu />
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-3 mt-2 md:mt-0">
        <FilterToggleButton />
        <ThemeSelector />
        <LanguageSelector />

        {/* User Info */}
        <div className="flex items-center space-x-2 px-2 py-1 border rounded-md shadow-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="h-8 w-8 rounded-full"
          />
          <div className="text-left text-sm hidden sm:block">
            <div className="font-semibold text-gray-800 dark:text-white">Michael Berndt</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">Founder</div>
          </div>
        </div>
      </div>
    </div>
  );
}
