import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Collapse,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import { DndContext } from "@dnd-kit/core";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useResult } from "../contexts/ResultContext";

const StatsTable = ({ title, data }) => {
  if (!data) return null;

  return (
    <Box mb={6}>
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>통계량</Th>
            <Th>값</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(data).map(([key, value]) => (
            <Tr key={key}>
              <Td fontWeight="medium">{formatStatKey(key)}</Td>
              <Td isNumeric>
                {typeof value === "number" ? formatNumber(value) : value}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const formatStatKey = (key) => {
  const keyMap = {
    group_name: "그룹명",
    stats_min: "최소값",
    stats_max: "최대값",
    stats_median: "중앙값",
    stats_mean: "평균",
    stats_sd: "표준편차",
    stats_se: "표준오차",
    stats_n: "표본 수",
    stats_q1: "1사분위수",
    stats_q3: "3사분위수",
    stats_var: "분산",
    n: "표본 수",
    mean: "평균",
    sd: "표준편차",
    se: "표준오차",
    min: "최소값",
    max: "최대값",
    median: "중앙값",
    t_statistic: "t 통계량",
    df: "자유도",
    p_value: "p-값",
    confidence_interval_lower: "신뢰구간 하한",
    confidence_interval_upper: "신뢰구간 상한",
    conf_level: "신뢰수준",
    mu: "모평균",
  };

  return keyMap[key] || key;
};

const formatNumber = (num) => {
  if (Math.abs(num) < 0.0001) {
    return num.toExponential(6);
  }
  return Number.isInteger(num) ? num : num.toFixed(4);
};

const Result = () => {
  const navigate = useNavigate();
  const { analysisResult } = useResult();

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const [items, setItems] = useState(["1", "2", "3"]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.indexOf(active.id);
        const newIndex = prevItems.indexOf(over.id);
        const updatedItems = Array.from(prevItems);
        updatedItems.splice(oldIndex, 1);
        updatedItems.splice(newIndex, 0, active.id);
        return updatedItems;
      });
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderResults = () => {
    if (!analysisResult || !analysisResult.success) {
      return (
        <Box p={4} textAlign="center">
          <Text color="gray.500">
            분석을 실행하면 결과가 여기에 표시됩니다.
          </Text>
        </Box>
      );
    }

    const result = analysisResult.result;

    if (result.group_stats && result.test_stats) {
      return (
        <Box p={4}>
          <Heading size="lg" mb={4}>
            분석 결과
          </Heading>
          <StatsTable title="그룹 통계량" data={result.group_stats} />
          <StatsTable title="검정 통계량" data={result.test_stats} />
        </Box>
      );
    }

    if (result.group1_stats && result.group2_stats) {
      return (
        <Box p={4}>
          <Heading size="lg" mb={4}>
            분석 결과
          </Heading>
          <StatsTable
            title={`그룹 통계량: ${result.group1_stats.group_name}`}
            data={result.group1_stats}
          />
          <StatsTable
            title={`그룹 통계량: ${result.group2_stats.group_name}`}
            data={result.group2_stats}
          />
          {result.diff_stats && (
            <StatsTable title="차이 통계량" data={result.diff_stats} />
          )}
          <StatsTable title="검정 통계량" data={result.test_stats} />
        </Box>
      );
    }

    return (
      <Box p={4}>
        <Heading size="lg" mb={4}>
          분석 결과
        </Heading>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </Box>
    );
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <div className="pl-2 p-4 w-full h-full">
        <Card className="w-full h-full">
          <div className="w-full px-6">
            <Collapse in={!isCollapsed} animateOpacity>
              <div className="transition-all">
                <div className="w-full flex items-center my-4">
                  <div className="w-1/2">
                    <h1>결과</h1>
                  </div>
                  <div className="w-1/2 flex justify-end space-x-4">
                    <Button variant="solid">export</Button>
                    <Button variant="solid">new project</Button>
                    <Button variant="solid" onClick={handleNavigateToLogin}>
                      logout
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleCollapse}
                      className="p-0"
                    >
                      {isCollapsed ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <hr />
              </div>
            </Collapse>
          </div>
          <div className="h-full px-5">
            {isCollapsed && <div className="m-5" />}

            <div className="flex w-full h-full">
              <div className="w-3/4 pt-0 pl-0 p-5">
                {!isCollapsed && <div className="pt-5" />}
                {renderResults()}
              </div>

              <div className="w-1/4 h-full pl-5 border-l border-gray-200">
                <Collapse in={isCollapsed} animateOpacity>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapse}
                    className="flex w-full mb-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </Collapse>
                <div>asdfasdf</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DndContext>
  );
};

export default Result;
