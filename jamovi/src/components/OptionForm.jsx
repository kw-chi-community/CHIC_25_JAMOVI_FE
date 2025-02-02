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
  const [test, setTest] = useState("OneWayANOVA");
  const [hypothesis, setHypothesis] = useState("RightTailed");
  const [missingValueHandling, setMissingValueHandling] = useState("pairwise");
  const [meanDifference, setMeanDifference] = useState(false);
  const [confidenceInterval, setConfidenceInterval] = useState("95");
  const [effectSize, setEffectSize] = useState("Eta_Squared");
  const [effectSizeValue, setEffectSizeValue] = useState("0.06");
  const [descriptiveStats, setDescriptiveStats] = useState(true);

  // 변수 meta data
  const [value, setValue] = useState({
    school: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    home: [5, 4, 7, 8, 6, 5, 4, 5, 4],
  });

  // 폼 상태 객체 생성
  const formState = {
    test,
    hypothesis,
    missingValueHandling,
    meanDifference,
    confidenceInterval,
    effectSize,
    effectSizeValue,
    descriptiveStats,
    value,
  };

  // useStats 훅 호출
  useStats(formState, 500); // 500ms 디바운스 적용

  // 상태 변경 핸들러
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
            {/* <div className="mb-6">
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
            </div> */}

            {/* 가설 섹션 */}
            <div className="mb-6">
              <h1 className="font-bold text-lg mb-2">가설</h1>
              <RadioGroup
                onChange={handleRadioChange(setHypothesis)}
                value={hypothesis}
              >
                <div className="flex flex-col ml-5 space-y-1">
                  <Radio value="RightTailed">측정 1 &lt; 측정 2</Radio>
                  <Radio value="TwoTailedSame">측정 1 = 측정 2</Radio>
                  <Radio value="TwoTailedDiff">측정 1 ≠ 측정 2</Radio>
                  <Radio value="RightTailed">측정 1 &gt; 측정 2</Radio>

                  {/* <Radio value="RightTailed">측정 1 ≠ 측정 2</Radio>
                  <Radio value="TwoTailedSame">측정 1 &gt; 측정 2</Radio>
                  <Radio value="LeftTailed">측정 1 &lt; 측정 2</Radio> */}
                </div>
              </RadioGroup>
            </div>

            {/* 결측 값 섹션 */}
            <div className="mb-6">
              <h1 className="font-bold text-lg mb-2">결측 값</h1>
              <RadioGroup
                onChange={handleRadioChange(setMissingValueHandling)}
                value={missingValueHandling}
              >
                <div className="flex flex-col ml-5 space-y-1">
                  <Radio value="pairwise">대응별 결측값 제거(pairwise)</Radio>
                  <Radio value="ListwiseDeletion">
                    목록별 결측값 제거(listwise)
                  </Radio>
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
                  isChecked={meanDifference}
                  onChange={() => toggleCheckbox(setMeanDifference)}
                  className="mr-2"
                >
                  평균 차이
                </Checkbox>
                {/* <NativeSelectRoot>
                  <NativeSelectField>
                    <option value="1">Eta_Squared</option>
                    <option value="2">Cohens_D</option>
                    <option value="2">Standardized_Mean_Difference</option>
                  </NativeSelectField>
                </NativeSelectRoot> */}
              </div>
              <div
                className={`flex items-center ml-10 mb-2 ${
                  !meanDifference ? "opacity-50 cursor-not-allowed" : ""
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
                  isDisabled={!meanDifference}
                />
                <span
                  className={`text-gray-400 ml-1 ${
                    meanDifference ? "" : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  %
                </span>
              </div>

              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={effectSize}
                  onChange={() => toggleCheckbox(setEffectSize)}
                  className="mr-2"
                >
                  효과 크기
                </Checkbox>
                {effectSizeValue && (
                  <div className="flex items-center">
                    <Input
                      size="xs"
                      htmlSize={4}
                      width="auto"
                      value={effectSizeValue}
                      onChange={handleInputChange(setEffectSizeValue)}
                      isDisabled={!effectSizeValue}
                    />
                    <span className="text-gray-400 ml-1">%</span>
                  </div>
                )}
              </div>

              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={descriptiveStats}
                  onChange={() => toggleCheckbox(descriptiveStats)}
                  className="mr-2"
                >
                  기술 통계
                </Checkbox>
              </div>

              <div className="flex items-center ml-5 mb-2">
                <Checkbox
                  isChecked={descriptiveStats}
                  onChange={() => toggleCheckbox(setDescriptiveStats)}
                  className="mr-2"
                >
                  기술 통계 도표
                </Checkbox>
              </div>
            </div>

            {/* 가정검증 섹션 */}
            {/* <div className="mb-6">
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
            </div> */}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OptionForm;
