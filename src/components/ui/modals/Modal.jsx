import { useEffect } from "react";
import { useModalStore } from "@/store/modalStore";
import SingleModal from "./SingleModal";
import AbstractModalContent from "./content/AbstractModalContent";

const Modal = ({ TitleContent }) => {
  const { modals, closeModal } = useModalStore();  
  console.log(modals);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modals.length > 0) {
        const lastModal = modals[modals.length - 1];
        closeModal(lastModal.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modals, closeModal]);

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map(({ key, title, type, props, content }) => (
        <SingleModal
          key={key}
          modalKey={key}
          title={title}
          TitleContent={TitleContent}
        >
          <AbstractModalContent
            type={type}
            modalKey={key}
            props={props}
          ></AbstractModalContent>
        </SingleModal>
      ))}
    </>
  );
};

export default Modal;
