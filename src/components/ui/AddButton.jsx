import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useModalStore } from '@/store/modalStore';

export default function AddButton({methods}) {
  const { t } = useTranslation();
  const openModal = useModalStore((state) => state.openModal);

  const handleClick = () => {
    openModal(t('modal.add.epic.title'), "asdasdas");
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-600 dark:text-gray-300"
        aria-label={t('modal.add.epic.title')}
      >
        <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
      </button>

      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        {t('modal.add.epic.title')}
      </div>
    </div>
  );
}
