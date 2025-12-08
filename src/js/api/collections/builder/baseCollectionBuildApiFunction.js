import api from "@/js/api";

/**
 * Универсальный билдер CRUD функций для коллекции.
 * @param {string} collection — имя коллекции, например "users" или "tasks"
 * @returns {{list, getById, createItem, updateItem, removeItem}}
 */
export function baseCollectionBuildApiFunction(collection) {
  const base = `/api/${collection}`;

  return {
    /** Получить список элементов */
    async list(params = {}) {
      const res = await api.get(base, { params });
      return res.data;
    },

    /** Получить элемент по ID */
    async getById(id) {
      if (!id) throw new Error(`[${collection}] getById: id is required`);
      const res = await api.get(`${base}/${id}`);
      return res.data;
    },

    /** Создать новый элемент */
    async createItem(data) {
      const res = await api.post(base, data);
      return res.data;
    },

    /** Обновить элемент */
    async updateItem(id, data) {
      if (!id) throw new Error(`[${collection}] updateItem: id is required`);
      const res = await api.put(`${base}/${id}`, data);
      return res.data;
    },

    /** Удалить элемент */
    async removeItem(id) {
      if (!id) throw new Error(`[${collection}] removeItem: id is required`);
      await api.delete(`${base}/${id}`);
    },
  };
}


