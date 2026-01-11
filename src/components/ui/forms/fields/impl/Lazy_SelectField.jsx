import { useContext, useEffect, useState } from "react";
import { PageContext } from "@/store/context/PageContext";
import { AppContext } from "../../../../../store/context/AppContext";
import InputField from "./InputField"

export default function LazySelectField({
  label,
  description,
  keyName,
  register,
  options,
  error,
}) {
  const PageCtx = useContext(PageContext);
  const AppCtx = useContext(AppContext);
  const [state, setState] = useState("");
  const [opt, setOpt] = useState(options);
  
  useEffect(() => {
    setOpt(
      options.filter((item) => item.value.toLowerCase().includes(state.toLowerCase()))
    );
  }, [state, options]);

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="font-medium text-gray-900 dark:text-gray-200">
          {label}
        </label>
      )}
      <InputField
        register={()=>{}}
        type="text"
        placeholder="Введите имя"
        onInput={(e) => setState(e.target.value)}
      />
      <select
        {...register(keyName)}
        className={`
          border px-2 py-1 rounded-md
          bg-white text-gray-900
          dark:bg-gray-700 dark:text-gray-100
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
          focus:outline-none
          focus:border-blue-500 dark:focus:border-blue-400
          focus:ring-2 focus:ring-blue-400/40 dark:focus:ring-blue-400/30
          transition-all duration-150
        `}
      >
        <option value="">-- выберите --</option>
        {opt.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.value}
          </option>
        ))}
      </select>

      {/* Ошибка */}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}

      {/* Описание */}
      {description && (
        <p className="text-gray-500 dark:text-gray-400 text-justify text-sm mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
