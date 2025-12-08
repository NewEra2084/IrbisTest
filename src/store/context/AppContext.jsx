import { createContext, useMemo } from "react";
import { createAliasMap } from "@/js/utils";

// Подгружаем все fetch и lazy сторы
const listFetchModules = import.meta.glob('../list/fetch/*FetchListStore.js', { eager: true });

const listFetchStoreMap = createAliasMap(listFetchModules, "LazyListStore");

const listLazyModules = import.meta.glob('../list/lazy/*ListStore.js', { eager: true });
const listLazyStoreMap = createAliasMap(listLazyModules, "ListStore");

// Импорты глобальных сторов
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { useFilters } from "@/store/filterStore";
import { usePagination} from "@/store/paginationStore";
import { useTranslation } from 'react-i18next';

// Создаём контекст
export const AppContext = createContext({});

// Утилита для объединения fetch и lazy сторов в единый map
function mergeStores(fetchMap, lazyMap, collections = [], isFetch = true) {
  const merged = {};

  const lazyCollections = {};

  for (const [key, store] of Object.entries(fetchMap)) {
    lazyCollections[key] = { store, isLazy: false };
  }

  const fetchCollections = {};

  for (const [key, store] of Object.entries(lazyMap)) {
    fetchCollections[key] = { store, isLazy: true };
  }

  const unionKeys = Object.keys({...lazyCollections, ...fetchCollections});

  const chooseCollection = function (key, lazyCollections, fetchCollections){
       const lazyCollection = lazyCollections[key];
       const fetchCollection = fetchCollections[key];
       //если какого-то сторменджера fetch или lazy нет для заданного имени коллекции, возвращаем тот который есть
       if (!lazyCollection) return fetchCollection;
       if (!fetchCollection) return lazyCollection;

       //если есть оба стора и fetch и lazy выбираем нужный
       if (collections.includes(key)){
            return (isFetch) ? fetchCollection : lazyCollection;
       }else{
            return (isFetch) ? lazyCollection : fetchCollection;
       }
  }

  for (let i = 0; i < unionKeys.length; i++){
       let key = unionKeys[i];
       let storeData = chooseCollection(key, lazyCollections, fetchCollections);
       if (storeData){
            merged[key] = storeData;
       }
  }

  return merged;
}

// Хук для генерации value контекста
export function useAppContextValue() {
  return useMemo(() => ({
    main: {
      auth: useAuthStore,
      user: useUserStore,
    },
    modal: useModalStore,
    list: mergeStores(listFetchStoreMap, listLazyStoreMap),
    filters: useFilters,
    pagination: usePagination,
    translation: useTranslation,
  }), []);
}
