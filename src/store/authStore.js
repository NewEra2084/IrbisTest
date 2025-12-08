import { create } from "zustand";
import { authApi } from "@/js/api-auth";
import { useUserStore } from "@/store/userStore";
import { syncUserData, clearUserData } from "@/store/helpers/user-data-helper";

export const useAuthStore = create((set, get) => ({
  isLoginModalOpen: false,
  pendingRequests: [],
  isAuthChecked: false,
  isLoading: false,
  error: null,

  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  enqueueRequest: (cb) =>
        new Promise((resolve) => {
          const currentUser = useUserStore.getState().user;//get().user;

          set((state) => ({
            pendingRequests: [
              ...state.pendingRequests,
              { cb, resolve, userAtRequestTime: currentUser },
            ],
        }));
  }),

  login: async (credentials) => {
    const data = await authApi.login(credentials);
    syncUserData(data); // ✅ пользователь + компания
    set({ isLoginModalOpen: false });

    const { pendingRequests } = get();
    pendingRequests
                .filter((r) => r.userAtRequestTime.username === credentials.username) // или просто очищаем все
                .forEach((r) => r.resolve(r.cb()));

    set({ pendingRequests: [] });
  },

  me: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.me();
      syncUserData(data);
    } catch (error) {
      clearUserData(); // ✅ очищаем при ошибке
      set({ error });
    } finally {
      set({ isAuthChecked: true, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // даже если запрос не удался — всё равно чистим стор
    } finally {
      clearUserData(); // ✅ централизованная очистка
      set({ isAuthChecked: false });
    }
  },
}));
