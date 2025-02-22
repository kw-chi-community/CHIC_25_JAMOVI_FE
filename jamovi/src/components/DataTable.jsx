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

  useEffect(() => {
    if (ws) {
      wsRef.current = ws;
    }
  }, [ws]);

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
      // 값 변경 시 실행
      // console.log("Cell value changed:", args);
      sendData(args);
    });
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
