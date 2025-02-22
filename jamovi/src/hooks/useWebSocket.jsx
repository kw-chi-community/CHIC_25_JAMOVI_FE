import { useState, useEffect } from "react";

const useWebSocket = (projectId, token) => {
  const [data, setData] = useState(
    Array.from({ length: 10 }, () => Array(20).fill(""))
  );
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!projectId || !token) {
      console.error("❌ 프로젝트 ID 또는 토큰이 없습니다.");
      return;
    }

    const websocket = new WebSocket(
      `${
        import.meta.env.VITE_WS_URL
      }/projects/table?project_id=${projectId}&token=${token}`
    );

    websocket.onopen = () => {
      console.log("✅ WebSocket 연결 성공!", websocket);
    };

    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.success) {
        if (response.type === "initial_data") {
          // console.log(response.data);
          setData(response.data);
        } else if (response.type === "update") {
          setData((prevData) => {
            const newData = [...prevData];
            newData[response.row][response.col] = response.value;
            return newData;
          });
        }
      } else {
        console.error("❌ WebSocket 에러:", response.message);
      }
    };

    websocket.onerror = (error) => {
      console.error("❌ WebSocket 오류 발생:", error);
    };

    websocket.onclose = (event) => {
      console.warn("⚠️ WebSocket 연결 종료됨:", event.code);
    };

    setWs(websocket);
    console.log("🚀 useWebSocket 내부 WebSocket 생성됨:", websocket); // ✅ 디버깅 로그 추가

    return () => {
      console.log("🛑 WebSocket 연결 해제");
      websocket.close();
    };
  }, [projectId, token]);

  return [data, setData, ws];
};

export default useWebSocket;
