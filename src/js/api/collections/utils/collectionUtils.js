import {baseCollectionBuildApiFunction} from '../builder/baseCollectionBuildApiFunction';
import {createAliasMap} from '@/js/utils';

// Динамический импорт кастомных BuildApiFunction
const modules = import.meta.glob('../builder/impl/*BuildApiFunction.js', { eager: true });

const customBuildMap = createAliasMap(modules,"BuildApiFunction");

// Объединяем базовые CRUD и кастомные методы
/**
 * Строит fetchCollectionApi из кастомных билдов и базовых коллекций
 * @param {Record<string, Function>} customBuildMap — { collectionName: customBuildFunction }
 * @param {string[]} baseCollections — массив коллекций без кастомных билдов
 * @returns {Record<string, object>} fetchCollectionApi
 */
export function collectionsApiBuilder(customBuildMap = {}, baseCollections = []) {
  const collectionsApi = {};

  // Добавляем кастомные методы, объединяя с базовыми
  for (const collection of Object.keys(customBuildMap)) {
    const baseApi = baseCollectionBuildApiFunction(collection);
    const customBuild = customBuildMap[collection];

    // Передаём baseApi в кастомный билд, чтобы он мог его использовать
    const customMethods = customBuild(baseApi);

    collectionsApi[collection] = { ...baseApi, ...customMethods };
  }

  // Добавляем коллекции без кастомного модуля
  baseCollections.forEach((col) => {
    if (!collectionsApi[col]) {
      collectionsApi[col] = baseCollectionBuildApiFunction(col);
    }
  });

  return collectionsApi;
}

export function buildCollectionsApi(baseCollections = []){
    return collectionsApiBuilder(customBuildMap, baseCollections);
}

