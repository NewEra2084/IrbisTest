import { useEffect, useMemo, useCallback } from "react";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

const EMPTY_OBJECT = {};

export const usePaginationStoreBase = create((set, get) => ({
  pagination: {},

  setTotal: (name, total) =>
      set(state => ({
        pagination: {
          ...state.pagination,
          [name]: {
            ...(state.pagination[name] ?? {}),
            total,
          },
        },
  })),

  setPage: (name, page) =>
    set(state => ({
      pagination: {
        ...state.pagination,
        [name]: {
          ...(state.pagination[name] ?? {}),
          page,
        },
      },
    })),

  setPageSize: (name, size) =>
    set(state => ({
      pagination: {
        ...state.pagination,
        [name]: {
          ...(state.pagination[name] ?? {}),
          pageSize: size,
        },
      },
    })),

  resetPagination: (name) =>
    set(state => ({
      pagination: {
        ...state.pagination,
        [name]: {},
      },
    })),

  initPagination: (name, initial = {}) =>
    set(state => {
      const existing = state.pagination[name] ?? {};

      const merged = {
        page: existing.page ?? initial.page ?? 1,
        pageSize: existing.pageSize ?? initial.pageSize ?? 20,
      };

      const isSame =
        merged.page === existing.page &&
        merged.pageSize === existing.pageSize;

      if (isSame) return {};

      return {
        pagination: {
          ...state.pagination,
          [name]: merged,
        },
      };
    }),
}));

// ------------------------------------------------------
//                Хук-доступ к произвольным данным
// ------------------------------------------------------
export function usePaginationStore(selector, eq = shallow) {
  return usePaginationStoreBase(selector, eq);
}

// ------------------------------------------------------
//                    usePagination
// ------------------------------------------------------
export function usePagination(name, initial = {}) {
  // Мемо селектор как в useFilters
  const selector = useMemo(
    () => state => state.pagination[name] ?? EMPTY_OBJECT,
    [name]
  );

  const values = usePaginationStore(selector, shallow);

  const setTotal = usePaginationStoreBase(s => s.setTotal);
  const setPage = usePaginationStoreBase(s => s.setPage);
  const setPageSize = usePaginationStoreBase(s => s.setPageSize);
  const resetPagination = usePaginationStoreBase(s => s.resetPagination);
  const initPagination = usePaginationStoreBase(s => s.initPagination);

  // Инициализация при смене name
  useEffect(() => {
    if (!name) return;
    initPagination(name, initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);



  // мемоизированные действия
  const updateTotal = useCallback(
      (total) => setTotal(name, total),
      [name, setTotal]
  );

  const updatePage = useCallback(
    (page) => setPage(name, page),
    [name, setPage]
  );

  const updatePageSize = useCallback(
    (size) => setPageSize(name, size),
    [name, setPageSize]
  );

  const reset = useCallback(
    () => resetPagination(name),
    [name, resetPagination]
  );

  return {
    values,          // {total, page, pageSize }
    setTotal: updateTotal,
    setPage: updatePage,
    setPageSize: updatePageSize,
    reset,
  };
}
