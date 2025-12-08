import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

export default function SimpleButton({keyName, title, icon, onClick}) {
  const { t } = useTranslation();

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-600 dark:text-gray-300"
        aria-label={t(title)}
      >
        <FontAwesomeIcon icon={icon} className="h-5 w-5" />
      </button>

      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        {t(title)}
      </div>
    </div>
  );
}
