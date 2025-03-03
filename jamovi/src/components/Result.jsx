import {
  Card,
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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useResult } from "../contexts/ResultContext";
import useProj from "../hooks/useProj"; // ✅ useProj 훅 임포트

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
  const location = useLocation();
  const { getProject, updateProject, delProj } = useProj(); // ✅ 프로젝트 관련 함수 사용
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("id");

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false); // ✅ 추가: Collapse 상태
  const [items, setItems] = useState(["1", "2", "3"]); // ✅ 추가: items 상태

  useEffect(() => {
    console.log("현재 프로젝트 ID:", projectId);
  }, [projectId]);

  const handleEditProject = async () => {
    if (!projectId) return;

    try {
      const projectData = await getProject(Number(projectId)); // ✅ projectId를 숫자로 변환
      setNewName(projectData.name);
      setNewDescription(projectData.description || "");
      onOpen(); // ✅ 모달 열기
    } catch (err) {
      toast({
        title: "불러오기 실패",
        description:
          err.message || "프로젝트 정보를 불러오는 중 오류가 발생했습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateProject = async () => {
    if (!projectId) return;

    try {
      await updateProject(Number(projectId), {
        name: newName,
        description: newDescription,
      });

      toast({
        title: "수정 완료",
        description: "프로젝트가 성공적으로 수정되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose(); // ✅ 모달 닫기
    } catch (err) {
      toast({
        title: "수정 실패",
        description: err.message || "프로젝트 수정 중 오류가 발생했습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const toggleCollapse = () => {
    // ✅ 추가: Collapse 상태 토글 함수
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
    <DndContext modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
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
                    <Button
                      variant="solid"
                      colorScheme="red"
                      onClick={() => delProj(Number(projectId))}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="solid"
                      onClick={() => navigate("/project")}
                    >
                      Go to Project
                    </Button>
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      onClick={handleEditProject}
                    >
                      Edit Project
                    </Button>
                    <Button variant="solid" onClick={handleNavigateToLogin}>
                      logout
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
                    onClick={toggleCollapse} // ✅ 수정: Collapse 버튼 작동
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

        {/* 프로젝트 수정 모달 */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>프로젝트 수정</ModalHeader>
            <ModalBody>
              <Input
                placeholder="새 프로젝트 이름"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                mb={3}
              />
              <Textarea
                placeholder="새 프로젝트 설명"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} mr={3}>
                취소
              </Button>
              <Button colorScheme="blue" onClick={handleUpdateProject}>
                수정
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DndContext>
  );
};

export default Result;
