import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardBody,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  Select,
  Button,
  useToast,
  Textarea,
  Box,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import { useTableData } from "../contexts/TableDataContext";
import { useSearchParams } from "react-router-dom";
import { useResult } from "../contexts/ResultContext";

const testTypes = [
  { id: "OneWayANOVA", label: "📊 One-Way ANOVA" },
  { id: "PairedTTest", label: "🔗 Paired T-Test" },
  { id: "IndependentTTest", label: "🔄 Independent T-Test" },
  { id: "OneSampleTTest", label: "🧪 One-Sample T-Test" },
];

// 검정 방법별로 적당한 가설 & 효과 크기 타입 지정
const testMethodMappings = {
  OneWayANOVA: {
    hypothesis: "TwoTailedDiff",
    effectSize: "Eta_Squared",
  },
  PairedTTest: {
    hypothesis: "TwoTailedDiff",
    effectSize: "Cohens_D",
  },
  IndependentTTest: {
    hypothesis: "TwoTailedDiff",
    effectSize: "Cohens_D",
  },
  OneSampleTTest: {
    hypothesis: "TwoTailedDiff",
    effectSize: "Cohens_D",
  },
};

const columns = Array.from({ length: 20 }, (_, i) =>
  String.fromCharCode(97 + i)
);

