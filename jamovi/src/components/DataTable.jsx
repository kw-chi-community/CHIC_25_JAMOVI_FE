import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import useTableHandlers from "../hooks/useTableHandlers";
// import { createInitialData } from "../utils/tableUtils";
import { Spinner } from "@chakra-ui/react";

const DataTable = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const token = localStorage.getItem("token");

  const [data, setData, ws, loading] = useWebSocket(projectId, token);
  const wsRef = useRef(null);

  useEffect(() => {
    if (ws) {
      wsRef.current = ws;
    }
  }, [ws]);

  const {
    editingCell,
    cellValue,
    cellWidths,
    handleCellDoubleClick,
    handleCellChange,
    handleKeyDown,
    handlePaste,
    handleInputChange,
  } = useTableHandlers(data, setData, wsRef);

  // 데이터 받아오기 전까지 -
  // css는 jsx 안에 다 넣으면 되는 건가? 아니면 css 파일 새로 만들어도 되려나
  if (loading || !data) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ overflow: "auto", maxHeight: "400px" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {/* 좌상단 빈 셀 */}
            <th
              style={{
                border: "1px solid #ddd",
                padding: "0",
                backgroundColor: "#f2f2f2",
                position: "sticky",
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            ></th>

            {/* 열 번호? 알파벳?*/}
            {data &&
              data[0] &&
              data[0].map((_, colIndex) => (
                <th
                  key={`col-${colIndex}`}
                  style={{
                    border: "1px solid #ddd",
                    padding: "0",
                    backgroundColor: "#f2f2f2",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {String.fromCharCode(65 + colIndex)}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* 행 번호 */}
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "0",
                    backgroundColor: "#f2f2f2",
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    textAlign: "center",
                  }}
                >
                  {rowIndex + 1}
                </td>

                {row.map((cell, colIndex) => {
                  const cellKey = `${rowIndex}-${colIndex}`;
                  const isFocused =
                    editingCell?.row === rowIndex &&
                    editingCell?.col === colIndex;
                  const cellWidth =
                    isFocused && cellWidths[cellKey]
                      ? cellWidths[cellKey]
                      : "80px";

                  return (
                    <td
                      key={cellKey}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        height: "30px",
                        minWidth: isFocused ? cellWidth : "80px",
                        width: isFocused ? cellWidth : "80px",
                        transition: "width 0.2s ease",
                      }}
                      onClick={() =>
                        handleCellDoubleClick(rowIndex, colIndex, cell)
                      }
                      onDoubleClick={() =>
                        handleCellDoubleClick(rowIndex, colIndex, cell)
                      }
                    >
                      {isFocused ? (
                        <input
                          type="text"
                          value={cellValue}
                          onChange={(e) =>
                            handleInputChange(e, rowIndex, colIndex)
                          }
                          onBlur={() =>
                            handleCellChange(rowIndex, colIndex, cellValue)
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, rowIndex, colIndex)
                          }
                          onPaste={(e) => handlePaste(e, rowIndex, colIndex)}
                          autoFocus
                          style={{
                            width: "100%",
                            border: "none",
                            outline: "none",
                            padding: "0",
                          }}
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
