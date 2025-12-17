import { useGridForm } from "./context/GridFormContext";

import AbstractField from "./fields/AbstractField";
import AbstractGridFormRow from "./grid/AbstractGridFormRow";
import AbstractGridFormCell from "./grid/AbstractGridFormCell";
import RecursiveArrayField from "./grid/RecursiveArrayField";
import { splitFieldsIntoRows } from "./grid/utils/grid-utils";

const buildTemplates = (template) => {
  const tmpl = template || "default";
  return { row: tmpl, cell: tmpl, array: tmpl, array_element: tmpl };
};

const templatesBuilder = (template) => {
  if (template) {
    if (typeof template === "string") return buildTemplates(template);
    if (typeof template === "object")
      return { ...buildTemplates(), ...template };
  }
  return buildTemplates();
};

export default function GridForm({
  fields,
  cols = 1,
  template = "default",
  controlMessages,
}) {
  const { control, register, errors } = useGridForm();

  const templates = templatesBuilder(template);
  const rowsFields = splitFieldsIntoRows(fields, cols);
  const level = 0;

  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-4">
        {rowsFields.map((row, rowIndex) => (
          <AbstractGridFormRow
            key={`row-${rowIndex}`}
            row={row}
            rowIndex={rowIndex}
            cols={cols}
            parentCols={cols}
            level={level}
            templates={templates}
          >
            {row.cells.map((field, cellIndex) => {
              const parentKey = `${rowIndex}-${cellIndex}`;
              const key = `cell-${parentKey}`;

              if (field.type === "array") {
                return (
                  <AbstractGridFormCell
                    key={key}
                    row={row}
                    field={field}
                    rowIndex={rowIndex}
                    cellIndex={cellIndex}
                    level={level}
                    templates={templates}
                  >
                    <RecursiveArrayField
                      control={control}
                      register={register}
                      errors={errors}
                      field={field}
                      cols={field.srcCols || field.cols || cols}
                      parentCols={cols}
                      level={level}
                      name={field.key}
                      parentKey={parentKey}
                      templates={templates}
                      controlMessages={controlMessages}
                    />
                  </AbstractGridFormCell>
                );
              }
              return (
                <AbstractGridFormCell
                  key={key}
                  row={row}
                  field={field}
                  rowIndex={rowIndex}
                  cellIndex={cellIndex}
                  level={level}
                  templates={templates}
                >
                  <AbstractField
                    field={{ ...field, keyName: field.key }}
                    register={register}
                    errors={errors}
                  />
                </AbstractGridFormCell>
              );
            })}
          </AbstractGridFormRow>
        ))}
      </div>
    </form>
  );
}
