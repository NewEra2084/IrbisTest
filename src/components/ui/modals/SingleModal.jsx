import { useRef } from "react";
import { useModalStore } from "@/store/modalStore";

const SingleModal = ({ modalKey, title, children, TitleContent, ...props }) => {
  const { closeModal } = useModalStore();
  const modalRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal(modalKey);
    }
  };

  const resolvedTitle = (typeof title === 'function') ? title(props) : title;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="
          bg-white dark:bg-gray-800 relative
          w-full sm:max-w-md
          flex flex-col
          shadow-xl dark:shadow-none
          rounded-none sm:rounded-2xl
          h-screen sm:h-auto
          max-h-full sm:max-h-[80vh]
          overflow-hidden
        "
      >
        {/* Кнопка закрытия */}
        <button
          onClick={() => closeModal(modalKey)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>

        {/* Заголовок */}
        <div className="px-3 pt-3 pb-4">
          <h2 className="text-xl font-semibold pr-8 text-gray-900 dark:text-gray-100">
            {TitleContent ? <TitleContent title={resolvedTitle}/> : resolvedTitle}
          </h2>
        </div>

        {/* Контент + футер */}
        <div className="flex flex-col flex-1 min-h-0 px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SingleModal;
