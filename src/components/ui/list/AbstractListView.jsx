const modules = import.meta.glob('./impl/*ListView.jsx', { eager: true });
import { createComponentMap } from "@/js/utils";
import AbstractListElement from "./element/AbstractListElement";

const componentMap = createComponentMap(modules,"ListView");

export default function AbstractListView({type, items, itemView, ElementContent, ...rest }) {
  const Component = componentMap[type];
  if (!Component) return null;

  return (
    <Component {...rest}>
        {items.map((item) => (
            <AbstractListElement key={item.id} item={item} view={itemView} Content={ElementContent}/>
        ))}
    </Component>
  );
}
