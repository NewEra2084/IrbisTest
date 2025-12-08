const modules = import.meta.glob('./impl/*Button.jsx', { eager: true });
import { createComponentMap, bindActions } from '@/js/utils';

const componentMap = createComponentMap(modules,"Button");

export default function AbstractButton({button, context}) {
  const { type, key, actions, ...rest } = button;
  const sender = {type,key,...rest};
  const boundActions = bindActions(actions,context,sender);

  const Component = componentMap[type];

  if (!Component) return null;

  return (
    <Component
      keyName={key}
      {...boundActions}
      {...rest}
    />
  );
}
