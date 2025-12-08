// Загружаем все компоненты из папки filters, по шаблону *Filter.jsx
const modules = import.meta.glob('./impl/*Field.jsx', { eager: true });
/*import { createComponentMap } from '@/js/utils';

const componentMap = createComponentMap(modules,"Field");

export default function AbstractField({ field, register, errors }) {
  const { type, key, ...rest } = field;
  const Component = componentMap[type];

  if (!Component) return null;

  return (
      <Component
        {...rest}
        keyName={key}
        register={register}
        error={errors?.[key]}
      />
    );
}*/
import get from "lodash/get";
import { createComponentMap } from "@/js/utils";

const componentMap = createComponentMap(modules,"Field");

export default function AbstractField({ field, register, errors }) {
  const { keyName, type, ...rest } = field;
  const Component = componentMap[type];
  if (!Component) return null;

  // достаём ошибку по точному пути
  const error = get(errors, keyName);

  return (
    <Component
      {...rest}
      keyName={keyName}
      register={register}
      error={error}
    />
  );
}
