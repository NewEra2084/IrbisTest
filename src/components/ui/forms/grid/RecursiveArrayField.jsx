import React from "react";
import { useFieldArray } from "react-hook-form";

import AbstractGridFormRow from "./AbstractGridFormRow";
import AbstractGridFormCell from "./AbstractGridFormCell";
import AbstractField from "../fields/AbstractField";
import AbstractGridFormArray from "./AbstractGridFormArray";
import AbstractGridFormArrayElement from "./AbstractGridFormArrayElement";
import { splitFieldsIntoRows } from "./utils/grid-utils";

export default function RecursiveArrayField({
  control,
  register,
  errors,
  field,      // объект описания массива
  cols,
  parentCols,
  level,
  name,       // полный путь: "array1" или "array1[0].array2"
  parentKey,
  templates,
  controlMessages
}) {
  const { fields: arrayFields, append, remove } = useFieldArray({
    control,
    name
  });

  const maxItems = field.maxItems ?? Infinity;

  return (
    <AbstractGridFormArray
      key={`array-${parentKey}`}
      field={field}
      append={() => append(field.fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}))}
      level={level}
      templates={templates}
      controlMessages={controlMessages}
      hideAddButton={arrayFields.length >= maxItems}
    >
      {arrayFields.map((block, blockIndex) => {
        const subRows = splitFieldsIntoRows(field.fields, cols);

        return (
          <AbstractGridFormArrayElement
            key={`array-element-${parentKey}-${blockIndex}`}
            block={block}
            blockIndex={blockIndex}
            field={field}
            remove={remove}
            level={level}
            templates={templates}
            controlMessages={controlMessages}
          >
            {subRows.map((subRow, subRowIndex) => (
              <AbstractGridFormRow
                key={`row-${parentKey}-${subRowIndex}`}
                row={subRow}
                rowIndex={subRowIndex}
                cols={cols}
                parentCols={parentCols}
                level={level}
                templates={templates}
              >
                {subRow.cells.map((subField, subIndex) => {
                  const fieldPath = `${name}[${blockIndex}].${subField.key}`;
                  //const key = `${fieldPath}-${subIndex}`;
                  const key=`cell-${parentKey}-${subRowIndex}-${subIndex}`;

                  if (subField.type === "array") {
                    return (
                      <AbstractGridFormCell
                        key={key}
                        row={subRow}
                        rowIndex={subRowIndex}
                        field={subField}
                        cellIndex={subIndex}
                        level={level}
                        templates={templates}
                      >
                        <RecursiveArrayField
                          control={control}
                          register={register}
                          errors={errors}
                          field={subField}
                          cols={subField.srcCols || subField.cols || cols}
                          parentCols={cols}
                          level={level+1}
                          name={fieldPath}
                          parentKey={`${parentKey}-${subRowIndex}-${subIndex}`}
                          templates={templates}
                          controlMessages={controlMessages}
                        />
                      </AbstractGridFormCell>
                    );
                  }

                  return (
                    <AbstractGridFormCell
                      key={key}
                      row={subRow}
                      rowIndex={subRowIndex}
                      field={subField}
                      cellIndex={subIndex}
                      level={level}
                      templates={templates}
                    >
                      <AbstractField
                        field={{ ...subField, keyName: fieldPath }}
                        register={register}
                        errors={errors}
                      />
                    </AbstractGridFormCell>
                  );
                })}
              </AbstractGridFormRow>
            ))}
          </AbstractGridFormArrayElement>
        );
      })}
    </AbstractGridFormArray>
  );
}
