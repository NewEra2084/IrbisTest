export default function DateField({ label, keyName, register, error }) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="font-medium">{label}</label>
      <input type="date" {...register(keyName)} className={`border px-2 py-1 rounded ${error ? "border-red-500" : "border-gray-300"}`} />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}