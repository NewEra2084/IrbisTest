import {useEffect, useMemo, useCallback} from 'react';
import { create } from 'zustand';
import { shallow } from "zustand/shallow";

const EMPTY_OBJECT = {};

export const useFilterStoreBase = create((set, get) => {
  // Синхронно читаем локалсторадж при создании стора
  let initialShowFilters = true;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('showFilters');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'boolean') {
          initialShowFilters = parsed;
        }
      }
    } catch (e) {
      console.warn('Invalid showFilters in localStorage:', e);
    }
  }

  return {
    filters: {},

    setFilterValue: (filterName, key, value) =>
      set(state => ({
        filters: {
          ...state.filters,
          [filterName]: {
            ...state.filters[filterName],
            [key]: value,
          },
        },
      })),

    resetFilters: (filterName) =>
      set(state => ({
        filters: {
          ...state.filters,
          [filterName]: {},
        },
      })),

    initFilters: (filterName, filterArray) =>
      set(state => {
        const existing = state.filters[filterName] ?? {};
        // создаём поверх существующих — не перезаписываем уже заданные ключи
        const initial = { ...existing };
        for (const filter of filterArray) {
          if (!(filter.key in initial)) {
            initial[filter.key] = filter.value;
          }
        }
        // если ничего не изменилось — возвращаем пустой объект (no-op)
        const isSame =
          Object.keys(initial).length === Object.keys(existing).length &&
          Object.keys(initial).every(k => initial[k] === existing[k]);

        if (isSame) return {};
        return {
          filters: {
            ...state.filters,
            [filterName]: initial,
          },
        };
      }),

    // ✅ showFilters c инициализацией из localStorage
    showFilters: initialShowFilters,

    setShowFilters: (visible) => {
      localStorage.setItem('showFilters', JSON.stringify(visible));
      set({ showFilters: visible });
    },

    toggleShowFilters: () => {
      const current = get().showFilters;
      localStorage.setItem('showFilters', JSON.stringify(!current));
      set({ showFilters: !current });
    },
  };
});

// 🧠 Основной persistent-хук
export function useShowFilters() {
  return useFilterStoreBase(state => state.showFilters);
}

export function useSetShowFilters() {
  return useFilterStoreBase(state => state.setShowFilters);
}

export function useToggleShowFilters() {
  return useFilterStoreBase(state => state.toggleShowFilters);
}

/*export function useFilters(filterName, filterArray = []) {
  const values = useFilterStoreBase(state => state.filters[filterName] ?? EMPTY_OBJECT);
  const setFilterValue = useFilterStoreBase(state => state.setFilterValue);
  const resetFilters = useFilterStoreBase(state => state.resetFilters);
  const initFilters = useFilterStoreBase(state => state.initFilters);

  // фильтры инициализируем только при необходимости
  useEffect(() => {
    if (filterName && Array.isArray(filterArray) && filterArray.length > 0) {
      initFilters(filterName, filterArray);
    }
  }, [filterName, filterArray, initFilters]);

  return {
    values,
    setValue: (key, value) => setFilterValue(filterName, key, value),
    reset: () => resetFilters(filterName),
  };
}*/

export function useFilters(filterName, filterArray = []) {
  // мемоизированный селектор — не пересоздаётся без смены filterName
  const selector = useMemo(
    () => (state) => state.filters[filterName] ?? EMPTY_OBJECT,
    [filterName]
  );

  // shallow сравнение — обновляем компонент только если поля внутри коллекции реально поменялись
  const values = useFilterStoreBase(selector, shallow);

  // извлекаем actions отдельно (они стабильны по ссылке в store, но мемоизируем локальные обёртки)
  const setFilterValue = useFilterStoreBase(state => state.setFilterValue);
  const resetFilters = useFilterStoreBase(state => state.resetFilters);
  const initFilters = useFilterStoreBase(state => state.initFilters);

  // гарантируем, что initFilters вызывается при изменении filterName/filterArray
  useEffect(() => {
    if (!filterName) return;
    if (Array.isArray(filterArray) && filterArray.length > 0) {
      initFilters(filterName, filterArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName, /* намеренно не добавляем filterArray как глубокую зависимость */]);

  // мемоизированные колбэки, зависящие только от filterName и store action
  const setValue = useCallback(
    (key, value) => setFilterValue(filterName, key, value),
    [filterName, setFilterValue]
  );

  const reset = useCallback(() => resetFilters(filterName), [filterName, resetFilters]);

  // добавляем getState — ссылка стабильна и не вызывает ререндеров
  const getState = useFilterStoreBase.getState;

  return {
    values,
    setValue,
    reset,
    getState,
  };
}
