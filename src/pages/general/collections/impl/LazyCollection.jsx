import { useEffect, useContext, useMemo } from 'react';
import { PageContext } from "@/store/context/PageContext";
import Pagination from '@/components/ui/pagination/Pagination';
import AbstractListView from "@/components/ui/list/AbstractListView";

function DefaultPreload() {
  return <div className="text-sm">Loading...</div>;
}

function DefaultErrorContent({ ...error }) {
  return <div className="text-red-500 text-sm">Ошибка загрузки: {error.message}</div>;
}

export default function LazyCollection({
  collectionViewType = "grid",
  itemView = {},
  ElementContent,
  PreloadContent = DefaultPreload,
  ErrorContent = DefaultErrorContent,
  children,
}) {
  const { collection, list, filters, pagination } = useContext(PageContext);

  const { store: useStore } = list || {};
  
  const { values: filterValues } = filters("user_list");
  const { values: paginationValues, setPage, setPageSize } = pagination(collection);
  
  const page = useStore((s) => s.lastPageData) || { items: [], count: 0 };
  
  const isLoading = useStore((s) => s.isLoading);
  const error = useStore((s) => s.error);
  const fetchPage = useStore((s) => s.fetchFilteredPage);
  
  // Загружаем страницу данных
  useEffect(() => {
    fetchPage(filterValues, paginationValues);
  }, [fetchPage, filterValues, paginationValues]);
  
  // Сброс страницы при изменении фильтров
  useEffect(() => {
    if (paginationValues.page !== 1) {
      setPage(1);
    }
  }, [filterValues]);
  
  if (!useStore) return null;
  if (isLoading) return <PreloadContent />;
  if (error) return <ErrorContent {...error} />;
  
  const Collection = () => (
    <AbstractListView
    type={collectionViewType}
    items={page.items}
    itemView={itemView}
    ElementContent={ElementContent}
    />
  );
  
  const PaginationBlock = () => (
    <Pagination
      page={paginationValues.page}
      pageSize={paginationValues.pageSize}
      total={page.count}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      />
  );

  if (typeof children === "function") {
    return children({
      page,
      paginationValues,
      setPage,
      setPageSize,
      Collection,
      Pagination: PaginationBlock,
    });
  }

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="flex-1 overflow-auto">
        <Collection />
      </div>
      <PaginationBlock />
    </div>
  );
}