const OptionForm = () => {
  const { tableData } = useTableData();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const token = localStorage.getItem("token");
  const [test, setTest] = useState("OneWayANOVA");
  const [hypothesis, setHypothesis] = useState("TwoTailedDiff");
  const [meanDifference, setMeanDifference] = useState(false); // 하드코딩
  const [confidenceInterval, setConfidenceInterval] = useState("95");
  const [effectSize, setEffectSize] = useState("Eta_Squared");
  const [effectSizeValue, setEffectSizeValue] = useState("0"); // 하드코딩
  const [descriptiveStats, setDescriptiveStats] = useState(true);
  const [userSelectedHypothesis, setUserSelectedHypothesis] = useState(false);
  const [userSelectedEffectSize, setUserSelectedEffectSize] = useState(false);
  // 실험 설계 방식과 피험자 정보를 위한 상태 추가
  const [experimentDesign, setExperimentDesign] = useState("");
  const [subjectInfo, setSubjectInfo] = useState("");

  const [dataInputs, setDataInputs] = useState([
    { id: 1, column: "a", startRow: "", endRow: "", groupName: "" },
  ]);

  const toast = useToast();
  const { setAnalysisResult } = useResult();

  const experimentDesignTimerRef = useRef(null);
  const subjectInfoTimerRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      const savedExperimentDesign = localStorage.getItem(
        `experimentDesign_${projectId}`
      );
      const savedSubjectInfo = localStorage.getItem(`subjectInfo_${projectId}`);

      if (savedExperimentDesign) {
        setExperimentDesign(savedExperimentDesign);
      }

      if (savedSubjectInfo) {
        setSubjectInfo(savedSubjectInfo);
      }
    }
  }, [projectId]);

  const saveToLocalStorage = useCallback(
    (key, value) => {
      if (projectId) {
        localStorage.setItem(key, value);
      }
    },
    [projectId]
  );

  const handleExperimentDesignChange = (e) => {
    const newValue = e.target.value;
    setExperimentDesign(newValue);

    if (experimentDesignTimerRef.current) {
      clearTimeout(experimentDesignTimerRef.current);
    }

    experimentDesignTimerRef.current = setTimeout(() => {
      saveToLocalStorage(`experimentDesign_${projectId}`, newValue);
    }, 500);
  };

  const handleSubjectInfoChange = (e) => {
    const newValue = e.target.value;
    setSubjectInfo(newValue);

    if (subjectInfoTimerRef.current) {
      clearTimeout(subjectInfoTimerRef.current);
    }

    subjectInfoTimerRef.current = setTimeout(() => {
      saveToLocalStorage(`subjectInfo_${projectId}`, newValue);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (experimentDesignTimerRef.current) {
        clearTimeout(experimentDesignTimerRef.current);
      }
      if (subjectInfoTimerRef.current) {
        clearTimeout(subjectInfoTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (testMethodMappings[test]) {
      const newHypothesis = testMethodMappings[test].hypothesis;
      const newEffectSize = testMethodMappings[test].effectSize;

      setHypothesis((prev) => {
        return userSelectedHypothesis ? prev : newHypothesis;
      });
      setEffectSize((prev) => {
        return userSelectedEffectSize ? prev : newEffectSize;
      });
    }
  }, [test, userSelectedHypothesis, userSelectedEffectSize]);

  const getMaxInputs = () => {
    switch (test) {
      case "PairedTTest":
      case "IndependentTTest":
        return 2;
      case "OneSampleTTest":
        return 1;
      default:
        return Infinity;
    }
  };

  const addDataInput = () => {
    if (dataInputs.length < getMaxInputs()) {
      setDataInputs([
        ...dataInputs,
        {
          id: Date.now(),
          column: "a",
          startRow: "",
          endRow: "",
          groupName: "",
        },
      ]);
    }
  };

  const removeDataInput = (id) => {
    setDataInputs(dataInputs.filter((input) => input.id !== id));
  };

  const handleDataInputChange = (id, field, value) => {
    setDataInputs(
      dataInputs.map((input) =>
        input.id === id ? { ...input, [field]: value } : input
      )
    );
  };

  const handleInputChange = useCallback(
    (setter) => (e) => {
      setter(e.target.value);
    },
    []
  );

  const toggleCheckbox = useCallback(
    (setter) => () => {
      setter((prev) => !prev);
    },
    []
  );

  const handleSubmit = () => {
    const isDataInputsValid = dataInputs.every(
      (input) =>
        input.column && input.startRow && input.endRow && input.groupName
    );

    const isEffectSizeValueValid =
      effectSizeValue && !isNaN(parseFloat(effectSizeValue));

    const isConfidenceIntervalValid =
      confidenceInterval === "" ||
      (parseFloat(confidenceInterval) > 0 &&
        parseFloat(confidenceInterval) < 100);

    if (!isDataInputsValid) {
      toast({
        title: "입력 오류",
        description: "모든 데이터 입력 필드를 채워주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!isEffectSizeValueValid) {
      toast({
        title: "입력 오류",
        description: "유효한 효과 크기 값을 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!isConfidenceIntervalValid) {
      toast({
        title: "입력 오류",
        description: "신뢰구간은 0부터 100 사이의 값이어야 합니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!tableData || tableData.length === 0) {
      toast({
        title: "데이터 오류",
        description: "테이블 데이터를 불러올 수 없습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (projectId) {
      localStorage.setItem(`experimentDesign_${projectId}`, experimentDesign);
      localStorage.setItem(`subjectInfo_${projectId}`, subjectInfo);

      toast({
        title: "정보 저장 완료",
        description: "실험 설계 및 피험자 정보가 저장되었습니다.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }

    const transformedData = {};

    dataInputs.forEach((input) => {
      const { column, startRow, endRow, groupName } = input;

      const colIndex = column.toUpperCase().charCodeAt(0) - 65;

      const startRowIndex = parseInt(startRow, 10) - 1;
      const endRowIndex = parseInt(endRow, 10) - 1;

      console.log(
        `Processing input: column=${column}, colIndex=${colIndex}, startRow=${startRowIndex}, endRow=${endRowIndex}, groupName=${groupName}`
      );

      const values = [];
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        if (tableData[i] && tableData[i][colIndex] !== undefined) {
          const cellValue = tableData[i][colIndex];
          const numValue = Number(cellValue);
          if (!isNaN(numValue)) {
            values.push(numValue);
          } else {
            values.push(0);
            toast({
              title: "데이터 오류",
              description:
                "숫자 값이 아닌 데이터가 있습니다. 0으로 치환되어 분석됩니다.",
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      }

      console.log(`Extracted numeric values for ${groupName}:`, values);

      transformedData[groupName] = values;
    });

    console.log("Transformed data:", transformedData);

    const requiredGroups = {
      OneWayANOVA: 2,
      PairedTTest: 2,
      IndependentTTest: 2,
      OneSampleTTest: 1,
    };

    const groupCount = Object.keys(transformedData).length;

    if (groupCount < requiredGroups[test]) {
      toast({
        title: "데이터 오류",
        description: `${test}는 최소 ${requiredGroups[test]}개의 그룹이 필요합니다.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (
      (test === "PairedTTest" ||
        test === "IndependentTTest" ||
        test === "OneSampleTTest") &&
      groupCount !== requiredGroups[test]
    ) {
      toast({
        title: "데이터 오류",
        description: `${test}는 ${requiredGroups[test]}개의 그룹이 필요합니다.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const requestData = {
      test,
      hypothesis,
      missingValueHandling: "pairwise",
      meanDifference,
      confidenceInterval:
        confidenceInterval === "" ? 95 : parseFloat(confidenceInterval),
      effectSize,
      effectSizeValue: parseFloat(effectSizeValue),
      descriptiveStats,
      value: transformedData,
      experimentDesign,
      subjectInfo,
    };

    console.log("Sending request to /statistics/run:", requestData);

    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/statistics/run?project_id=${projectId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error("API Error Details:", errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Statistics result:", data);

        const resultWithMethod = {
          ...data,
          test_method: testTypes.find((t) => t.id === test)?.label || test,
        };

        setAnalysisResult(resultWithMethod);

        toast({
          title: "분석 완료",
          description: "통계 분석이 성공적으로 완료되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error running statistics:", error);
        toast({
          title: "분석 오류",
          description: "통계 분석 중 오류가 발생했습니다: " + error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });

    const formData = {
      test,
      hypothesis,
      meanDifference,
      confidenceInterval:
        confidenceInterval === "" ? null : parseFloat(confidenceInterval),
      effectSize,
      effectSizeValue: parseFloat(effectSizeValue),
      descriptiveStats,
      dataInputs: dataInputs.map(({ id, ...rest }) => ({
        ...rest,
        startRow: parseInt(rest.startRow, 10),
        endRow: parseInt(rest.endRow, 10),
      })),
      groupData: transformedData,
      experimentDesign,
      subjectInfo,
    };

    console.log(formData);

    return formData;
  };

  return (
    <div className="pt-2 pr-2 p-4 w-full">
      <Card>
        <CardBody className="flex flex-col">
          {/* 검정 방법 (Test Type Selection) */}
          <div className="mb-6">
            <h1 className="font-bold text-lg mb-2">검정 방법</h1>
            <div className="flex flex-wrap gap-4">
              {testTypes.map((item) => (
                <div
                  key={item.id}
                  className={`cursor-pointer border rounded-lg p-2 ${
                    test === item.id
                      ? "border-blue-500 shadow-md"
                      : "border-gray-300"
                  }`}
                  onClick={() => {
                    setTest(item.id);
                    setDataInputs([
                      {
                        id: 1,
                        column: "a",
                        startRow: "",
                        endRow: "",
                        groupName: "",
                      },
                    ]);
                    setUserSelectedHypothesis(false);
                    setUserSelectedEffectSize(false);
                  }}
                >
                  <p className="text-center mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 p-4 border rounded bg-gray-100">
            <h1 className="font-bold text-lg mb-3">실험 설계 및 피험자 정보</h1>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label className="font-medium">실험 설계 방식</label>
                <Tooltip
                  label="실험의 독립변수, 종속변수, 통제변수 등 실험 설계에 대한 상세 정보를 입력하세요."
                  placement="top"
                ></Tooltip>
              </div>
              <Textarea
                value={experimentDesign}
                onChange={handleExperimentDesignChange}
                placeholder="예시: 독립변수 - 학습 방법(2수준: 전통적 방법, 새로운 방법), 종속변수 - 시험 점수, 통제변수 - 학습 시간, 사전 지식 수준"
                size="md"
                resize="vertical"
                minHeight="100px"
                className="w-full"
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
              />
            </div>
            <div>
              <div className="flex items-center mb-2">
                <label className="font-medium">피험자 정보</label>
                <Tooltip
                  label="피험자의 수, 연령대, 성별 분포, 선정 기준 등 피험자에 대한 정보를 입력하세요."
                  placement="top"
                ></Tooltip>
              </div>
              <Textarea
                value={subjectInfo}
                onChange={handleSubjectInfoChange}
                placeholder="예시: 총 30명(남성 15명, 여성 15명), 연령대 20-30세, 평균 연령 24.5세, 선정 기준 - 정상 시력 또는 교정시력, 색맹 없음"
                size="md"
                resize="vertical"
                minHeight="100px"
                className="w-full"
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
              />
            </div>
          </div>

          {/* Data Input Fields */}
          <div className="mb-6 p-4 border rounded bg-gray-100">
            <h1 className="font-bold text-lg mb-3">데이터 입력 설정</h1>
            {dataInputs.map((input) => (
              <div
                key={input.id}
                className="grid grid-cols-2 gap-4 mb-3 border p-3 rounded"
              >
                <div>
                  <label className="font-medium">열 선택</label>
                  <Select
                    value={input.column}
                    onChange={(e) =>
                      handleDataInputChange(input.id, "column", e.target.value)
                    }
                  >
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="font-medium">그룹 이름 셀</label>
                  <Input
                    value={input.groupName}
                    onChange={(e) =>
                      handleDataInputChange(
                        input.id,
                        "groupName",
                        e.target.value
                      )
                    }
                    placeholder="그룹 이름을 입력하세요"
                    isRequired
                  />
                </div>
                <div>
                  <label className="font-medium">시작 행</label>
                  <Input
                    type="number"
                    value={input.startRow}
                    onChange={(e) =>
                      handleDataInputChange(
                        input.id,
                        "startRow",
                        e.target.value
                      )
                    }
                    placeholder="숫자를 입력하세요"
                  />
                </div>
                <div>
                  <label className="font-medium">끝 행</label>
                  <Input
                    type="number"
                    value={input.endRow}
                    onChange={(e) =>
                      handleDataInputChange(input.id, "endRow", e.target.value)
                    }
                    placeholder="숫자를 입력하세요"
                  />
                </div>
                {dataInputs.length > 1 && (
                  <Button
                    variant="outline"
                    border="2px"
                    borderColor="red.500"
                    color="red.500"
                    borderRadius="md"
                    _hover={{
                      bg: "red.50",
                      borderColor: "red.600",
                      color: "red.600",
                    }}
                    onClick={() => removeDataInput(input.id)}
                  >
                    - 삭제
                  </Button>
                )}
              </div>
            ))}
            {dataInputs.length < getMaxInputs() && (
              <Button colorScheme="blue" onClick={addDataInput}>
                + 데이터 추가
              </Button>
            )}
          </div>

          {/* Side-by-Side Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 가설 (Hypothesis) */}
            <div className="w-full lg:w-1/2 p-5 border rounded-lg bg-gray-50 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-lg text-gray-700">가설</h1>
              </div>
              <RadioGroup
                onChange={(value) => {
                  setHypothesis(value);
                  setUserSelectedHypothesis(true);
                }}
                value={hypothesis}
              >
                <div className="flex flex-col space-y-3 text-gray-700">
                  <Radio value="RightTailed">측정 1 &gt; 측정 2</Radio>
                  <Radio value="TwoTailedSame">측정 1 = 측정 2</Radio>
                  <Radio value="TwoTailedDiff">측정 1 ≠ 측정 2</Radio>
                  <Radio value="LeftTailed">측정 1 &lt; 측정 2</Radio>
                </div>
              </RadioGroup>
            </div>
            {/* 추가 통계 */}
            <div className="w-full lg:w-1/2 p-5 border rounded-lg bg-gray-50 shadow-sm">
              <h1 className="font-bold text-lg text-gray-700 mb-4">
                추가 통계
              </h1>

              {/* Effect Size Type Selection */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium text-gray-700">
                    Effect Size Type
                  </label>
                </div>
                <Select
                  value={effectSize}
                  onChange={(e) => {
                    setEffectSize(e.target.value);
                    setUserSelectedEffectSize(true);
                  }}
                  className="mt-2 border-gray-300 rounded-md"
                >
                  <option value="Cohens_D">Cohen's D</option>
                  <option value="Eta_Squared">Eta squared</option>
                  <option value="Standardized_Mean_Difference">
                    Standardized Mean Difference
                  </option>
                </Select>
              </div>

              {/* 신뢰구간 (Confidence Interval) */}
              <div className="mb-5 flex items-center gap-2">
                신뢰구간
                <Input
                  type="number"
                  size="xs"
                  width="2.5rem"
                  textAlign="center"
                  value={confidenceInterval}
                  onChange={(e) =>
                    setConfidenceInterval(
                      e.target.value ? parseFloat(e.target.value) : ""
                    )
                  }
                  className="border-gray-300 rounded-md px-2"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <Button
              colorScheme="blue"
              size="lg"
              width="100%"
              onClick={handleSubmit}
            >
              분석 실행
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OptionForm;
