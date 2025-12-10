import { collectionsApi } from "@/js/api/collections/collectionsApi";

/**
 * Универсальный fetchStore с нормализацией элементов,
 * фильтрацией и пагинацией.
 *
 * Нормализованный элемент:
 * {
 *   id,
 *   type,
 *   item   // сырой объект
 * }
 *
 * @param {string} name
 * @param {string} idName
 * @param {(filters, item) => boolean} filterPredicate
 */
export function createFetchStore({
  name,
  idName = "id",
  filterItemPredicate = null,
  /**
  * объект который имеет структуру {builderName:{predicate,converter},...},
  * где predicate правило отбора, например только активные пользователи,
  * а converter - как преобразовать из item в (key,value)
  */
  keyValueBuilders = {},
}) {
  return (set, get) => ({
    name,

    items: [],
    isLoading: false,
    isLoaded: false,
    error: null,

    /** кеш */
    currentFilterData: null,
    filteredItems: null,

    keyValueItems: {},

    /** ===========================
     * HELPERS
     * ========================== */

    getItemName: () => {
      const { name } = get();
      return name.endsWith("s") ? name.slice(0, -1) : name;
    },

    normalizeItem: (raw) => {
      const type = get().getItemName();
      return {
        id: raw[idName],
        type,
        item: raw,
      };
    },

    /** ===========================
     * GETTERS
     * ========================== */

    getItems: () => get().items,

    /**
     * Возвращает отфильтрованные элементы.
     * ВНИМАНИЕ: predicated вызывается на item.item
     */
    getFilteredItems: (filters = null) => {
      const { items, currentFilterData, filteredItems } = get();

      // нет предиката или фильтров — нет фильтрации
      if (!filterItemPredicate || filters == null || Object.keys(filters).length === 0 || Object.values(filters).every(v => !v)) {
        return items;
      }

      // проверяем, изменились ли фильтры
      const changed =
        JSON.stringify(filters) !== JSON.stringify(currentFilterData);

      if (!changed && filteredItems != null) {
        return filteredItems;
      }

      const nextFiltered = items.filter((entry) =>
        filterItemPredicate(filters, entry.item) // <- item.item!
      );

      set({
        filteredItems: nextFiltered,
        currentFilterData: filters,
      });

      return nextFiltered;
    },

    getKeyValueItems: (name = "default") => get().keyValueItems[name] ?? [],

    buildKeyValueItems: (name = "default") => {
      const { items, keyValueItems } = get();
      const kvBuilder = keyValueBuilders[name];

      if (!kvBuilder) return [];

      const list = items
        .filter((entry) => kvBuilder.predicate(entry.item))
        .map((entry) => kvBuilder.converter(entry));

      set({
        keyValueItems: {
          ...keyValueItems,
          [name]: list,
        },
      });

      return list;
    },

    /*getKeyValueItems: (name = "default") => {
          const { items, keyValueItems } = get();
          const kvItems = keyValueItems[name];

          if (kvItems) return kvItems;

          const kvBuilder = keyValueBuilders[name];

          if (kvBuilder){
              const filteredKvItems = items.filter((entry) =>
                    kvBuilder.predicate(entry.item)
              ).map((raw) => kvBuilder.converter(raw));

              set(state => ({
                    keyValueItems: {
                        ...state.keyValueItems,
                        [name]:filteredKvItems,
                    }
              }));

              return filteredKvItems;
          }

          return [];
    },*/

    /**
     * Пагинация без фильтрации
     */
    getPage: (pagination) => {
      const { items } = get();
      if (!pagination) return items;

      const { page = 1, pageSize = 20 } = pagination;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {count:items.length, items:items.slice(start, end)};
    },

    /**
     * Фильтр + пагинация
     */
    getFilteredPage: (filterData, paginationData) => {
      const { filteredItems, currentFilterData } = get();

      // 1. Нет фильтра — обычная пагинация
      if (!filterItemPredicate || filterData == null) {
        return get().getPage(paginationData);
      }

      // 2. Нужно ли пересчитывать filteredItems?
      const filterSame =
        JSON.stringify(filterData) === JSON.stringify(currentFilterData);

      const list =
        filterSame && filteredItems != null
          ? filteredItems
          : get().getFilteredItems(filterData);

      // 3. Пагинация
      const { page = 1, pageSize = 20 } = paginationData ?? {};
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {count:list.length, items:list.slice(start, end)};
    },

    /** ===========================
     * MUTATIONS
     * ========================== */

    /*setItems: (rawItems, markLoaded = true) =>
      set((state) => {
        const normalize = state.normalizeItem;

        return {
          items: Array.isArray(rawItems)
            ? rawItems.map(normalize)
            : [],
          isLoaded: !!markLoaded,
          isLoading: false,
          error: null,

          // invalidate cache
          filteredItems: null,
          currentFilterData: null,
        };
      }),*/
    setItems: (rawItems, markLoaded = true) =>
      set((state) => {
        const normalize = state.normalizeItem;

        // нормализуем items
        const items = Array.isArray(rawItems)
          ? rawItems.map(normalize)
          : [];

        // новый объект KV списков
        const nextKeyValueItems = {};

        // пересборка всех KV-списков (ленивости здесь нет)
        Object.entries(state.keyValueBuilders).forEach(([name, builder]) => {
          const list = items
            .filter((entry) => builder.predicate(entry.item))
            .map((entry) => builder.converter(entry));

          nextKeyValueItems[name] = list;
        });

        return {
          items,
          isLoaded: !!markLoaded,
          isLoading: false,
          error: null,

          // сброс фильтров
          filteredItems: null,
          currentFilterData: null,

          // пересчитанные ключ-значения
          keyValueItems: nextKeyValueItems,
        };
      }),


    fetchAll: async (force = false) => {
      const { name, isLoaded } = get();
      if (isLoaded && !force) return;

      set({ isLoading: true, error: null });

      try {
        const data = await collectionsApi[name].list();

        const raw = Array.isArray(data) ? data : data.items;

        const normalize = get().normalizeItem;

        set({
          items: raw.map(normalize),
          isLoaded: true,
        });
      } catch (error) {
        console.error(`[${name}] fetch error:`, error);
        set({ error });
      } finally {
        set({ isLoading: false });
      }
    },

    getById: (id) => get().items.find((x) => x.id === id),

    addItem: (rawItem) =>
      set((state) => {
        const normalize = state.normalizeItem;
        const entry = normalize(rawItem);

        const { currentFilterData, filterItemPredicate } = state;

        const items = [...state.items, entry];

        // Если нет активного фильтра → просто добавляем
        if (!filterItemPredicate || !currentFilterData) {
          return { items };
        }

        // Проверяем, проходит ли новый элемент фильтр
        const passes = filterItemPredicate(currentFilterData, entry.item);

        // Если не проходит → filteredItems не меняем
        if (!passes) {
          return { items };
        }

        // Иначе добавляем в filteredItems
        return {
          items,
          filteredItems: state.filteredItems
            ? [...state.filteredItems, entry]
            : [entry],
        };
      }),

    updateItem: (id, updates) =>
      set((state) => {
        const normalize = state.normalizeItem;
        const { filterItemPredicate, currentFilterData } = state;

        let updatedEntry = null;

        const items = state.items.map((entry) => {
          if (entry.id !== id) return entry;

          const updatedRaw = { ...entry.item, ...updates };
          updatedEntry = normalize(updatedRaw);
          return updatedEntry;
        });

        // Нет фильтра — просто обновляем
        if (!filterItemPredicate || !currentFilterData) {
          return { items };
        }

        const passes = filterItemPredicate(currentFilterData, updatedEntry.item);

        const filtered = state.filteredItems || [];

        const existsInFiltered = filtered.some((x) => x.id === id);

        let newFiltered;

        if (passes) {
          if (existsInFiltered) {
            // обновляем существующий элемент
            newFiltered = filtered.map((x) => (x.id === id ? updatedEntry : x));
          } else {
            // добавляем, если раньше не проходил фильтр
            newFiltered = [...filtered, updatedEntry];
          }
        } else {
          // должен быть исключён из filteredItems, если там был
          if (existsInFiltered) {
            newFiltered = filtered.filter((x) => x.id !== id);
          } else {
            newFiltered = filtered;
          }
        }

        return {
          items,
          filteredItems: newFiltered,
        };
      }),

    removeItem: (id) =>
      set((state) => {
        const items = state.items.filter((entry) => entry.id !== id);

        if (!state.filteredItems) {
          return { items };
        }

        // Просто удаляем из filteredItems, если он там есть
        const filteredItems = state.filteredItems.filter((entry) => entry.id !== id);

        return { items, filteredItems };
      }),

    clear: () =>
      set({
        items: [],
        isLoaded: false,
        error: null,
        filteredItems: null,
        currentFilterData: null,
      }),
  });
}
