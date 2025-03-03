import { useState } from "react";
import { measureTextWidth } from "../utils/tableUtils";

const useTableHandlers = (data, setData, wsRef) => {
  const [editingCell, setEditingCell] = useState(null);
  const [cellValue, setCellValue] = useState("");
  const [cellWidths, setCellWidths] = useState({});

  const handleCellDoubleClick = (rowIndex, colIndex, value) => {
    setEditingCell({ row: rowIndex, col: colIndex });
    setCellValue(value);

    const textWidth = measureTextWidth(value);
    const minWidth = 80;
    const newWidth = Math.max(textWidth, minWidth);

    setCellWidths((prev) => ({
      ...prev,
      [`${rowIndex}-${colIndex}`]: newWidth,
    }));
  };

  const handleCellChange = (rowIndex, colIndex, newValue) => {
    setEditingCell(null);

    if (!data) return;

    const newData = [...data];
    if (newData[rowIndex] && newData[rowIndex][colIndex] !== undefined) {
      newData[rowIndex][colIndex] = newValue;
      setData(newData);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "update_cell",
            row: rowIndex,
            col: colIndex,
            value: newValue,
          })
        );
      }
    }
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (e.key === "Enter") {
      handleCellChange(rowIndex, colIndex, cellValue);
    }
  };

  const handlePaste = (e, rowIndex, colIndex) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("text");

    const rows = clipboardData.split("\n").filter((row) => row.trim() !== "");

    if (rows.length === 0) return;

    const newData = [...data];

    rows.forEach((row, rowOffset) => {
      const cells = row.split("\t");

      cells.forEach((cell, colOffset) => {
        const targetRow = rowIndex + rowOffset;
        const targetCol = colIndex + colOffset;

        if (targetRow < newData.length && targetCol < newData[0].length) {
          newData[targetRow][targetCol] = cell.trim();
        }
      });
    });

    setData(newData);

    if (rows[0].split("\t")[0].trim()) {
      setCellValue(rows[0].split("\t")[0].trim());
    }
  };

  const handleInputChange = (e, rowIndex, colIndex) => {
    const newValue = e.target.value;
    setCellValue(newValue);

    const newWidth = measureTextWidth(newValue);
    const minWidth = 80;
    setCellWidths((prev) => ({
      ...prev,
      [`${rowIndex}-${colIndex}`]: Math.max(newWidth, minWidth),
    }));
  };

  return {
    editingCell,
    cellValue,
    cellWidths,
    handleCellDoubleClick,
    handleCellChange,
    handleKeyDown,
    handlePaste,
    handleInputChange,
  };
};

export default useTableHandlers;
