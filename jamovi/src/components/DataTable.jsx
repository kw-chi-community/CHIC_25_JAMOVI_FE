import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { SpreadSheets, Worksheet } from "@mescius/spread-sheets-react";
import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
import * as GC from "@mescius/spread-sheets";

import useWebSocket from "../hooks/useWebSocket";

const DataTable = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const token = localStorage.getItem("token");

  const [data, setData, ws] = useWebSocket(projectId, token);

  const wsRef = useRef(null);
  const spreadRef = useRef(null);
  const isTableInitialized = useRef(false); // 초기화 여부를 추적하는 플래그

  useEffect(() => {
    if (ws) {
      wsRef.current = ws;
    }
  }, [ws]);

  // data가 업데이트될 때, spreadRef가 준비되어 있고 아직 초기화되지 않았다면 한 번만 실행
  useEffect(() => {
    if (
      !isTableInitialized.current &&
      data &&
      data.length > 0 &&
      spreadRef.current
    ) {
      initTable();
      isTableInitialized.current = true;
    }
  }, [data]);

  const initTable = () => {
    console.log("초기 데이터로 테이블 초기화:", data);
    const sheet = spreadRef.current.getActiveSheet();
    // data 배열의 각 요소를 순회하며 셀 업데이트
    data.forEach((rowData, rowIndex) => {
      rowData.forEach((cellData, colIndex) => {
        sheet.setValue(rowIndex, colIndex, cellData);
      });
    });
  };

  // 웹소켓으로 데이터를 전송하는 함수
  const sendData = (dataToSend) => {
    const wsInstance = wsRef.current || ws;
    const { row, col, newValue } = dataToSend;

    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      wsInstance.send(
        JSON.stringify({
          row,
          col,
          value: newValue,
        })
      );
      console.log("전송된 데이터:", { row, col, value: newValue });
    } else {
      console.log("WebSocket 연결이 준비되지 않음.");
    }
  };

  // Spread 초기화 함수
  const initSpread = (spread) => {
    spreadRef.current = spread;
    const sheet = spread.getActiveSheet();

    sheet.bind(GC.Spread.Sheets.Events.ValueChanged, (event, args) => {
      sendData(args);
    });

    // 스프레드 초기화 시, 이미 data가 있다면 초기화 실행
    if (!isTableInitialized.current && data && data.length > 0) {
      initTable();
      isTableInitialized.current = true;
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
