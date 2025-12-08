import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import AbstractField from "./fields/AbstractField";
import AbstractGridFormRow from "./grid/AbstractGridFormRow";
import AbstractGridFormCell from "./grid/AbstractGridFormCell";
import RecursiveArrayField from "./grid/RecursiveArrayField";
import { splitFieldsIntoRows } from "./grid/utils/grid-utils";
import { generateYupSchema } from "./grid/utils/validation";

const buildTemplates = function (template){
    const tmpl = (template) ? template : "default";
    return {
        row : tmpl,
        cell : tmpl,
        array : tmpl,
        array_element : tmpl
    };
}

const templatesBuilder = function (template){
    if (template){
        if (typeof template === 'string'){
            return buildTemplates(template);
        }else if (typeof template === 'object'){
            return { ...buildTemplates(), ...template};
        }
    }
    return buildTemplates();
}

export default function GridSubmitForm({
  fields,
  schema,
  onSubmit,
  defaultValues,
  renderSubmit,
  validationMessages,
  controlMessages,
  cols = 1,
  template = "default"
}) {
  const validationMsgs = validationMessages ? ((typeof validationMessages === 'function') ? validationMessages() : validationMessages) : {};
  const controlMsgs = controlMessages ? ((typeof controlMessages === 'function') ? controlMessages() : validationMessages) : {};

  const templates = templatesBuilder(template);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema || generateYupSchema(fields,validationMsgs)),
    defaultValues,
    mode: "onChange",
    shouldUnregister: true
  });

  const submit = handleSubmit(onSubmit);
  const rowsFields = splitFieldsIntoRows(fields, cols);

  const level = 0;

  return (
    <form onSubmit={submit} className="flex flex-col space-y-4 h-full">
      {/* Тело формы */}
      <div className="flex-1 space-y-4">
            {rowsFields.map((row, rowIndex) => (
                    <AbstractGridFormRow key={`row-${rowIndex}`} row={row} rowIndex={rowIndex} cols={cols} parentCols={cols} level={level} templates={templates}>
                      {row.cells.map((field, cellIndex) => {
                        const parentKey =`${rowIndex}-${cellIndex}`;
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

      <div
          className="
            sticky bottom-0 left-0 right-0
            bg-white
            pt-3 pb-3
            border-t border-gray-200
            shadow-[0_-4px_8px_rgba(0,0,0,0.05)]
            flex justify-end
            z-10
            px-1
          "
        >
          {renderSubmit ? (
            renderSubmit({ isSubmitting, isValid })
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              type="submit"
            >
              Отправить
            </button>
          )}
        </div>
    </form>
  )
}
