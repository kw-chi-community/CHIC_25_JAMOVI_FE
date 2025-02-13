import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const DataTable = () => {
  const [data, setData] = useState(
    Array.from({ length: 10 }, () => Array(20).fill(""))
  );
  const [ws, setWs] = useState(null);
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const websocket = new WebSocket(
      `${
        import.meta.env.VITE_WS_URL
      }/projects/table?project_id=${projectId}&token=${token}`
    );

    websocket.onopen = () => {
      console.log("ws connected!");
    };

    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.success) {
        if (response.type === "initial_data") {
          setData(response.data);
        } else if (response.type === "update") {
          setData((prevData) => {
            const newData = [...prevData];
            newData[response.row][response.col] = response.value;
            return newData;
          });
        }
      } else {
        console.error("Error:", response.message);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocket.onclose = (event) => {
      if (event.code === 4001) {
        console.error("token not found");
      } else if (event.code === 4002) {
        console.error("invalid token");
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [projectId]);

  const handleChange = (rowIndex, colIndex, value) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][colIndex] = value;
      return newData;
    });

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
