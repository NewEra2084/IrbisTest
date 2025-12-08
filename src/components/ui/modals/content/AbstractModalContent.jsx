// Загружаем все компоненты из папки filters, по шаблону *Filter.jsx
const modules = import.meta.glob('./impl/*ModalContent.jsx', { eager: true });
import { createComponentMap } from '@/js/utils';

const componentMap = createComponentMap(modules,"ModalContent");


export default function AbstractModalContent({ type = "default", modalKey, props = {}, children}) {

  const Component = componentMap[type];

  if (!Component) {
      console.warn(`❗ Modal type "${type}" не найден, используется default`);
      return <div>{children}</div>;
  }

  return <Component modalKey={modalKey} {...props}>{children}</Component>;
}