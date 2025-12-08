import React from "react";

export default function DefaultGridFormArrayElement({
  field,
  children,
  remove,
  blockIndex,
  controlMessages
}) {
  return (
    <div className="
        relative p-3 rounded-lg
        border border-gray-200 dark:border-gray-600
        shadow-sm dark:shadow-none
        flex
      "
    >
      {/* Контент блока */}
      <div className="flex-1 space-y-4 text-gray-900 dark:text-gray-100">
        {children}
      </div>

      {/* Кнопка удаления */}
      <div className="ml-4 flex items-start">
        <button
          type="button"
          onClick={() => remove(blockIndex)}
          className="
            text-neutral-400 hover:text-red-500 dark:hover:text-red-400
            transition p-1 rounded
          "
          title={
                field.remove_element_message
                    ? field.remove_element_message
                    : controlMessages && controlMessages.remove_element
                        ? controlMessages.remove_element
                        : ""
          }
        >
          ✕
        </button>
      </div>
    </div>
  );
}
