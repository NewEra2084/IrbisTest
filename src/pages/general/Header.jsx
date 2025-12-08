import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import {
  faBars,
} from '@fortawesome/free-solid-svg-icons';

import LanguageSelector from '@/components/ui/LanguageSelector';
import ThemeSelector from '@/components/ui/ThemeSelector';
import FilterToggleButton from '@/components/ui/FilterToggleButton';
import AddButton from '@/components/ui/AddButton';
import UserProfileLink from '@/components/ui/UserProfileLink';
import MainMenu from './MainMenu';
import Toolbar from './Toolbar';
import Logo from './Logo';

export default function Header({data,context}) {
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
        <MainMenu links={data.menu.links}/>
      </div>

      {/* Right section */}
      <div className="flex flex-grow items-center space-x-3 mt-2 md:mt-0 justify-end">
        <div className="flex flex-grow items-center space-x-4 justify-between md:justify-end">
            <div className="flex">
                <Toolbar buttons={data.toolbar.buttons} context={context}/>
            </div>
        </div>
        <div className="flex items-center space-x-2 justify-end">
            <FilterToggleButton />
            <ThemeSelector />
            <LanguageSelector />
            <UserProfileLink />
        </div>
      </div>
    </div>
  );
}
