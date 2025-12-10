import { create } from "zustand";
import { createFetchStore } from "../fetchStoreFactory";
import { extendStore } from "@/store/helpers/extend-helper";
import {collectionsApi} from "@/js/api/collections/collectionsApi";

function filterItemPredicate(filterData, item) {
  if (filterData.search) {
    return item.fullName.toLowerCase().includes(filterData.search.toLowerCase());
  }
  return true;
}

// создаём хук Zustand через объединение базового и дополнительного стора
export const useFetchUsersStore = create(
  extendStore(
    createFetchStore({ name: "users" , filterItemPredicate : filterItemPredicate }),
    (set, get) => ({
      updateStatus: async (taskId, status) => {
        const updated = await tasksApi.updateStatus(taskId, status);
        get().updateItem(taskId, updated);
      },
    })
  )
);