import { useRef } from "react";
import { useModalStore } from "@/store/modalStore";

const AbstractModal = ({ modalKey, children }) => {
  const { closeModal } = useModalStore();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal(modalKey);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="
          bg-white dark:bg-gray-800 relative
          w-full max-w-md
          flex flex-col
          p-6
          shadow-xl dark:shadow-none
          rounded-none sm:rounded-2xl
          h-full sm:h-auto
          max-h-full sm:max-h-[80vh]
          overflow-hidden
        "
      >
        {children}
      </div>
    </div>
  );
};

export default AbstractModal;
