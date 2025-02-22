import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import { SpreadSheets, Worksheet } from "@mescius/spread-sheets-react";
import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
import * as GC from "@mescius/spread-sheets"; // GC 모듈 import

const DataTable = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const token = localStorage.getItem("token");

  const [data, setData, ws] = useWebSocket(projectId, token);
  const wsRef = useRef(null);

  useEffect(() => {
    if (ws) {
      wsRef.current = ws;
    }
  }, [ws]);

  // 시트 초기화 및 값 변경 이벤트 리스너 추가
  const initSpread = (spread) => {
    const sheet = spread.getActiveSheet();

    // 기존 데이터를 시트에 적용
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        sheet.setValue(rowIndex, colIndex, cell);
      });
    });

    // 셀 값이 변경될 때 handleChange 호출
    sheet.bind(GC.Spread.Sheets.Events.ValueChanged, (event, args) => {
      const { row, col, newValue } = args;
      handleChange(row, col, newValue);
    });
  };

  // WebSocket을 통해 데이터 변경 사항 전송
  const handleChange = (rowIndex, colIndex, newValue) => {
    // 상태 데이터 업데이트
    const newData = [...data];
    newData[rowIndex][colIndex] = newValue;
    setData(newData);

    const wsInstance = wsRef.current || ws;

    if (!wsInstance) return;

    if (wsInstance.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        row: rowIndex,
        col: colIndex,
        value: newValue,
      });

      wsInstance.send(message);
    }
  };

  const hostStyle = {
    width: "100%",
    height: "400px",
  };

  return (
    <div>
      <SpreadSheets workbookInitialized={initSpread} hostStyle={hostStyle}>
        <Worksheet />
      </SpreadSheets>
    </div>
  );
};

export default DataTable;
