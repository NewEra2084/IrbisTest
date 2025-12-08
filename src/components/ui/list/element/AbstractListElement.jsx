const modules = import.meta.glob('./impl/*ListElement.jsx', { eager: true });
import { createComponentMap } from "@/js/utils";

const componentMap = createComponentMap(modules,"ListElement");

export default function AbstractListElement({ item, view, Content }) {
  const {type, ...rest } = view;
  const Component = componentMap[type];
  if (!Component) return null;

  return (
    <Component
        item={item}
        view={rest}
        Content={Content}
    />
  );
}
