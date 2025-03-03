import React, { createContext, useContext, useState } from "react";

const TableDataContext = createContext();

export const TableDataProvider = ({ children }) => {
  const [tableData, setTableData] = useState([]);

  return (
    <TableDataContext.Provider value={{ tableData, setTableData }}>
      {children}
    </TableDataContext.Provider>
  );
};

export const useTableData = () => {
  const context = useContext(TableDataContext);
  if (!context) {
    throw new Error("useTableData must be used within a TableDataProvider");
  }
  return context;
};
