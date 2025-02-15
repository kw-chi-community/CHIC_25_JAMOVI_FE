// hooks/useWebSocket.js

import { useState, useEffect } from "react";

const useWebSocket = (projectId, token) => {
  const [data, setData] = useState(
    Array.from({ length: 10 }, () => Array(20).fill(""))
  );
  const [ws, setWs] = useState(null);

  useEffect(() => {
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
  }, [projectId, token]);

  return [data, ws];
};

export default useWebSocket;
