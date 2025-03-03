import React, { createContext, useContext, useState } from "react";

const ResultContext = createContext();

export const ResultProvider = ({ children }) => {
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <ResultContext.Provider value={{ analysisResult, setAnalysisResult }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
};
