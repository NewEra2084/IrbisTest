// Загружаем все Row-компоненты по маске *GridFormRow.jsx
/*const rowModules = import.meta.glob('./rows/*GridFormRow.jsx', { eager: true });
import { createComponentMap } from '@/js/utils';

const rowComponentMap = createComponentMap(rowModules, "GridFormRow");

export default function AbstractGridFormRow({ rowType = "default", row, rowIndex, content }) {
  const Component = rowComponentMap[rowType] ?? rowComponentMap["default"];

  return <Component row={row} rowIndex={rowIndex} content={content}/>;
}*/

// Загружаем все Row-компоненты по маске *GridFormRow.jsx
const rowModules = import.meta.glob('./rows/*GridFormRow.jsx', { eager: true });
import { createComponentMap, resolveTemplateComponent } from '@/js/utils';

const rowComponentMap = createComponentMap(rowModules, "GridFormRow");

export default function AbstractGridFormRow({row, rowIndex, cols, parentCols, level, templates, children }) {
  /*const defaultValue = "default";

  const template = templates.row;

  const rowType = (typeof template === "function")
      ? template(row, rowIndex, cols, parentCols, level)
      : typeof template === "string"
            ? template
            : defaultValue;

  const Component = typeof rowType === "function"
      ? rowType                    // JSX-компонент
      : typeof rowType === "string"
            ? rowComponentMap[rowType] ?? rowComponentMap[defaultValue] // строка — ищем в карте
            : rowComponentMap[defaultValue]; // иначе — fallback по умолчанию*/
  const Component = resolveTemplateComponent(
        templates.row,
        rowComponentMap,
        { row, rowIndex, cols, parentCols, level },
        "default"
  );

  return <Component row={row} rowIndex={rowIndex} cols={cols} parentCols={parentCols}>{children}</Component>;
}

