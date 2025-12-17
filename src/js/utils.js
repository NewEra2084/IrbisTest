import { useFetchRolesStore } from "../store/list/fetch/rolesFetchListStore";
import { useFetchUsersStore } from "../store/list/fetch/usersFetchListStore";

export function createComponentMap(modules, suffix) {
  return Object.fromEntries(
    Object.entries(modules).map(([path, mod]) => {
      const match = path.match(new RegExp(`\/(\\w+)${suffix}\\.\\w+$`));
      if (!match) return [];

      const originalName = match[1]; // например: "LazySelect"
      const type = originalName
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .toLowerCase(); // → "lazy_select"

      const exported = mod.default ?? Object.values(mod)[0];

      return [type, exported];

      //return [type, mod.default];
    })
  );
}

export function createAliasMap(modules, suffix) {
  return createComponentMap(modules, suffix);
}

export function bindActions(actions, ctx, sender) {
  const bound = {};

  for (const [key, actionFactory] of Object.entries(actions)) {
    if (typeof actionFactory === "function") {
      bound[key] = actionFactory(ctx, sender); // создаём обработчик, передаём контекст
    }
  }

  return bound;
}

/*
    в контекст будет импортировано, если елемент строка, то сама функция с таким же названием, если элемент
    объект, то название в контексте будет из ключа
    [
        { open: "openModal" },
        { close: "closeModal" },
        "closeAllModal", // можно смешивать
    ]
*/
export function extractStoreMethod(store, method) {
  return store((state) => state[method]);
}

export function createContextBindings(store, componentName, methods) {
  const result = {};
  result[componentName] = {};

  methods.forEach((method) => {
    if (typeof method === "string") {
      result[componentName][method] = store((state) => state[method]);
    } else if (typeof method === "object") {
      const [alias, original] = Object.entries(method)[0];
      result[componentName][alias] = store((state) => state[original]);
    }
  });

  return result;
}

/**
 * Разбирает путь по шаблону и возвращает объект параметров.
 *
 * @param {string} path - Например, "/list/users/123"
 * @param {string} pattern - Например, "/list/:collection/:id"
 * @returns {object} - { collection: "users", id: "123" }
 */
export function parseUrlPathParams(path, pattern) {
  try {
    const urlPattern = new URLPattern({ pathname: pattern });
    const match = urlPattern.exec({ pathname: path });
    if (!match) return {};
    return match.pathname.groups || {};
  } catch (err) {
    console.error("Invalid pattern or path", err);
    return {};
  }
}

/**
 * Определяет компонент по шаблону (JSX-функция или строка)
 * @param {any} template - шаблон (строка или функция)
 * @param {Object} componentMap - карта компонентов (rowComponentMap, arrayComponentMap)
 * @param {Object} props - пропсы для вызова template-функции
 * @param {string} defaultValue - значение по умолчанию ("default")
 */
export function resolveTemplateComponent(
  template,
  componentMap,
  props = {},
  defaultValue = "default"
) {
  let templateType;

  if (typeof template === "function") {
    templateType = template(props);
  } else if (typeof template === "string") {
    templateType = template;
  } else {
    templateType = defaultValue;
  }

  if (typeof templateType === "function") return templateType;
  if (typeof templateType === "string")
    return componentMap[templateType] ?? componentMap[defaultValue];
  return componentMap[defaultValue];
}

/**
 * Функция рекурсивно бегает по объекту и смотрит значение на соответствие его шаблону для перевода:
 * @i18n(messages.form.field) или @i18n('messages.form.field') или @i18n("messages.form.field"),
 * если оно имеет соответствующий вид, то мы его переводим через react-i18next
 * import { useTranslation } from 'react-i18next';
 * const { t } = useTranslation();
 * const translated = translateDeep(data, t);
 */
