const modules = import.meta.glob('./impl/*Content.jsx', { eager: true });
import { createComponentMap } from '@/js/utils';

const componentMap = createComponentMap(modules,"Content");

export default function AbstractContent({ type, data, context }) {
  const Component = componentMap[type];

  if (!Component) return null;

  return (
    <Component data={data} context={context}/>
  );
}