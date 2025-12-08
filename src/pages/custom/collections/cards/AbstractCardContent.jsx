const modules = import.meta.glob('./impl/*CardContent.jsx', { eager: true });
import { createComponentMap } from '@/js/utils';

const componentMap = createComponentMap(modules,"CardContent");

export default function AbstractCardContent({id, type, item}) {
  const Component = componentMap[type];

  if (!Component) return null;

  return (
    <Component key={'card_content_'+id} {...item}/>
  );
}