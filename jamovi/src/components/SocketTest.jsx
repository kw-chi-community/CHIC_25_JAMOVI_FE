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
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/ws/test?token=${token}`
    );

    ws.onopen = () => {
      console.log("ws.onopen");
    };

    ws.onmessage = (event) => {
      setReceivedMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("ws.onclose");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message) {
      socket.send(message);
      setMessage("");
    }
  };

  if (isLoading || !isLoggedIn) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4} align="stretch">
        <Box>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            mr={2}
            mb={2}
          />
          <Button colorScheme="blue" onClick={sendMessage}>
            btn
          </Button>
        </Box>
        <Box>
          <VStack align="stretch" spacing={2}>
            {receivedMessages.map((msg, index) => (
              <Text key={index}>{msg}</Text>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default SocketTest;
