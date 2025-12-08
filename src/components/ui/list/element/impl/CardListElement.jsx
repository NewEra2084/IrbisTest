import AbstractCard from '@/components/ui/cards/AbstractCard';

function DefaultItemContent({ ...item }) {
  return (
    <pre>
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </pre>
  );
}

export default function CardListElement({ item, view, Content = DefaultItemContent}) {
  const {viewType, buttons} = view;

  const {selected} = item;

  return (
       <AbstractCard type={viewType} selected={selected} buttons={buttons}>
            <Content {...item}/>
       </AbstractCard>
  );
}