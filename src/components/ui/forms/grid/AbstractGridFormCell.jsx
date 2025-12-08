// Загружаем все компоненты по маске *GridFormCell.jsx
const modules = import.meta.glob('./cells/*GridFormCell.jsx', { eager: true });
import { createComponentMap, resolveTemplateComponent } from '@/js/utils';

const componentMap = createComponentMap(modules, "GridFormCell");

export default function AbstractGridFormCell({ field, row, rowIndex, cellIndex, templates, children }) {

  const Component = resolveTemplateComponent(
       field.template || templates.cell,
       componentMap,
       {row, field, rowIndex, cellIndex},
       "default"
  );

  return (
    <Component
      field={field}
      row={row}
      rowIndex={rowIndex}
      cellIndex={cellIndex}
    >
      {children}
    </Component>
  );
}
