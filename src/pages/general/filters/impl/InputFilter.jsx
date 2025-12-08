export default function InputFilter({ label, value, onChange, keyName, placeholder }) {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor={keyName}
        className="font-medium text-gray-800 dark:text-gray-200"
      >
        {label}
      </label>
      <input
        id={keyName}
        type="text"
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
