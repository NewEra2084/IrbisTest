export const distributeColsProportionally = function (rowFields, totalCols) {
      const totalDesired = rowFields.reduce((sum, f) => sum + (f.cols || 1), 0);

      // Если сумма желаемых колонок меньше или равна totalCols, масштабируем
      const scaled = rowFields.map((f, i) => {
        const raw = Math.floor(((f.cols || 1) / totalDesired) * totalCols);
        return { ...f, cols: raw, srcCols : f.cols};
      });

      // Рассчитаем остаток после округления вниз
      const usedCols = scaled.reduce((sum, f) => sum + f.cols, 0);
      const remainder = totalCols - usedCols;

      // Добавляем остаток к последнему полю
      if (remainder > 0 && scaled.length > 0) {
        scaled[scaled.length - 1].cols += remainder;
      }

      return scaled;
  };

export const buildRow = (fields,cols) => ({cells : fields, cols : cols});

export const splitFieldsIntoRows = function (fields, cols) {
    const rows = [];
    let currentRow = [];
    let currentRowRemaining = cols;

    for (let i = 0; i < fields.length; i++) {
      const fieldCols = Math.min(fields[i].cols || 1, cols);

      // Если поле не помещается в текущей строке → перенос на новую строку
      if (fieldCols > currentRowRemaining) {
        if (currentRow.length > 0) {
          rows.push(buildRow(distributeColsProportionally(currentRow,cols),cols));
        }
        currentRow = [];
        currentRowRemaining = cols;
      }

      currentRow.push(fields[i]);
      currentRowRemaining -= fieldCols;
    }

    if (currentRow.length > 0) {
      rows.push(buildRow(distributeColsProportionally(currentRow,cols),cols));
    }

    return rows;
};
