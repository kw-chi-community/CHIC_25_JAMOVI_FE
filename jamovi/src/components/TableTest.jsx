import React from "react";
import { SpreadSheets, Worksheet } from "@mescius/spread-sheets-react";
import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";

function TableTest() {
  // 시트 초기화 함수
  const initSpread = (spread) => {
    const sheet = spread.getActiveSheet();
    sheet.setValue(0, 0, "이름");
    sheet.setValue(0, 1, "나이");
    sheet.setValue(1, 0, "홍길동");
    sheet.setValue(1, 1, 28);
    sheet.setValue(2, 0, "김철수");
    sheet.setValue(2, 1, 32);
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
}

export default TableTest;
