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

export default function FetchCollection({
  collectionViewType = "grid",
  itemView = {},
  ElementContent,
  PreloadContent = DefaultPreload,
  ErrorContent = DefaultErrorContent,
  children, // <--- теперь можно переопределить layout
}) {
  const { collection, list, filters, pagination } = useContext(PageContext);

  const { store: useStore } = list || {};
  if (!useStore) return null;

  const { values: filterValues } = filters("user_list");
  const { values: paginationValues, setPage, setPageSize } = pagination(collection);

  const items = useStore((s) => s.items);
  const isLoading = useStore((s) => s.isLoading);
  const error = useStore((s) => s.error);
  const fetchAll = useStore((s) => s.fetchAll);
  const getFilteredPage = useStore((s) => s.getFilteredPage);

  const page = useMemo(() => {
    return getFilteredPage(filterValues, paginationValues);
  }, [items, filterValues, paginationValues]);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    if (paginationValues.page !== 1) {
      setPage(1);
    }
  }, [filterValues]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (isLoading) return <PreloadContent />;
  if (error) return <ErrorContent {...error} />;

  // Готовые рендер-функции (могут использоваться в children)
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

  // Если есть children → полный контроль над layout
  if (typeof children === "function") {
    return children({
      page,
      items: page.items,
      paginationValues,
      setPage,
      setPageSize,
      Collection,
      Pagination: PaginationBlock,
    });
  }

  // Стандартный layout по умолчанию
  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="flex-1 overflow-auto">
        <Collection />
      </div>
      <PaginationBlock />
    </div>
  );
}

