import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  Container,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const SocketTest = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [socket, setSocket] = useState(null);
  const [cellValue, setCellValue] = useState("");
  const [rowNum, setRowNum] = useState(0);
  const [colNum, setColNum] = useState(0);
  const [messages, setMessages] = useState([]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (!projectId) return;

    const token = localStorage.getItem("token");
    const ws = new WebSocket(
      `${
        import.meta.env.VITE_WS_URL
      }/projects/save?project_id=${projectId}&token=${token}`
    );

    ws.onopen = () => {
      console.log("websocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (!data.success) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        setMessages((prev) => [...prev, "save!"]);
        console.log("save!");
      }
    };

    ws.onclose = () => {
      console.log("webSocket disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [projectId]);

  const sendCellData = () => {
    if (socket && cellValue) {
      const data = {
        row: parseInt(rowNum),
        col: parseInt(colNum),
        value: cellValue,
      };
      socket.send(JSON.stringify(data));
      setCellValue("");
    }
  };

  if (isLoading || !isLoggedIn) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Table Cell Editor</Heading>
        <Box>
          <Input
            placeholder="project id"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            type="number"
            mb={2}
          />
          <Input
            placeholder="row"
            value={rowNum}
            onChange={(e) => setRowNum(e.target.value)}
            type="number"
            mb={2}
          />
          <Input
            placeholder="col"
            value={colNum}
            onChange={(e) => setColNum(e.target.value)}
            type="number"
            mb={2}
          />
          <Input
            placeholder="value"
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            mb={2}
          />
          <Button onClick={sendCellData}>Save</Button>
        </Box>
        <Box>
          <VStack align="stretch" spacing={2}>
            {messages.map((msg, index) => (
              <Text key={index}>{msg}</Text>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default SocketTest;
