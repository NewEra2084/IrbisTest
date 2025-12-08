import { create } from "zustand";
import { createFetchStore } from "../fetchStoreFactory";
import { extendStore } from "@/store/helpers/extend-helper";
import {collectionsApi} from "@/js/api/collections/collectionsApi";

function filterItemPredicate(filterData, item) {
  if (filterData.search) {
    return item.roleName.toLowerCase().includes(filterData.search.toLowerCase());
  }
  return true;
}

const rolesKeyValueBuilders = {
    'default': {
        predicate: (item) => true,
        converter: (item) => ({key:item.key,value:item.item.roleName})
    }
};

export const useFetchRolesStore = create(
    createFetchStore({ name: "roles" , filterItemPredicate : filterItemPredicate, rolesKeyValueBuilders})
);