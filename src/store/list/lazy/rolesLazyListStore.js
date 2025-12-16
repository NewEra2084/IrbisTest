import { create } from "zustand";
import { createLazyStore } from "../lazyStoreFactory";
import { extendStore } from "@/store/helpers/extend-helper";
import {collectionsApi} from "@/js/api/collections/collectionsApi";

export const useLazyRolesStore = create(
  extendStore(
    createLazyStore({ name: "roles" }),
    (set, get) => ({
    })
  )
);