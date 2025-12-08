/*import React from "react";

export default function DefaultGridFormArrayElement({
  children,
  remove,
  blockIndex,
}) {
  return (
    <div className="relative p-3 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
      <div className="space-y-4">{children}</div>

      <button
        type="button"
        onClick={() => remove(blockIndex)}
        className="absolute top-2 right-2 text-neutral-400 hover:text-red-500 transition"
        title="Удалить блок"
      >
        ✕
      </button>
    </div>
  );
}*/

import React from "react";
import { Trash2 } from "lucide-react";

export default function DefaultGridFormArrayElement({
  children,
  remove,
  blockIndex,
}) {
  return (
    <div className="relative p-3 rounded-lg border border-gray-200 shadow-sm flex">
      {/* Контент блока */}
      <div className="flex-1 space-y-4">
        {children}
      </div>

      {/* Кнопка удаления сверху справа */}
      <div className="ml-4 flex items-start">
        <button
          type="button"
          onClick={() => remove(blockIndex)}
          className="text-neutral-400 hover:text-red-500 transition p-1 rounded"
          title="Удалить блок"
        >
          ✕
        </button>
      </div>
    </div>
  );
}





