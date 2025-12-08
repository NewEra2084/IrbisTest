import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useShowFilters, useToggleShowFilters } from '@/store/filterStore';
import { useTranslation } from 'react-i18next';

export default function FilterToggleButton() {
  const showFilters = useShowFilters();
  const toggleFilters = useToggleShowFilters();
  const { t } = useTranslation();

  return (
    <div className="relative group">
      <button
        onClick={toggleFilters}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200
          ${showFilters ? 'bg-gray-200 dark:bg-gray-700' : ''}
          text-gray-600 dark:text-gray-300`}
        aria-label={t('filters.toggleAriaLabel')}
      >
        <FontAwesomeIcon icon={faFilter} className="h-5 w-5" />
      </button>

      {/* Tooltip below the button */}
      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        {showFilters ? t('filters.hide') : t('filters.show')}
      </div>
    </div>
  );
}