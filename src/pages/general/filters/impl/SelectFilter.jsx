export default function SelectFilter({ label, value, onChange, keyName, options }) {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor={keyName}
        className="font-medium text-gray-800 dark:text-gray-200"
      >
        {label}
      </label>
      <select
        id={keyName}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
