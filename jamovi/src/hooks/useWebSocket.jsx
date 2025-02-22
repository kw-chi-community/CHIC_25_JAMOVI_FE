import { useState, useEffect } from "react";

const useWebSocket = (projectId, token) => {
  const [data, setData] = useState([]); // 초기 데이터 비워둠
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!projectId || !token) {
      console.error("프로젝트 ID 또는 토큰이 없습니다.");
      return;
    }

    const websocket = new WebSocket(
      `${
        import.meta.env.VITE_WS_URL
      }/projects/table?project_id=${projectId}&token=${token}`
    );

    // 웹소켓 연결
    websocket.onopen = () => {
      console.log("WebSocket 연결 성공!");
    };

    // 데이터 수신
    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.success) {
        if (response.type === "initial_data") {
          setData(response.data); // 초기 데이터 업데이트
        } else if (response.type === "update") {
          setData((prevData) => {
            const newData = [...prevData];
            newData[response.row][response.col] = response.value;
            return newData;
          });
        }
      } else {
        console.error("WebSocket 수신 에러:", response.message);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket 오류 발생:", error);
    };

    // 웹소켓 연결 종료
    websocket.onclose = (event) => {
      console.warn("WebSocket 연결 종료됨:", event.code);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [projectId, token]);
  return [data, setData, ws];
};

export default useWebSocket;
