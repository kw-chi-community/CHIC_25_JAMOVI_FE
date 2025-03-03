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
  List,
  ListItem,
  Divider,
  Badge,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  const { analysisResult, setAnalysisResult } = useResult();

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
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  const [testList, setTestList] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [isLoadingResult, setIsLoadingResult] = useState(false);

  useEffect(() => {
    console.log("현재 프로젝트 ID:", projectId);
  }, [projectId]);

  // 프로젝트의 통계 테스트 목록 가져오기
  useEffect(() => {
    if (!projectId) return;

    const fetchTestList = async () => {
      setIsLoadingTests(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/statistics/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setTestList(data.tests);
          // 테스트가 있으면 첫 번째 테스트를 선택
          if (data.tests.length > 0) {
            setSelectedTestId(data.tests[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching test list:", error);
      } finally {
        setIsLoadingTests(false);
      }
    };

    fetchTestList();
  }, [projectId, token]);

  // 특정 테스트 결과 가져오기
  const fetchTestResult = async (testId) => {
    if (!testId || !projectId) return;

    setIsLoadingResult(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/statistics/${projectId}/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        console.log("Test result:", data);
        setTestResult(data);
      }
    } catch (error) {
      console.error(`Error fetching test result for ID ${testId}:`, error);
      toast({
        title: "결과 로딩 오류",
        description: `테스트 결과를 가져오는 중 오류가 발생했습니다: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingResult(false);
    }
  };

  // 테스트 선택 핸들러
  const handleSelectTest = (testId) => {
    setSelectedTestId(testId);
    fetchTestResult(testId);
  };

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
    if (isLoadingResult) {
      return (
        <Box p={4} textAlign="center">
          <Spinner size="xl" />
          <Text mt={4}>결과를 불러오는 중입니다...</Text>
        </Box>
      );
    }

    if (!testResult) {
      return (
        <Box p={4} textAlign="center">
          <Text color="gray.500">
            왼쪽 목록에서 통계 분석 결과를 선택하거나 새로운 분석을 실행하세요.
          </Text>
        </Box>
      );
    }

    const result = testResult.statistical_test_result;

    return (
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg">{testResult.alias}</Heading>
          <Badge colorScheme="blue" fontSize="md" p={2}>
            {testResult.test_method}
          </Badge>
        </Flex>

        {/* One-Sample T-Test 또는 One-Way ANOVA 결과 */}
        {result.group_stats && result.test_stats && (
          <>
            <StatsTable title="그룹 통계량" data={result.group_stats} />
            <StatsTable title="검정 통계량" data={result.test_stats} />
          </>
        )}

        {/* Paired T-Test 또는 Independent T-Test 결과 */}
        {result.group1_stats && result.group2_stats && (
          <>
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
          </>
        )}

        {/* LLM 결과 및 결론 */}
        {(testResult.results || testResult.conclusion) && (
          <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
            {testResult.results && (
              <Box mb={4}>
                <Heading size="md" mb={2}>
                  분석 결과 해석
                </Heading>
                <Text whiteSpace="pre-wrap">{testResult.results}</Text>
              </Box>
            )}

            {testResult.conclusion && (
              <Box>
                <Heading size="md" mb={2}>
                  결론
                </Heading>
                <Text whiteSpace="pre-wrap">{testResult.conclusion}</Text>
              </Box>
            )}
          </Box>
        )}
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

                {/* 통계 테스트 목록 */}
                <Box>
                  <Heading size="md" mb={3}>
                    통계 분석 목록
                  </Heading>
                  <Divider mb={3} />

                  {isLoadingTests ? (
                    <Text>로딩 중...</Text>
                  ) : testList.length > 0 ? (
                    <List spacing={2}>
                      {testList.map((test) => (
                        <ListItem
                          key={test.id}
                          p={2}
                          borderRadius="md"
                          bg={
                            selectedTestId === test.id
                              ? "blue.50"
                              : "transparent"
                          }
                          _hover={{ bg: "gray.100" }}
                          cursor="pointer"
                          onClick={() => handleSelectTest(test.id)}
                        >
                          <Flex justify="space-between" align="center">
                            <Text
                              fontWeight={
                                selectedTestId === test.id ? "bold" : "normal"
                              }
                            >
                              {test.alias}
                            </Text>
                            <Badge colorScheme="blue" variant="outline">
                              #{test.id}
                            </Badge>
                          </Flex>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Text color="gray.500">
                      아직 수행된 통계 분석이 없습니다.
                    </Text>
                  )}
                </Box>
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
