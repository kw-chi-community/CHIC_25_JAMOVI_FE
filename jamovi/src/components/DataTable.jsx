import React, { useState } from "react";

const DataTable = () => {
  const [data, setData] = useState(
    Array.from({ length: 10 }, () => Array(20).fill(""))
  );

  const handleChange = (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  return (
    <table className="border-collapse w-full border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2 bg-gray-100"></th>
          {Array.from({ length: 20 }, (_, index) => (
            <th
              key={index}
              className="border border-gray-300 py-2 bg-gray-100 w-1/20"
            >
              {index + 1}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td className="border border-gray-300 p-2 text-center">
              {rowIndex + 1}
            </td>
            {row.map((cell, colIndex) => (
              <td key={colIndex} className="border border-gray-300 w-[5%]">
                <input
                  type="text"
                  value={cell}
                  onChange={(e) =>
                    handleChange(rowIndex, colIndex, e.target.value)
                  }
                  className="border-none outline-none py-2 w-full"
                  placeholder={`Row ${rowIndex + 1}, Col ${colIndex + 1}`}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
