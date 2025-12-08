import { useEffect, useContext, useMemo } from 'react';
import { PageContext } from "@/store/context/PageContext";
import LazyCollection from './impl/LazyCollection';
import FetchCollection from './impl/FetchCollection';

export default function AbstractCollection({...props}) {
  const { collection, list, filters, pagination } = useContext(PageContext);



  const Component = list.isLazy ? LazyCollection : FetchCollection;
  //const Component = FetchCollection;

  return (
    <Component {...props}/>
  )
}