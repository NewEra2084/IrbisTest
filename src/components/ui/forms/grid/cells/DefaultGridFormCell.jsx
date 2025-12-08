/*const spanClassMap = Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [i + 1, `col-span-${i + 1}`])
);*/
const spanClassMap = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
};


export default function DefaultGridFormCell({ field, row, rowIndex, cellIndex, children }) {
  const fieldClass = spanClassMap[field.cols] || "col-span-1";
  return (
        <div className={fieldClass}>
            {children}
        </div>
  );
}
