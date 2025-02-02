import React, { useEffect, useState } from "react";
import { Box, Input, Button, VStack, Heading, Text, Container } from "@chakra-ui/react";
import LoadingSpinner from "./LoadingSpinner";

const LlmResultsSocket = () => {
  const [socket, setSocket] = useState(null);
  const [variablesText, setVariablesText] = useState(""); // JSON 문자열 입력
  const [result, setResult] = useState("");
  
  useEffect(() => {
    // 예시: 환경 변수 또는 직접 URL 지정
    const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/llm_results`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("WebSocket 연결됨:", wsUrl);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.result) {
        setResult(data.result);
      } else if (data.error) {
        setResult("Error: " + data.error);
      }
    };
    
    ws.onclose = () => {
      console.log("WebSocket 연결 종료");
    };
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, []);
  
  // 테스트를 위한 샘플 변수(JSON 포맷의 문자열)
  const sampleVariables = {
    "group1_name": "실험군",
    "group1_stats_n": 25,
    "group1_stats_min": 74,
    "group1_stats_max": 94,
    "group1_stats_mean": 85.4,
    "group1_stats_median": 86,
    "group1_stats_sd": 5.2,
    "group1_stats_se": 1.04,
    "group2_name": "대조군",
    "group2_stats_n": 25,
    "group2_stats_min": 68,
    "group2_stats_max": 88,
    "group2_stats_mean": 79.2,
    "group2_stats_median": 80,
    "group2_stats_sd": 6.1,
    "group2_stats_se": 1.22,
    "t 통계량": 3.35,
    "df 자유도": 48,
    "p value": 0.0015,
    "confidence_interval_lower": 2.4,
    "confidence_interval_upper": 9.2,
    "conf_level": 95,
    "유의수준": "0.05",
    "실험설계방법": "무작위 배정",
    "피험자정보": "30명의 성인 참가자",
    "정규성만족여부": "예",
    "등분산성만족여부": "예",
    "독립성만족여부": "예"
  };

  const sendRequest = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // 테스트: "independent_t_test" 분석 요청 전송
      socket.send(
        JSON.stringify({
          test_type: "independent_t_test",
          variables: sampleVariables,
        })
      );
    }
  };

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4} align="stretch">
        <Heading size="lg">LLM Results WebSocket Test</Heading>
        <Box>
          <Button colorScheme="blue" onClick={sendRequest}>
            분석 요청 전송
          </Button>
        </Box>
        <Box p={4} border="1px" borderColor="gray.200">
          <Text whiteSpace="pre-wrap">{result}</Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default LlmResultsSocket;