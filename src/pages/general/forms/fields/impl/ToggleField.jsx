export default function ToggleField({ label, keyName, register, error }) {
  const id = `toggle-${keyName}`;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="flex items-center justify-between cursor-pointer select-none p-2 rounded-md hover:bg-gray-100 transition"
      >
        <span className="text-gray-800">{label}</span>

        {/* Видимый тогл */}
        <div className="relative">
          {/* Настоящий чекбокс */}
          <input
            id={id}
            type="checkbox"
            {...register(keyName)}
            className="sr-only peer"
          />

          {/* Фон (вкл / выкл) */}
          <div className="w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>

          {/* Бегунок */}
          <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></div>
        </div>
      </label>

      {/* Ошибка от валидации */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
