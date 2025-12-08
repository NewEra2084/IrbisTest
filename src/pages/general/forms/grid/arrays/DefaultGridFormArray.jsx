import React from "react";

export default function DefaultGridFormArray({field, append, hideAddButton, children }) {
  return (
    <div className="space-y-3">
      {children}

      {/* Добавить блок */}
      {!hideAddButton && (

        <button type="button" onClick={() => append(field.fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}))} className="text-blue-600 hover:underline hover:text-blue-800 text-sm">
            ➕ Добавить группу
        </button>
      )}
    </div>
  );
}
