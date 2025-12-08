/*export default function CheckboxField({ label, keyName, register, error }) {
  return (
    <div className="flex items-center space-x-2">
      <input type="checkbox" {...register(keyName)} />
      <label>{label}</label>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}*/

import { useState } from "react";

export default function CheckboxField({ label, keyName, register, error }) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  const id = `checkbox-${keyName}`;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="flex items-center cursor-pointer select-none space-x-2 p-1 hover:bg-gray-100 rounded-md transition"
      >
        {/* Нативный чекбокс */}
        <input
          id={id}
          type="checkbox"
          {...register(keyName)}
          checked={checked}
          onChange={handleChange}
          className="sr-only"
        />

        {/* Кастомная коробка */}
        <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center transition-colors duration-200">
          {checked && (
            <span className="text-blue-600 font-bold text-lg select-none">✓</span>
          )}
        </div>

        <span className="text-gray-800">{label}</span>
      </label>

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
