export function SelectField({ label, keyName, register, options, error }) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="font-medium">{label}</label>
      <select {...register(keyName)} className={`border px-2 py-1 rounded ${error ? "border-red-500" : "border-gray-300"}`}>
        <option value="">-- выберите --</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
