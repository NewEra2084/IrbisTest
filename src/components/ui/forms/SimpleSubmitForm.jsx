import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import  AbstractField from "./fields/AbstractField";

export default function SimpleSubmitForm({fields, schema, onSubmit, renderSubmit}) {
  const { register, handleSubmit, formState : { errors, isSubmitting, isValid } } = useForm({
    resolver: yupResolver(schema),
  });

  const submit = handleSubmit(onSubmit);

  return (
    <form onSubmit={submit} className="space-y-4">
      {fields.map((field) => (
        <AbstractField key={field.key} field={field} register={register} errors={errors} />
      ))}

      {renderSubmit
             ? renderSubmit({ isSubmitting, isValid })
             : <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Отправить</button>
      }
    </form>
  );
}