const rowModules = import.meta.glob('./rows/*GridFormRow.jsx', { eager: true });
import { createComponentMap, resolveTemplateComponent } from '@/js/utils';

const rowComponentMap = createComponentMap(rowModules, "GridFormRow");

export default function AbstractGridFormRow({row, rowIndex, cols, parentCols, level, templates, children }) {
  const Component = resolveTemplateComponent(
        templates.row,
        rowComponentMap,
        { row, rowIndex, cols, parentCols, level },
        "default"
  );

  return <Component row={row} rowIndex={rowIndex} cols={cols} parentCols={parentCols}>{children}</Component>;
}

