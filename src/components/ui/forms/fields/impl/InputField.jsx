export default function InputField({ label, placeholder, keyName, register, error }) {
  const showLabel = !!label;
  const showPlaceholder = !!placeholder;

  return (
    <div className="flex flex-col space-y-1">
      {showLabel && (
        <label className="font-medium text-gray-900 dark:text-gray-200">
          {label}
        </label>
      )}
      <input
        {...register(keyName)}
        placeholder={showPlaceholder ? placeholder : ""}
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
      />
      {error && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}
    </div>
  );
}
