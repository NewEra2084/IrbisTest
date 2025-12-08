import { create } from "zustand";
import { cabinetApi } from "@/js/api-cabinet";

export const useUserStore = create((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),
  updateUser: (updates) =>
    set((state) => ({ user: { ...state.user, ...updates } })),
  clearUser: () => set({ user: null }),

  avatarLink: () => {
    const user = get().user;
    return user?.avatarKey ? cabinetApi.buildAvatarUrl(user.avatarKey) : null;
  },
}));
