import { create } from "zustand";
import { createLazyStore } from "../lazyStoreFactory";
import { extendStore } from "@/store/helpers/extend-helper";
import {collectionsApi} from "@/js/api/collections/collectionsApi";

function filterItemPredicate(filterData, item) {
  if (filterData.search) {    
    return item.fullName.toLowerCase().includes(filterData.search.toLowerCase());
  }
  return true;
}


export const useLazyRolesStore = create(
    createLazyStore({ name: "roles" })
);