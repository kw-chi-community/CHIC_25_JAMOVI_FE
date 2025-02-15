import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";

const Table = ({ data, onChange }) => {
  return (
    <div className="min-h-1/2 pb-2 pr-2 p-4">
      <table className="border-collapse w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-1 bg-gray-100"></th>
            {Array.from({ length: 20 }, (_, index) => (
              <th
                key={index}
                className="border border-gray-300 py-1 bg-gray-100 w-1/20"
              >
                {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-300 p-1 text-center">
                {rowIndex + 1}
              </td>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border border-gray-300 w-[5%]">
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) =>
                      onChange(rowIndex, colIndex, e.target.value)
                    }
                    className="border-none outline-none w-full"
                    placeholder={`Row ${rowIndex + 1}, Col ${colIndex + 1}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DataTable = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const token = localStorage.getItem("token");

  const [data, ws] = useWebSocket(projectId, token);

  const handleChange = (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          row: rowIndex,
          col: colIndex,
          value: value,
        })
      );
    }
  };

  return <Table data={data} onChange={handleChange} />;
};

export default DataTable;
