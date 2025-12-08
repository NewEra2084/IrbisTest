import React from "react";

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizes = [5, 10, 20, 50, 100],
  siblings = 1,
  boundaries = 1,
}) {
  const totalPages = Math.ceil(total / pageSize);

  const range = (start, end) => {
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  };

  function handlePageSizeChange(e) {
    onPageSizeChange(Number(e.target.value));
    onPageChange(1); // сброс
  }

  const buttonClass =
    "px-3 py-1 rounded-md font-semibold transition-colors " +
    "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 " +
    "hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed";

  const activeClass = "bg-blue-600 text-white dark:bg-blue-500";

  // =====================================================================
  //     🟦 РАННИЙ ВОЗВРАТ — если страниц всего 1, не рисуем лишние кнопки
  // =====================================================================
  if (totalPages <= 1) {
    return (
      <div className="flex justify-center my-4">
        <div className="flex flex-col md:flex-row items-center w-full max-w-3xl bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow">
          {/* pageSize selector */}
          <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-4 w-full md:w-auto">
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e)}
              className="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 w-full md:w-auto"
            >
              {pageSizes.map((s) => (
                <option key={s} value={s}>
                  {s} / page
                </option>
              ))}
            </select>
          </div>

          {/* single page button */}
          <div className="flex items-center justify-center flex-1">
            <button className={`${buttonClass} ${activeClass}`} disabled>
              1
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================================
  //                         🟧 Обычная пагинация
  // =====================================================================

  const pagination = () => {
    const pages = [];
    const left = Math.max(page - siblings, boundaries + 1);
    const right = Math.min(page + siblings, totalPages - boundaries);

    // Начальные страницы
    pages.push(...range(1, boundaries));

    if (left > boundaries + 1) pages.push("...");

    // Середина
    pages.push(...range(left, right));

    if (right < totalPages - boundaries) pages.push("...");

    // Конечные страницы
    pages.push(...range(totalPages - boundaries + 1, totalPages));

    return pages;
  };

  return (
    <div className="flex justify-center my-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-3xl bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow">
        {/* Селектор pageSize */}
        <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-4 w-full md:w-auto">
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e)}
            className="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 w-full md:w-auto"
          >
            {pageSizes.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>

        {/* Контейнер кнопок */}
        <div className="flex items-center justify-between flex-1 w-full">
          {/* Prev */}
          <button
            className={buttonClass}
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            ‹
          </button>

          {/* Центральный блок */}
          <div className="flex items-center gap-1 justify-center flex-1 flex-wrap">
            {pagination().map((p, idx) =>
              p === "..." ? (
                <span
                  key={idx}
                  className="px-2 py-1 text-gray-500 dark:text-gray-400 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={idx}
                  className={`${buttonClass} ${p === page ? activeClass : ""}`}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </button>
              )
            )}
          </div>

          {/* Next */}
          <button
            className={buttonClass}
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
