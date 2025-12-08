import { create } from "zustand";

export const useCompanyStore = create((set) => ({
  company: null,

  setCompany: (company) => set({ company }),
  updateCompany: (updates) =>
    set((state) => ({ company: { ...state.company, ...updates } })),
  clearCompany: () => set({ company: null }),
}));
