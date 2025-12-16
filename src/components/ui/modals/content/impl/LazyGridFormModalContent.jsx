import { useContext, useEffect, useState } from "react";
import GridFormModalContent from "./GridFormModalContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useFetchRolesStore } from "../../../../../store/list/fetch/rolesFetchListStore";
import { modifyCollectionFields } from "../../../../../js/utils";
import { AppContext } from "../../../../../store/context/AppContext";

export default function LazyGridFormModalContent({
  modalKey,
  loadFields, // функция, которая вернет поля с сервера
  onSubmit,
  validationMessages,
  defaultValues = {},
  ...props
}) {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState(null);
  const [error, setError] = useState(null);
  const context = useContext(AppContext);

  useEffect(() => {
    let isMounted = true;
    const fetchFields = async () => {
      try {
        const data = await loadFields();
        const store = await modifyCollectionFields(context, data, "orgType");

        console.log(store);

        if (isMounted) {
          setFields(store);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Ошибка при загрузке полей");
          setLoading(false);
        }
      }
    };
    fetchFields();
    return () => {
      isMounted = false;
    };
  }, [loadFields, context]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="w-6 h-6 text-gray-600"
        />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-sm">{error}</div>;
  }

  return (
    <GridFormModalContent
      modalKey={modalKey}
      fields={fields}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      validationMessages={validationMessages}
      {...props}
    />
  );
}
