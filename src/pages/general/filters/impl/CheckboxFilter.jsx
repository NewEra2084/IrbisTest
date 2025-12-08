export default function CheckboxFilter({ label, value, onChange, keyName }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        id={keyName}
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
      />
      <label
        htmlFor={keyName}
        className="font-medium text-gray-800 dark:text-gray-200"
      >
        {label}
      </label>
    </div>
  );
}

