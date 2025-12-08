import { collectionsApi } from "@/js/api/collections/collectionsApi";

/**
 * Создаёт lazy fetch store:
 * - нет fetchAll
 * - fetchPage / fetchFilteredPage -> запрашивают сервер (params -> list)
 * - getById -> запрашивает сервер (и кэширует при duration)
 * - addItem/updateItem/removeItem -> всегда на сервер, после успешного ответа синхронизируем лок. кеш
 *
 * Параметры:
 *   name: string (имя коллекции, используется для collectionsApi[name])
 *   idName: string = "id" (поле id в исходном объекте)
 *   duration: number | null = время кэширования в мс; если null/undefined – кэш отключён
 *
 * Формат списка list(params) ожидается: { items: [...], count: number }
 */
export function createLazyStore({
  name,
  idName = "id",
  duration = null, // ms или null
}) {
  return (set, get) => ({
    name,

    // состояние загрузки / ошибок общего
    isLoading: false,
    error: null,

    // последний полученный "срез" (если кэшируем — хранится и в cachePages)
    lastPageKey: null,
    lastPageData: null, // { count, items: [normalized] }

    // ===========================
    // internal caches
    // ===========================
    // cachePages: Map<key, { ts, data }>
    cachePages: new Map(),

    // idCache: Map<id, { ts, item: normalized }>
    idCache: new Map(),

    // ===========================
    // HELPERS
    // ===========================
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

    // Ключ для кеширования страниц: включает фильтры и пагинацию
    makePageKey: (filters = {}, pagination = {}) => {
      // Стабильная сериализация: сортировка ключей
      const clean = (obj) => {
        if (!obj) return {};
        const keys = Object.keys(obj).sort();
        const res = {};
        for (const k of keys) {
          res[k] = obj[k];
        }
        return res;
      };
      const f = clean(filters);
      const p = clean(pagination);
      return JSON.stringify({ filters: f, pagination: p });
    },

    isCacheEnabled: () => typeof duration === "number" && duration > 0,

    isCacheEntryValid: (entryTs) => {
      if (!get().isCacheEnabled()) return false;
      const now = Date.now();
      return now - entryTs <= duration;
    },

    getPageFromCache: (key) => {
      const { cachePages } = get();
      const entry = cachePages.get(key);
      if (!entry) return null;
      if (!get().isCacheEntryValid(entry.ts)) {
        // устарел
        cachePages.delete(key);
        return null;
      }
      return entry.data;
    },

    setPageCache: (key, data) => {
      if (!get().isCacheEnabled()) return;
      get().cachePages.set(key, { ts: Date.now(), data });
    },

    clearPageCache: () => {
      get().cachePages.clear();
      set({ lastPageKey: null, lastPageData: null });
    },

    getIdFromCache: (id) => {
      const { idCache } = get();
      const entry = idCache.get(id);
      if (!entry) return null;
      if (!get().isCacheEntryValid(entry.ts)) {
        idCache.delete(id);
        return null;
      }
      return entry.item;
    },

    setIdCache: (id, normalized) => {
      if (!get().isCacheEnabled()) return;
      get().idCache.set(id, { ts: Date.now(), item: normalized });
    },

    removeIdCache: (id) => {
      get().idCache.delete(id);
    },

    clearAllCaches: () => {
      get().cachePages.clear();
      get().idCache.clear();
      set({ lastPageKey: null, lastPageData: null });
    },

    // ===========================
    // GETTERS
    // ===========================
    /**
     * Возвращает последний загруженный (локально) "срез" — {count, items}
     * Может быть полезно для синхронных запросов UI.
     */
    getLastPage: () => get().lastPageData,

    /**
     * Возвращает нормализованный элемент из idCache или null
     */
    getByIdCached: (id) => get().getIdFromCache(id),

    // ===========================
    // FETCHERS (всё идёт на сервер)
    // ===========================
    /**
     * Запрашивает страницу с сервера (и кэширует её если duration задан).
     *
     * filters: объект фильтров (пересылается в params)
     * pagination: { page, pageSize } — также пересылается в params
     * options.force — если true, игнорирует кэш и принудительно запрашивает
     *
     * Возвращает: { count, items: [normalized] }
     */
    fetchPage: async (filters = {}, pagination = { page: 1, pageSize: 20 }, options = {}) => {
      const { name } = get();
      const { force = false } = options;
      const key = get().makePageKey(filters, pagination);

      // Если есть валидный кэш — возвращаем его
      if (!force) {
        const cached = get().getPageFromCache(key);
        if (cached) {
          // обновим lastPage refs
          set({ lastPageKey: key, lastPageData: cached });
          return cached;
        }
      }

      // Запросим с сервера
      set({ isLoading: true, error: null });
      try {
        const params = { ...(filters || {}), ...(pagination || {}) };
        const raw = await collectionsApi[name].list(params);

        // ожидаем формат { items, count }
        const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
        const count = typeof raw.count === "number" ? raw.count : itemsRaw.length;

        const normalize = get().normalizeItem;
        const normalized = itemsRaw.map(normalize);

        const data = { count, items: normalized };

        // Запомним в кеш
        if (get().isCacheEnabled()) {
          get().setPageCache(key, data);
        }

        // Обновим lastPage refs
        set({ lastPageKey: key, lastPageData: data });

        // Также поместим items в idCache (чтобы getById мог обслуживать запросы локально)
        for (const entry of normalized) {
          get().setIdCache(entry.id, entry);
        }

        return data;
      } catch (error) {
        console.error(`[${name}] fetchPage error:`, error);
        set({ error });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    /**
     * Альтернатива: fetchFilteredPage — просто прокси, использует fetchPage
     */
    fetchFilteredPage: (filters = {}, pagination = { page: 1, pageSize: 20 }, options = {}) =>
      get().fetchPage(filters, pagination, options),

    /**
     * Получить элемент по id.
     * Если duration задан и элемент есть в idCache — вернётся локально.
     * Иначе отправится запрос на сервер.
     *
     * force = true — игнорировать кэш и запросить сервер.
     *
     * Возвращает нормализованный элемент.
     */
    getById: async (id, options = {}) => {
      const { name } = get();
      const { force = false } = options;
      if (!id) throw new Error(`[${name}] getById: id is required`);

      if (!force) {
        const cached = get().getIdFromCache(id);
        if (cached) return cached;
      }

      set({ isLoading: true, error: null });
      try {
        const raw = await collectionsApi[name].getById(id);
        const normalized = get().normalizeItem(raw);

        // кешируем в idCache при включённом duration
        get().setIdCache(id, normalized);

        return normalized;
      } catch (error) {
        console.error(`[${name}] getById error:`, error);
        set({ error });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // ===========================
    // MUTATIONS (всегда серверные)
    // ===========================
    /**
     * Создать элемент на сервере.
     * Возвращает нормализованный элемент.
     *
     * После успешного создания:
     * - обновляем idCache
     * - инвалидируем page cache (чтобы последующие fetchPage получили свежие данные)
     */
    addItem: async (data) => {
      const { name } = get();
      set({ isLoading: true, error: null });
      try {
        const raw = await collectionsApi[name].createItem(data);
        const normalized = get().normalizeItem(raw);

        // обновим idCache
        get().setIdCache(normalized.id, normalized);

        // инвалидируем кэш страниц — данные на сервере изменились
        get().clearPageCache();

        // lastPageData тоже невалиден теперь
        set({ lastPageKey: null, lastPageData: null });

        return normalized;
      } catch (error) {
        console.error(`[${name}] addItem error:`, error);
        set({ error });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    /**
     * Обновить элемент.
     * Возвращает нормализованный обновлённый элемент.
     *
     * После успешного обновления:
     * - обновляем idCache
     * - инвалидируем/обновляем page cache (мы инвалидируем — проще и безопаснее)
     */
    updateItem: async (id, updates) => {
      const { name } = get();
      if (!id) throw new Error(`[${name}] updateItem: id is required`);

      set({ isLoading: true, error: null });
      try {
        const raw = await collectionsApi[name].updateItem(id, updates);
        const normalized = get().normalizeItem(raw);

        // обновим idCache
        get().setIdCache(id, normalized);

        // инвалидируем page cache — проще, чтобы данные не рассинхронизировались
        get().clearPageCache();
        set({ lastPageKey: null, lastPageData: null });

        return normalized;
      } catch (error) {
        console.error(`[${name}] updateItem error:`, error);
        set({ error });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    /**
     * Удалить элемент.
     * После успешного удаления:
     * - удаляем из idCache
     * - инвалидируем page cache
     */
    removeItem: async (id) => {
      const { name } = get();
      if (!id) throw new Error(`[${name}] removeItem: id is required`);

      set({ isLoading: true, error: null });
      try {
        await collectionsApi[name].removeItem(id);

        // удалить из idCache
        get().removeIdCache(id);

        // инвалидируем page cache
        get().clearPageCache();
        set({ lastPageKey: null, lastPageData: null });

        return true;
      } catch (error) {
        console.error(`[${name}] removeItem error:`, error);
        set({ error });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // ===========================
    // MANUAL CACHE CONTROLS
    // ===========================
    /**
     * Force clear of caches (pages + id)
     */
    clear: () => {
      get().clearAllCaches();
      set({ isLoading: false, error: null });
    },

    /**
     * Invalidate only pages cache (keep idCache)
     */
    invalidatePages: () => {
      get().clearPageCache();
    },

    /**
     * Invalidate only id cache
     */
    invalidateIds: () => {
      get().idCache.clear();
    },
  });
}
