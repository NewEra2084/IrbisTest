import { create } from "zustand";
import { createLazyStore } from "../lazyStoreFactory";
import { extendStore } from "@/store/helpers/extend-helper";
import {collectionsApi} from "@/js/api/collections/collectionsApi";

// создаём хук Zustand через объединение базового и дополнительного стора
export const useLazyUsersStore = create(
  extendStore(
    createLazyStore({ name: "users" }),
    (set, get) => ({
      updateStatus: async (taskId, status) => {
        const updated = await tasksApi.updateStatus(taskId, status);
        get().updateItem(taskId, updated);
      },
    })
  )
);