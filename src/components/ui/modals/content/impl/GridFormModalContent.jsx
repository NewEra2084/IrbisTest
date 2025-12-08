import React, { useState } from "react";
import GridForm from "@/components/ui/forms/GridForm";
import GridFormProvider from "@/components/ui/forms/provider/GridFormProvider";
import ExternalSubmitButton from "@/components/ui/forms/controls/buttons/ExternalSubmitButton";

export default function GridFormModalContent({ modalKey, onSubmit, ...props }) {
  const [error, setError] = useState("");

  const resolvedOnSubmit = typeof onSubmit === "function" ? onSubmit(modalKey, setError) : undefined;
  const resolvedProps = { ...props, onSubmit: resolvedOnSubmit };

  return (
    <GridFormProvider {...resolvedProps}>
      <div className="flex flex-col h-full min-h-0">

        {/* Ошибка */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Прокручиваемая зона */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 -mr-1">
          <GridForm {...resolvedProps} />
        </div>

        {/* Футер с кнопкой */}
        <div className="flex-shrink-0 w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3">
          <div className="flex justify-end">
            <ExternalSubmitButton className="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    </GridFormProvider>
  );
}
