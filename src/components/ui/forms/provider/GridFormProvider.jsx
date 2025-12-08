import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { GridFormContext } from "../context/GridFormContext";
import { generateYupSchema } from "../grid/utils/validation";

/**
 * Оборачивает GridForm и внешние кнопки (например, в диалоге)
 * и предоставляет форму через контекст.
 */
export default function GridFormProvider({
  fields,
  schema,
  defaultValues,
  validationMessages,
  onSubmit,
  children,
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema || generateYupSchema(fields, validationMessages || {})),
    defaultValues,
    mode: "onChange",
    shouldUnregister: true,
  });

  const submit = handleSubmit(onSubmit);

  return (
    <GridFormContext.Provider
      value={{
        register,
        control,
        errors,
        isSubmitting,
        isValid,
        submit,
        reset,
        setValue,
      }}
    >
      {children}
    </GridFormContext.Provider>
  );
}
