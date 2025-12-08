import * as Yup from "yup";

// 🔹 Подставляет аргументы в шаблон сообщения
function formatMessage(method, args, message, fieldKey, defaultMessages) {
  // 1. Если message — функция
  if (typeof message === "function") {
    return message(method, args, fieldKey, defaultMessages);
  }

  // 2. Если message — строка-шаблон
  if (typeof message === "string") {
    let text = message.replace("{0}", method);
    args.forEach((arg, index) => {
      text = text.replace(`{${index + 1}}`, arg);
    });
    return text;
  }
  // 3. Берём шаблон по умолчанию
  let tmpl = defaultMessages[method] || defaultMessages.default;
  tmpl = tmpl.replace("{0}", method);
  args.forEach((arg, index) => {
    tmpl = tmpl.replace(`{${index + 1}}`, arg);
  });
  return tmpl;
}

// 🔹 Применение validation-правил к Yup-схеме
function applyValidationRules(schema, rules = [], fieldKey, defaultMessages) {
  rules.forEach(rule => {
    const { method, args = [], message } = rule;
    if (typeof schema[method] === "function") {
      const msg = formatMessage(method, args, message, fieldKey, defaultMessages);
      schema = schema[method](...args, msg);
    } else {
      console.warn(`⚠ Метод ${method} не найден в Yup для поля "${fieldKey}"`);
    }
  });
  return schema;
}

function detectBaseSchema(field) {
  const { type, validation = [] } = field;

  if (field.validationType) {
      switch(field.validationType) {
        case "number": return Yup.number();
        case "string": return Yup.string();
        case "boolean": return Yup.boolean();
        case "date": return Yup.date();
      }
  }

  // 1. Ищем метод, который указывает тип явно
  const methodNames = validation.map(v => v.method);

  if (methodNames.includes("number")) return Yup.number();
  if (methodNames.includes("boolean")) return Yup.boolean();
  if (methodNames.includes("date")) return Yup.date();
  if (methodNames.includes("string") || methodNames.includes("email")) return Yup.string();

  // 2. По UI-типу как fallback
  switch (type) {
    case "string":
    case "input":
    case "text":
    case "password":
    case "email":
      return Yup.string();

    case "number":
      return Yup.number();

    case "boolean":
    case "checkbox":
    case "toggle":
      return Yup.boolean();

    default:
      return Yup.mixed();
  }
}

function buildYupShape(fields, defaultMessages) {
  const shape = {};

  fields.forEach((field) => {
    const { key, validation = [], fields: subFields } = field;

    let baseSchema;

    if (field.type === "array") {
      const subShape = buildYupShape(subFields || [], defaultMessages);
      baseSchema = Yup.array().of(Yup.object().shape(subShape));
    } else {
      baseSchema = detectBaseSchema(field);
    }

    // Накладываем правила
    shape[key] = applyValidationRules(baseSchema, validation, key, defaultMessages);
  });

  return shape;
}

// 🔹 Основная функция, вызываемая снаружи
export function generateYupSchema(fields, defaultMessages) {
  const shape = buildYupShape(fields, defaultMessages);
  return Yup.object().shape(shape);
}