export const translateDeep = function (data, t) {
  // Регулярка для @i18n(key) или @i18n('key') или @i18n("key")
  const i18nRegexp = /^@i18n\((['"]?)([^'")]+)\1\)$/;

  const walk = (value) => {
    if (typeof value === "string") {
      const match = value.match(i18nRegexp);
      if (match) {
        const key = match[2];
        const translated = t(key);
        return translated || value; // если нет перевода — оставить как есть
      }
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => walk(item));
    }

    if (value && typeof value === "object") {
      Object.keys(value).forEach((k) => {
        value[k] = walk(value[k]);
      });
      return value;
    }

    return value;
  };

  return walk(data);
};

/**
 *
 * Возвращает массив измененных полей
 * @param {object} appCtx - AppContext
 * @param {object[]} list - массив полей
 * @param {string} soughtCollection - поле в котором нужно подменить опции
 * @returns {object[]}
 */
export async function modifyCollectionFields(appCtx, list, soughtCollection) {
  const query = [];
  fetchCollections(list);
  const changed = query.map((item) => {
    return appCtx.list[item].store.getState().fetchAll();
  });
  return Promise.all(changed).then(async () => {
    const res = await Promise.all(addOptions(list));
    return res;
  });

  // Определение коллекций, которые нужно подтянуть с сервера (fetchAll)
  function fetchCollections(list) {
    list.forEach((field) => {
      const isLazy = appCtx.list[field.collection]?.isLazy;
      const isLoaded = appCtx.list[field.collection]?.store.getState().isLoaded;

      if (!isLazy && !isLoaded && isLazy != null) {
        query.push(field.collection);
      }
      // рекурсия
      if (Array.isArray(field) && field.list) {
        fetchCollections(field.list);
      }
    });
  }

  //TODO: сделать поиск по soughtCollection(массив) вместо list
  // Добавляет опции к fetch-коллекциям
  function addOptions(list) {
    
    return list.map(async (field) => {
      const isLazy = appCtx.list[field.collection]?.isLazy;

      // Если поле lazy
      if (isLazy) {
        const listOfCollection = await appCtx.list[field.collection]?.store
          .getState()
          .fetchPage({}, { page: 1, pageSize: 3 }, {});
        const listModified = listOfCollection.items.map((item, id) => {
          return { key: id, value: item.item.fullName };
        });
        return {
          ...field,
          type: "lazy_select",
          options: [...listModified, ...field.options],
        };
      }

      //Если поле fetch
      if (field.key === soughtCollection) {
        const listOfCollection = appCtx.list[field.collection]?.store
          .getState()
          .getFilteredPage({}, { page: 2, pageSize: 3 })
          .items.map((item, id) => {
            return { key: id, value: item.item?.fullName };
          });
        return {
          ...field,
          options: [...listOfCollection, ...field.options],
        };
      }
      // рекурсия
      if (Array.isArray(field) && field.list) {
        return addOptions(field.list);
      }
      return field;
    });
  }
}

export const modifyFormField = function (fields, path, changes) {
  const parts = path.split(".");

  function recursiveModify(arr, index = 0) {
    return arr.map((field) => {
      if (field.key !== parts[index]) return field;

      if (index === parts.length - 1) {
        // Последний сегмент пути — применяем изменения
        return { ...field, ...changes };
      }

      if (field.type === "array" && field.fields) {
        return {
          ...field,
          fields: recursiveModify(field.fields, index + 1),
        };
      }

      return field;
    });
  }

  return recursiveModify(fields);
};

export const extractCollectionsFormFields = function (fields) {
  const collections = [];

  function recursiveExtract(arr) {
    arr.map((field) => {
      if (field.collection && !collections.includes(field.collection)) {
        collections.push(field.collection);
      }
      if (field.type == "array") {
        recursiveExtract(field.fields);
      }
    });
  }
  return collections;
};

/**
 * Преобразует Ant-паттерн в регулярное выражение.
 * Поддерживает ?, *, **.
 */
// @param {string} pattern - Ant-паттерн (например "/test/**", "/**/*.json")
/**
 * @param {boolean} caseSensitive - учитывать регистр (по умолчанию false)
 * @returns {RegExp}
 */
function antPatternToRegExp(pattern, caseSensitive = false) {
  // Нормализуем слэши
  pattern = pattern.replace(/\/+/g, "/");

  // ШАГ 1 — экранируем все RegExp-символы, кроме * и ?
  pattern = pattern.replace(/([.+^${}()|[\]\\])/g, "\\$1");

  // ШАГ 2 — заменяем ** временной меткой
  pattern = pattern.replace(/\*\*/g, "###DOUBLE_STAR###");

  // ШАГ 3 — заменяем одиночный * на [^/]*  (не跨 слэш)
  pattern = pattern.replace(/\*/g, "[^/]*");

  // ШАГ 4 — заменяем ? на один символ кроме '/'
  pattern = pattern.replace(/\?/g, "[^/]");

  // ШАГ 5 — восстанавливаем ** → .*
  pattern = pattern.replace(/###DOUBLE_STAR###/g, ".*");

  // Анкорим: полный путь
  const flags = caseSensitive ? "" : "i";
  return new RegExp("^" + pattern + "$", flags);
}

/**
 * Проверяет, соответствует ли путь Ant-паттерну.
 * @param {string} pattern - Ant-паттерн
 * @param {string} path - путь для проверки
 * @param {object} [options] - опции: { caseSensitive: boolean, normalizeSlash: boolean }
 * @returns {boolean}
 */
export function matchAntPath(pattern, path, options = {}) {
  const { caseSensitive = true, normalizeSlash = true } = options;

  if (normalizeSlash) {
    // Нормализуем повторяющиеся слэши, удаляем лишний завершающий слэш
    pattern = pattern.replace(/\/+/g, "/");
    path = path.replace(/\/+/g, "/");
  }

  // Специальный случай: если pattern == path (быстрая проверка)
  if (
    caseSensitive
      ? pattern === path
      : pattern.toLowerCase() === path.toLowerCase()
  ) {
    return true;
  }

  const re = antPatternToRegExp(pattern, caseSensitive);
  return re.test(path);
}
