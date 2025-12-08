import { create } from "zustand";

export const useEventsStore = create((set) => ({
  lastChangeId: null,
  pollingPaused: false,

  // Устанавливаем новый lastChangeId
  setLastChangeId: (id) => set({ lastChangeId: id }),

  // Пауза поллинга: сбрасываем lastChangeId и ставим флаг
  pausePolling: () => set({ lastChangeId: null, pollingPaused: true }),

  // Возобновление поллинга с новым lastChangeId
  resumePolling: (newId) =>
    set({ lastChangeId: newId, pollingPaused: false }),
}));
