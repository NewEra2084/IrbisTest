/*const gridColsMap = Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [i + 1, `grid-cols-${i + 1}`])
);*/

const gridColsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export default function DefaultGridFormRow({ row, rowIndex, cols, parentCols, children }) {
  return (
    <div className={`grid gap-4 ${gridColsMap[cols || parentCols || 1] || "grid-cols-1"}`} data-row={rowIndex}>
      {children}
    </div>
  );
}
