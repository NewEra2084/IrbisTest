import React from "react";
import { createComponentMap, resolveTemplateComponent } from '@/js/utils';

// Загружаем все реализации массивов
const arrayModules = import.meta.glob('./arrays/*GridFormArray.jsx', { eager: true });
const arrayComponentMap = createComponentMap(arrayModules, "GridFormArray");

export default function AbstractGridFormArray({
  field,
  append,
  level,
  templates,
  hideAddButton,
  children
}) {
  const Component = resolveTemplateComponent(
      templates.array,
      arrayComponentMap,
      { field, level},
      "default"
  );

  //const Component = arrayComponentMap[arrayType] ?? arrayComponentMap["default"];
  return <Component field={field} append={append} level={level} hideAddButton={hideAddButton} templates={templates}>{children}</Component>;
}
