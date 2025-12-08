const modules = import.meta.glob('./impl/*Card.jsx', { eager: true });
import { createComponentMap } from "@/js/utils";
const componentMap = createComponentMap(modules,"Card");

export default function AbstractCard({...props}) {
  const {type, children, ...rest } = props;

  const Component = componentMap[type || "simple"];
  if (!Component) return null;

  return (
    <Component {...rest}>{children}</Component>
  );
}
