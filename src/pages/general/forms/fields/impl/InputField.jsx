export default function InputField({ label, placeholder, keyName, register, error}) {
  const showLabel = !!label;
  const showPlaceholder = !!placeholder;

  return (
      <div className="flex flex-col space-y-1">
        {showLabel && <label className="font-medium">{label}</label>}
        <input
          {...register(keyName)}
          placeholder={showPlaceholder ? placeholder  :""}
          className={`border px-2 py-1 rounded ${error ? "border-red-500" : "border-gray-300"}`}
        />
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </div>
    );
}