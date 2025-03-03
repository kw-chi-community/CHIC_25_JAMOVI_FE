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
import { useState, useEffect, useRef } from "react";
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
    var: "분산",
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
    paired: "대응 여부",
    equal_var: "등분산 가정",

    f_statistic: "F 통계량",
    between_ss: "집단 간 제곱합",
    within_ss: "집단 내 제곱합",
    total_ss: "총 제곱합",
    between_df: "집단 간 자유도",
    within_df: "집단 내 자유도",
    total_df: "총 자유도",
    between_ms: "집단 간 평균 제곱",
    within_ms: "집단 내 평균 제곱",
    eta_squared: "에타 제곱",
    omega_squared: "오메가 제곱",

    comparison: "비교 그룹",
    mean_diff: "평균 차이",

    test_method: "검정 방법",
    alternative: "대립 가설",
    statistic: "검정 통계량",
    effect_size: "효과 크기",
    power: "검정력",
  };

  return (
    keyMap[key] ||
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return "-";
  }

  if (Math.abs(num) < 0.0001) {
    return num.toExponential(4);
  }

  if (Number.isInteger(num)) {
    return num;
  }

  if (
    typeof num._fieldName === "string" &&
    num._fieldName.includes("p_value")
  ) {
    return num.toFixed(3);
  }

  if (Math.abs(num) < 0.01) {
    return num.toFixed(6);
  } else if (Math.abs(num) < 0.1) {
    return num.toFixed(5);
  } else {
    return num.toFixed(4);
  }
};

