import { create } from 'zustand';

let modalId = 0;

export const useModalStore = create((set) => ({
  modals: [],

  updateModalProps: (key, updater) =>
      set((state) => ({
        modals: state.modals.map((m) =>
          m.key === key
            ? {
                ...m,
                props:
                  typeof updater === "function"
                    ? { ...m.props, ...updater(m.props) }
                    : { ...m.props, ...updater },
              }
            : m
        ),
  })),
  openModal: ({ type = "default", title, props = {} }) => {
        let newKey;
        set((state) => {
          newKey = `modal-${++modalId}`;
          return {
            modals: [
              ...state.modals,
              { key: newKey, type, title, props },
            ],
          };
        });
        return newKey;
  },
  closeModal: (key) =>
    set((state) => ({
      modals: state.modals.filter((m) => m.key !== key),
    })),
  closeAllModals: () =>
    set(() => ({
      modals: [],
    })),
}));

