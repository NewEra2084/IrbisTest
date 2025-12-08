import React from "react";

export default function DefaultGridFormArray({ field, append, hideAddButton, controlMessages, children }) {

  return (
    <div className="space-y-3">
      {field.label && <div className="font-medium">{field.label}</div>}

      {children}

      {/* Кнопка добавления блока */}
      {!hideAddButton && (
        <button
          type="button"
          onClick={() =>
            append(
              field.fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {})
            )
          }
          className="
            text-blue-600 dark:text-blue-400
            hover:text-blue-800 dark:hover:text-blue-300
            text-sm
            no-underline
          "
        >
          ➕ {field.add_element_message
                    ? field.add_element_message
                    : controlMessages && controlMessages.add_element
                        ? controlMessages.add_element
                        : "Add element"
             }
        </button>
      )}
    </div>
  );
}
