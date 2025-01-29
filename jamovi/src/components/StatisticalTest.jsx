import React, { useState } from "react";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Container,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";

const StatisticalTest = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [projectId, setProjectId] = useState(1);
  const [testResults, setTestResults] = useState(null);

  const [testType, setTestType] = useState("OneWayANOVA");
  const [hypothesis, setHypothesis] = useState("RightTailed");
  const [missingValueHandling, setMissingValueHandling] = useState("pairwise");
  const [confidenceInterval, setConfidenceInterval] = useState(95);
  const [effectSize, setEffectSize] = useState("Eta_Squared");
  const [effectSizeValue, setEffectSizeValue] = useState(0.06);
  const [descriptiveStats, setDescriptiveStats] = useState(true);
  const [testData, setTestData] = useState({
    group1: [1, 2, 1, 3, 2, 1],
    group2: [5, 4, 5, 5, 3, 4],
    group3: [5, 4, 5, 5, 3, 4],
  }); // anova의 경우 무한히 추가 가능, one sample t test는 그룹 하나만, paired랑 independent는 그룹 두 개

  const sendTestData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/statistics/run`,
        {
          test: testType,
          hypothesis: hypothesis,
          missingValueHandling: missingValueHandling,
          meanDifference: false,
          confidenceInterval: confidenceInterval,
          effectSize: effectSize,
          effectSizeValue: effectSizeValue,
          descriptiveStats: descriptiveStats,
          value: testData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            project_id: projectId,
          },
        }
      );

      if (response.data.success) {
        setTestResults(response.data.result);
        setMessages((prev) => [...prev, "goood!"]);
      } else {
        setMessages((prev) => [...prev, response.data.message]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, `${error.message}`]);
    }
  };

  if (isLoading || !isLoggedIn) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text mb={2}>Project ID</Text>
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Enter Project ID"
          />
        </Box>

        <Box>
          <Text mb={2}>Test Type</Text>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
          >
            <option value="OneWayANOVA">One Way ANOVA</option>
            <option value="PairedTTest">Paired T-Test</option>
            <option value="IndependentTTest">Independent T-Test</option>
            <option value="OneSampleTTest">One Sample T-Test</option>
          </select>
        </Box>

        <Box>
          <Text mb={2}>Hypothesis</Text>
          <select
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
          >
            <option value="RightTailed">a &gt; b</option>
            <option value="LeftTailed">a &lt; b</option>
            <option value="TwoTailedSame">a == b</option>
            <option value="TwoTailedDiff">a != b</option>
          </select>
        </Box>

        <Button colorScheme="blue" onClick={sendTestData}>
          Send Test Data
        </Button>

        {testResults && (
          <Box borderWidth="1px" borderRadius="lg" p={4}>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </Box>
        )}

        <Box>
          <Text fontWeight="bold">Messages:</Text>
          {messages.map((message, index) => (
            <Text key={index}>{message}</Text>
          ))}
        </Box>
      </VStack>
    </Container>
  );
};

export default StatisticalTest;
