// Загружаем все компоненты из папки filters, по шаблону *Filter.jsx
const modules = import.meta.glob('./impl/*Filter.jsx', { eager: true });
import { createComponentMap } from '@/js/utils';

const componentMap = createComponentMap(modules,"Filter");

export default function AbstractFilter({ filter, value, onChange }) {
  const { type, key, ...rest } = filter;
  const Component = componentMap[type];

  if (!Component) return null;

  return (
    <Component
      keyName={key}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}
