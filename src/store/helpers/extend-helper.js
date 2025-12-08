import { create } from "zustand";

export function extendStore(baseFn, extraFn){
    return (set, get) => ({
        ...baseFn(set,get),
        ...extraFn(set,get)
    });
}