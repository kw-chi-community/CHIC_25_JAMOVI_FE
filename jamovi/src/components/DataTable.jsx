import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import { SpreadSheets, Worksheet } from "@mescius/spread-sheets-react";
import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
import * as GC from "@mescius/spread-sheets";

const DataTable = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const token = localStorage.getItem("token");

  const [data, setData, ws] = useWebSocket(projectId, token);
  const wsRef = useRef(null);
  const spreadRef = useRef(null); // Spread instance 저장

  useEffect(() => {
    if (ws) {
      wsRef.current = ws;
    }
  }, [ws]);

  // ✅ Spread 초기화 함수
  const initSpread = (spread) => {
    spreadRef.current = spread;
    const sheet = spread.getActiveSheet();
    if (data.length === 0) return; // 데이터가 없으면 실행하지 않음

    // ✅ WebSocket에서 받은 데이터를 시트에 반영
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        sheet.setValue(rowIndex, colIndex, cell);
      });
    });

    // ✅ 값 변경 이벤트 핸들러 추가
    sheet.bind(GC.Spread.Sheets.Events.ValueChanged, (event, args) => {
      const { row, col, newValue } = args;
      console.log(row, col, newValue);

      handleChange(row, col, newValue);
    });
  };

  // ✅ WebSocket을 통해 변경된 데이터 반영
  useEffect(() => {
    if (!spreadRef.current || data.length === 0) return;
    const sheet = spreadRef.current.getActiveSheet();

    // 프로그램 업데이트 시 이벤트 핸들러 임시 해제
    sheet.unbind(GC.Spread.Sheets.Events.ValueChanged);

    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        sheet.setValue(rowIndex, colIndex, cell);
      });
    });

    // 사용자 입력에 의한 변경 감지를 위해 다시 이벤트 핸들러 바인딩
    sheet.bind(GC.Spread.Sheets.Events.ValueChanged, (event, args) => {
      const { row, col, newValue } = args;
      console.log(row, col, newValue);
      handleChange(row, col, newValue);
    });
  }, [data]);

  // ✅ 값 변경 시 실행되는 함수
  const handleChange = (rowIndex, colIndex, newValue) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][colIndex] = newValue;
      return newData;
    });

    const wsInstance = wsRef.current || ws;
    if (wsInstance?.readyState === WebSocket.OPEN) {
      console.log("send");
      wsInstance.send(
        JSON.stringify({
          row: rowIndex,
          col: colIndex,
          value: newValue,
        })
      );
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