const Result = () => {
  const navigate = useNavigate();
  const { analysisResult, setAnalysisResult } = useResult();

  const normalizeAnalysisResult = (result) => {
    if (!result) return null;

    console.log("Normalizing result structure:", result);

    if (result.success && result.result) {
      return {
        alias: "최근 분석 결과",
        test_method: result.test_method || "통계 분석",
        id: result.test_id,
        statistical_test_result: result.result,
      };
    }

    if (result.statistical_test_result) {
      return result;
    }

    let testMethod = result.test_method || "통계 분석";

    if (!testMethod || testMethod === "통계 분석") {
      if (result.group_stats && !result.group1_stats) {
        testMethod = "One-Way ANOVA";
      } else if (result.group1_stats && result.group2_stats) {
        testMethod = result.paired ? "Paired T-Test" : "Independent T-Test";
      } else if (result.test_stats && result.test_stats.t_statistic) {
        testMethod = "T-Test";
      }
    }

    return {
      alias: result.alias || "분석 결과",
      test_method: testMethod,
      id: result.id,
      statistical_test_result: result,
    };
  };

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
  const [testToDelete, setTestToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [testToRename, setTestToRename] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newAlias, setNewAlias] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [isLoadingLlmResults, setIsLoadingLlmResults] = useState(false);
  const [llmResults, setLlmResults] = useState(null);

  useEffect(() => {
    if (analysisResult) {
      console.log("New analysis result received:", analysisResult);

      const normalizedResult = normalizeAnalysisResult(analysisResult);
      console.log("Normalized result:", normalizedResult);

      setTestResult(normalizedResult);

      fetchLlmResults(normalizedResult);

      const resultElement = document.getElementById("result-section");
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: "smooth" });
      }

      setSelectedTestId(null);
    }
  }, [analysisResult]);

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
    setLlmResults(null);

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
        const normalizedResult = normalizeAnalysisResult(data);
        setTestResult(normalizedResult);

        fetchLlmResults(normalizedResult);
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

  const handleDeleteTest = async () => {
    if (!testToDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/statistics/${testToDelete}`,
        {
          method: "DELETE",
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
        setTestList(testList.filter((test) => test.id !== testToDelete));

        if (selectedTestId === testToDelete) {
          setSelectedTestId(null);
          setTestResult(null);
        }

        toast({
          title: "삭제 완료",
          description: "통계 분석 결과가 성공적으로 삭제되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(`Error deleting test ID ${testToDelete}:`, error);
      toast({
        title: "삭제 오류",
        description: `통계 분석 결과를 삭제하는 중 오류가 발생했습니다: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setTestToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const openDeleteConfirm = (testId, e) => {
    e.stopPropagation();
    setTestToDelete(testId);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setTestToDelete(null);
  };

  const openRenameModal = (test, e) => {
    e.stopPropagation();
    setTestToRename(test.id);
    setNewAlias(test.alias);
    setShowRenameModal(true);
  };

  const closeRenameModal = () => {
    setShowRenameModal(false);
    setTestToRename(null);
    setNewAlias("");
  };

  const handleRenameTest = async () => {
    if (!testToRename || !newAlias.trim()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/statistics/${testToRename}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ new_alias: newAlias.trim() }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTestList(
          testList.map((test) =>
            test.id === testToRename
              ? { ...test, alias: newAlias.trim() }
              : test
          )
        );

        if (selectedTestId === testToRename && testResult) {
          setTestResult({
            ...testResult,
            alias: newAlias.trim(),
          });
        }

        toast({
          title: "이름 변경 완료",
          description: "통계 분석 이름이 성공적으로 변경되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(`Error renaming test ID ${testToRename}:`, error);
      toast({
        title: "이름 변경 오류",
        description: `통계 분석 이름을 변경하는 중 오류가 발생했습니다: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      closeRenameModal();
    }
  };

  const toggleMenu = (testId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === testId ? null : testId);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      closeMenu();
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchLlmResults = async (testResult) => {
    if (!testResult || !testResult.statistical_test_result) return;

    setIsLoadingLlmResults(true);

    try {
      let testType = "ost";
      const result = testResult.statistical_test_result;

      if (result.group_stats && !result.group1_stats) {
        testType = "owa";
      } else if (result.group1_stats && result.group2_stats) {
        if (result.diff_stats) {
          testType = "pt";
        } else {
          testType = "itt";
        }
      }

      const testId = testResult.id || 0; // null 대신 0을 기본값으로 사용

      console.log("Requesting LLM results for test type:", testType);

      const experimentalDesign =
        localStorage.getItem(`experimentDesign_${projectId}`) || "";
      const subjectInfo =
        localStorage.getItem(`subjectInfo_${projectId}`) || "";

      const questionStr = JSON.stringify(result);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/llm/results`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            test_type: testType,
            question: questionStr,
            statistical_test_id: testId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("LLM results received:", data);

      setLlmResults(data);

      if (data.success && data.output) {
        setTestResult((prev) => ({
          ...prev,
          results: data.output,
          conclusion: "",
        }));

        if (data.output) {
          try {
            console.log("Requesting LLM conclusion");
            const conclusionResponse = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/llm/conclusion`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  test_type: testType,
                  experimental_design: experimentalDesign,
                  subject_info: subjectInfo,
                  question: data.output, // LLM 결과를 그대로 전달
                  statistical_test_id: testId,
                }),
              }
            );

            if (!conclusionResponse.ok) {
              throw new Error(
                `HTTP error! Status: ${conclusionResponse.status}`
              );
            }

            const conclusionData = await conclusionResponse.json();
            console.log("LLM conclusion received:", conclusionData);

            setTestResult((prev) => ({
              ...prev,
              conclusion: conclusionData,
            }));
          } catch (error) {
            console.error("Error fetching LLM conclusion:", error);
            toast({
              title: "LLM 해석 로딩 오류",
              description: `분석 결과 해석을 가져오는 중 오류가 발생했습니다: ${error.message}`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching LLM results:", error);
      toast({
        title: "LLM 결과 로딩 오류",
        description: `분석 결과 해석을 가져오는 중 오류가 발생했습니다: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingLlmResults(false);
    }
  };

  useEffect(() => {
    if (testResult && !llmResults && !isLoadingLlmResults) {
      fetchLlmResults(testResult);
    }
  }, [testResult]);

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
            오른쪽 목록에서 통계 분석 결과를 선택하거나 새로운 분석을
            실행하세요.
          </Text>
        </Box>
      );
    }

    const result = testResult.statistical_test_result;
    if (!result) {
      console.error("No statistical test result found in:", testResult);
      return (
        <Box p={4} textAlign="center">
          <Text color="red.500">
            분석 결과 데이터가 올바르지 않습니다. 다시 시도해주세요.
          </Text>
        </Box>
      );
    }

    console.log("Rendering result:", result);

    return (
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg">{testResult.alias}</Heading>
          <Flex>
            {testResult.alias === "최근 분석 결과" && (
              <Badge colorScheme="green" fontSize="md" p={2} mr={2}>
                최신 결과
              </Badge>
            )}
            <Badge colorScheme="blue" fontSize="md" p={2}>
              {testResult.test_method}
            </Badge>
          </Flex>
        </Flex>

        {result.group_stats && !result.group1_stats && (
          <>
            <StatsTable title="그룹 통계량" data={result.group_stats} />
            {result.test_stats && (
              <StatsTable title="검정 통계량" data={result.test_stats} />
            )}
            {result.post_hoc && (
              <Box mb={6}>
                <Heading size="md" mb={2}>
                  사후 검정 결과
                </Heading>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>비교 그룹</Th>
                      <Th>평균 차이</Th>
                      <Th>p-값</Th>
                      <Th>유의성</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {result.post_hoc.map((item, index) => (
                      <Tr key={index}>
                        <Td>{item.comparison}</Td>
                        <Td isNumeric>{formatNumber(item.mean_diff)}</Td>
                        <Td isNumeric>{formatNumber(item.p_value)}</Td>
                        <Td>
                          {item.p_value < 0.05 ? (
                            <Badge colorScheme="green">유의함</Badge>
                          ) : (
                            <Badge colorScheme="red">유의하지 않음</Badge>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </>
        )}

        {result.group1_stats && result.group2_stats && (
          <>
            <StatsTable
              title={`그룹 통계량: ${
                result.group1_stats.group_name || "그룹 1"
              }`}
              data={result.group1_stats}
            />
            <StatsTable
              title={`그룹 통계량: ${
                result.group2_stats.group_name || "그룹 2"
              }`}
              data={result.group2_stats}
            />
            {result.diff_stats && (
              <StatsTable title="차이 통계량" data={result.diff_stats} />
            )}
            {result.test_stats && (
              <StatsTable title="검정 통계량" data={result.test_stats} />
            )}
          </>
        )}

        {!result.group_stats && !result.group1_stats && result.test_stats && (
          <>
            {result.sample_stats && (
              <StatsTable title="표본 통계량" data={result.sample_stats} />
            )}
            <StatsTable title="검정 통계량" data={result.test_stats} />
          </>
        )}

        {!result.group_stats && !result.group1_stats && !result.test_stats && (
          <Box p={4} textAlign="center">
            <Text color="orange.500">
              알 수 없는 형식의 분석 결과입니다. 원본 데이터를 표시합니다.
            </Text>
            <Box
              mt={4}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              overflowX="auto"
            >
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </Box>
          </Box>
        )}

        {/* LLM 결과 및 결론 */}
        {isLoadingLlmResults ? (
          <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
            <Flex direction="column" align="center" justify="center">
              <Spinner size="md" mb={2} />
              <Text>AI가 분석 결과를 해석하는 중입니다...</Text>
            </Flex>
          </Box>
        ) : (
          (testResult.results || (llmResults && llmResults.output)) && (
            <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
              <Box mb={4}>
                <Heading size="md" mb={2}>
                  통계 결과 해석
                </Heading>
                <Text whiteSpace="pre-wrap">
                  {testResult.results ||
                    (llmResults && llmResults.output) ||
                    ""}
                </Text>
              </Box>

              {testResult.conclusion && (
                <Box mt={4} pt={4} borderTopWidth="1px">
                  <Heading size="md" mb={2}>
                    결론
                  </Heading>
                  <Text whiteSpace="pre-wrap">
                    {testResult.conclusion.output ||
                      (typeof testResult.conclusion === "string"
                        ? testResult.conclusion
                        : "")}
                  </Text>
                </Box>
              )}
            </Box>
          )
        )}

        {!isLoadingLlmResults &&
          !testResult.results &&
          !(llmResults && llmResults.output) && (
            <Box mt={6}>
              <Button
                colorScheme="purple"
                onClick={() => fetchLlmResults(testResult)}
                isLoading={isLoadingLlmResults}
              >
                AI 해석 요청하기
              </Button>
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
              <div id="result-section" className="w-3/4 pt-0 pl-0 p-5">
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
                              flex="1"
                            >
                              {test.alias}
                            </Text>
                            <Flex align="center">
                              <div className="relative">
                                <button
                                  className="text-gray-500 hover:text-gray-700 p-1"
                                  onClick={(e) => toggleMenu(test.id, e)}
                                  aria-label="Options"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="12" cy="5" r="1"></circle>
                                    <circle cx="12" cy="19" r="1"></circle>
                                  </svg>
                                </button>

                                {activeMenu === test.id && (
                                  <div
                                    className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="py-1">
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) =>
                                          openRenameModal(test, e)
                                        }
                                      >
                                        <svg
                                          className="mr-2"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="14"
                                          height="14"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                        이름 변경
                                      </button>
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        onClick={(e) =>
                                          openDeleteConfirm(test.id, e)
                                        }
                                      >
                                        <svg
                                          className="mr-2"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="14"
                                          height="14"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M3 6h18"></path>
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                          <line
                                            x1="10"
                                            y1="11"
                                            x2="10"
                                            y2="17"
                                          ></line>
                                          <line
                                            x1="14"
                                            y1="11"
                                            x2="14"
                                            y2="17"
                                          ></line>
                                        </svg>
                                        삭제
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Flex>
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

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">통계 분석 결과 삭제</h3>
              <p className="mb-6">
                이 통계 분석 결과를 삭제하시겠습니까? 이 작업은 되돌릴 수
                없습니다.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  onClick={closeDeleteConfirm}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleDeleteTest}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {showRenameModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">통계 분석 이름 변경</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 이름
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  placeholder="새 이름을 입력하세요"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  onClick={closeRenameModal}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleRenameTest}
                  disabled={!newAlias.trim()}
                >
                  변경
                </button>
              </div>
            </div>
          </div>
        )}

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
