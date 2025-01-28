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
    <div className="min-h-1/2 pb-2 p-4">
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
                      handleChange(rowIndex, colIndex, e.target.value)
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

export default DataTable;
