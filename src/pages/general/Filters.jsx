import { useMemo } from "react";
import AbstractFilter from "./filters/AbstractFilter";
import { useFilters } from "@/store/filterStore";

export default function Filters({ filters, filtersName }) {
  const { values, setValue } = useFilters(filtersName, filters);

  // ВАЖНО: не делаем ручную инициализацию здесь — за это отвечает initFilters в хуке.
  // Просто рендерим фильтры, даём защитный wrapper на onChange,
  // так как AbstractFilter может отдавать event или value.

  // memoize filters map to avoid re-creating callbacks on every render
  const filtersList = useMemo(() => filters ?? [], [filters]);

  return (
    <section className="bg-white dark:bg-gray-900 shadow dark:shadow-md border-t dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-4">
        {filtersList.map(filter => (
          <AbstractFilter
            key={filter.key}
            filter={filter}
            value={values[filter.key] ?? filter.value}
            onChange={raw => {
              // AbstractFilter может передавать event либо value.
              const value = raw && raw.target !== undefined ? raw.target.value : raw;
              setValue(filter.key, value);
            }}
          />
        ))}
      </div>
    </section>
  );
}
