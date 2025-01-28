import React, { useState, useCallback } from "react";
import {
  Card,
  CardBody,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  Button,
} from "@chakra-ui/react";
import useStats from "../hooks/useStats"; // useStats 훅 임포트

const OptionForm = () => {
  // 폼 상태 관리
  const [hypothesisValue, setHypothesisValue] = useState("1");
  const [missingValue, setMissingValue] = useState("1");
  const [studentChecked, setStudentChecked] = useState(true);
  const [bayesChecked, setBayesChecked] = useState(false);
  const [priorValue, setPriorValue] = useState("");
  const [wilcoxonChecked, setWilcoxonChecked] = useState(false);
  const [meanDifferenceChecked, setMeanDifferenceChecked] = useState(false);
  const [confidenceInterval, setConfidenceInterval] = useState("95");
  const [effectSizeChecked, setEffectSizeChecked] = useState(false);
  const [effectSize, setEffectSize] = useState("95");
  const [descriptiveStatsChecked, setDescriptiveStatsChecked] = useState(false);
  const [descriptiveStatsChartChecked, setDescriptiveStatsChartChecked] =
    useState(false);
  const [normalityChecked, setNormalityChecked] = useState(false);
  const [qqPlotChecked, setQqPlotChecked] = useState(false);

  // 폼 상태 객체 생성
  const formState = {
    hypothesisValue,
    missingValue,
    studentChecked,
    bayesChecked,
    priorValue,
    wilcoxonChecked,
    meanDifferenceChecked,
    confidenceInterval,
    effectSizeChecked,
    effectSize,
    descriptiveStatsChecked,
    descriptiveStatsChartChecked,
    normalityChecked,
    qqPlotChecked,
  };

  // useStats 훅 호출
  useStats(formState, 500); // 500ms 디바운스 적용

  // 상태 변경 핸들러
  const toggleCheckbox = useCallback((setter) => {
    setter((prev) => !prev);
  }, []);

  const handleInputChange = useCallback(
    (setter) => (e) => {
      setter(e.target.value);
    },
    []
  );

  const handleRadioChange = useCallback(
    (setter) => (value) => {
      setter(value);
    },
    []
  );

  return (
    <div className="pt-2 pr-2 p-4 w-full">
      <Card>
        <CardBody className="flex flex-col lg:flex-row">
          {/* 왼쪽 컬럼 */}
          <div className="flex flex-col w-full lg:w-1/2 pr-4">
            {/* 검증 섹션 */}
            <div className="mb-6">
              <h1 className="font-bold text-lg mb-2">검증</h1>
              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={studentChecked}
                  onChange={() => toggleCheckbox(setStudentChecked)}
                  className="mr-2"
                >
                  Student's
                </Checkbox>
              </div>
              <div className="ml-10 mb-2">
                <Checkbox
                  isChecked={bayesChecked}
                  onChange={() => toggleCheckbox(setBayesChecked)}
                  className="mr-2"
                >
                  베이즈 계수
                </Checkbox>
                <div className="flex items-center">
                  <span
                    className={`ml-[1.5rem] mr-2 ${
                      !bayesChecked ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    사전
                  </span>
                  <Input
                    size="xs"
                    htmlSize={4}
                    width="auto"
                    value={priorValue}
                    onChange={handleInputChange(setPriorValue)}
                    isDisabled={!bayesChecked}
                  />
                </div>
              </div>
              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={wilcoxonChecked}
                  onChange={() => toggleCheckbox(setWilcoxonChecked)}
                  className="mr-2"
                >
                  Wilcoxon rank
                </Checkbox>
              </div>
            </div>

            {/* 가설 섹션 */}
            <div className="mb-6">
              <h1 className="font-bold text-lg mb-2">가설</h1>
              <RadioGroup
                onChange={handleRadioChange(setHypothesisValue)}
                value={hypothesisValue}
              >
                <div className="flex flex-col ml-5 space-y-1">
                  <Radio value="1">측정 1 ≠ 측정 2</Radio>
                  <Radio value="2">측정 1 &gt; 측정 2</Radio>
                  <Radio value="3">측정 1 &lt; 측정 2</Radio>
                </div>
              </RadioGroup>
            </div>

            {/* 결측 값 섹션 */}
            <div className="mb-6">
              <h1 className="font-bold text-lg mb-2">결측 값</h1>
              <RadioGroup
                onChange={handleRadioChange(setMissingValue)}
                value={missingValue}
              >
                <div className="flex flex-col ml-5 space-y-1">
                  <Radio value="1">대응별 결측값 제거(pairwise)</Radio>
                  <Radio value="2">목록별 결측값 제거(listwise)</Radio>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex flex-col w-full lg:w-1/2 pl-4">
            {/* 추가 통계 섹션 */}
            <div className="mb-6">
              <h1 className="font-bold text-lg mb-2">추가 통계</h1>
              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={meanDifferenceChecked}
                  onChange={() => toggleCheckbox(setMeanDifferenceChecked)}
                  className="mr-2"
                >
                  평균 차이
                </Checkbox>
              </div>
              <div
                className={`flex items-center ml-10 mb-2 ${
                  !meanDifferenceChecked ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Checkbox
                  isChecked={confidenceInterval !== ""}
                  onChange={() =>
                    setConfidenceInterval(confidenceInterval === "" ? "95" : "")
                  }
                  className="mr-2"
                >
                  신뢰구간
                </Checkbox>
                <Input
                  size="xs"
                  htmlSize={4}
                  width="auto"
                  value={confidenceInterval}
                  onChange={handleInputChange(setConfidenceInterval)}
                  isDisabled={!meanDifferenceChecked}
                />
                <span
                  className={`text-gray-400 ml-1 ${
                    meanDifferenceChecked ? "" : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  %
                </span>
              </div>

              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={effectSizeChecked}
                  onChange={() => toggleCheckbox(setEffectSizeChecked)}
                  className="mr-2"
                >
                  효과 크기
                </Checkbox>
                {effectSizeChecked && (
                  <div className="flex items-center">
                    <Input
                      size="xs"
                      htmlSize={4}
                      width="auto"
                      value={effectSize}
                      onChange={handleInputChange(setEffectSize)}
                      isDisabled={!effectSizeChecked}
                    />
                    <span className="text-gray-400 ml-1">%</span>
                  </div>
                )}
              </div>

              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={descriptiveStatsChecked}
                  onChange={() => toggleCheckbox(setDescriptiveStatsChecked)}
                  className="mr-2"
                >
                  기술 통계
                </Checkbox>
              </div>

              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={descriptiveStatsChartChecked}
                  onChange={() =>
                    toggleCheckbox(setDescriptiveStatsChartChecked)
                  }
                  className="mr-2"
                >
                  기술 통계 도표
                </Checkbox>
              </div>
            </div>

            {/* 가정검증 섹션 */}
            <div className="mb-6">
              <h1 className="font-bold text-lg mb-2">가정검증</h1>
              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={normalityChecked}
                  onChange={() => toggleCheckbox(setNormalityChecked)}
                  className="mr-2"
                >
                  정규분포성 검증
                </Checkbox>
              </div>
              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={qqPlotChecked}
                  onChange={() => toggleCheckbox(setQqPlotChecked)}
                  className="mr-2"
                >
                  Q-Q 도표
                </Checkbox>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OptionForm;
