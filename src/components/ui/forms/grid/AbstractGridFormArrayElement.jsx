import React from "react";
import { createComponentMap, resolveTemplateComponent } from '@/js/utils';

// Загружаем все реализации элементов массива
const elementModules = import.meta.glob('./array_elements/*GridFormArrayElement.jsx', { eager: true });
const elementComponentMap = createComponentMap(elementModules, "GridFormArrayElement");

export default function AbstractGridFormArrayElement({
  field,
  block,
  blockIndex,
  level,
  remove,
  templates,
  controlMessages,
  children
}) {
  const Component = resolveTemplateComponent(
        templates.array_element,
        elementComponentMap,
        { field, block, blockIndex, level},
        "default"
  );

  return <Component block={block} blockIndex={blockIndex} field={field} remove={remove} level={level} templates={templates} controlMessages={controlMessages}>{children}</Component>;
}
