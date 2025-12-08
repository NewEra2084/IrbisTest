import React from "react";
import { useGridForm } from "../../context/GridFormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next';

export default function ExternalSubmitButton({ className }) {
  const { submit, isSubmitting, isValid } = useGridForm();

  const { t } = useTranslation();

  return (
    <button
      onClick={submit}
      disabled={isSubmitting}
      className={`
        bg-blue-600 text-white font-medium
        px-5 py-2.5 rounded-lg shadow
        hover:bg-blue-700
        disabled:opacity-50
        transition
        ${className || ""}
      `}
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4" />
          {t('form.control.saving')}
        </span>
      ) : (
        t('form.control.save')
      )}
    </button>
  );
}
