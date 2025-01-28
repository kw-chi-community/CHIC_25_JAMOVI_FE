import { useState } from "react";
import {
  Card,
  CardBody,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";

const OptionForm = () => {
  const [hypothesisValue, setHypothesisValue] = useState("1");
  const [missingValue, setMissingValue] = useState("1");
  const [studentChecked, setStudentChecked] = useState(true);
  const [bayesChecked, setBayesChecked] = useState(false);
  const [priorValue, setPriorValue] = useState(""); // 사전 값 상태 추가
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

  return (
    <div className="pt-2 pr-2 p-4 w-full">
      <Card>
        <CardBody className="flex">
          <div className="flex flex-col w-1/2">
            <h1 className="font-bold">검증</h1>
            <Checkbox
              isChecked={studentChecked}
              onChange={() => setStudentChecked(!studentChecked)}
              className="ml-5"
            >
              Student's
            </Checkbox>
            <Checkbox
              isChecked={bayesChecked}
              onChange={() => setBayesChecked(!bayesChecked)}
              className="ml-10"
            >
              베이즈 계수
            </Checkbox>
            <div className="flex">
              <span
                className={`ml-[4rem] mr-2  ${
                  !bayesChecked && "opacity-50 cursor-not-allowed"
                }`}
              >
                사전
              </span>
              <Input
                size="xs"
                htmlSize={4}
                width="auto"
                value={priorValue}
                onChange={(e) => setPriorValue(e.target.value)}
                isDisabled={!bayesChecked} // 베이즈 계수가 체크되지 않으면 비활성화
              />
            </div>

            <Checkbox
              isChecked={wilcoxonChecked}
              onChange={() => setWilcoxonChecked(!wilcoxonChecked)}
              className="ml-5"
            >
              Wilcoxon rank
            </Checkbox>
            <h1 className="font-bold">가설</h1>
            <RadioGroup onChange={setHypothesisValue} value={hypothesisValue}>
              <div className="flex flex-col ml-5">
                <Radio value="1">측정 1 &ne; 측정 2</Radio>
                <Radio value="2">측정 1 &gt; 측정 2</Radio>
                <Radio value="3">측정 1 &lt; 측정 2</Radio>
              </div>
            </RadioGroup>
            <h1 className="font-bold">결측 값</h1>
            <RadioGroup onChange={setMissingValue} value={missingValue}>
              <div className="flex flex-col ml-5">
                <Radio value="1">대응별 결측값 제거(pairwise)</Radio>
                <Radio value="2">목록별 결측값 제거(listwise)</Radio>
              </div>
            </RadioGroup>
          </div>
          <div className="w-1/2">
            <h1 className="font-bold">추가 통계</h1>
            <Checkbox
              isChecked={meanDifferenceChecked}
              onChange={() => setMeanDifferenceChecked(!meanDifferenceChecked)}
              className="ml-5 w-full"
            >
              평균 차이
            </Checkbox>
            <div className="w-full flex">
              <Checkbox
                isChecked={meanDifferenceChecked && confidenceInterval !== ""}
                onChange={() =>
                  setConfidenceInterval(confidenceInterval === "" ? "1" : "")
                }
                className={`ml-10 ${
                  meanDifferenceChecked ? "" : "opacity-50 cursor-not-allowed"
                }`}
                isDisabled={!meanDifferenceChecked}
              >
                신뢰구간
              </Checkbox>
              <Input
                size="xs"
                htmlSize={4}
                width="auto"
                value={confidenceInterval}
                onChange={(e) => setConfidenceInterval(e.target.value)}
                isDisabled={!meanDifferenceChecked} // 평균 차이가 체크되지 않으면 비활성화
              />
              <span
                className={`text-gray-400 ${
                  meanDifferenceChecked ? "" : "opacity-50 cursor-not-allowed"
                }`}
              >
                %
              </span>
            </div>
            <Checkbox
              isChecked={effectSizeChecked}
              onChange={() => setEffectSizeChecked(!effectSizeChecked)}
              className="ml-5 w-full"
            >
              효과 크기
            </Checkbox>
            <div className="w-full flex">
              <Checkbox
                isChecked={effectSizeChecked && effectSize !== ""}
                onChange={() => setEffectSize(effectSize === "" ? "1" : "")}
                className={`ml-10 ${
                  effectSizeChecked ? "" : "opacity-50 cursor-not-allowed"
                }`}
                isDisabled={!effectSizeChecked}
              >
                효과 크기
              </Checkbox>
              <Input
                size="xs"
                htmlSize={4}
                width="auto"
                value={effectSize}
                onChange={(e) => setEffectSize(e.target.value)}
                isDisabled={!effectSizeChecked} // 효과 크기가 체크되지 않으면 비활성화
              />
              <span
                className={`text-gray-400 ${
                  effectSizeChecked ? "" : "opacity-50 cursor-not-allowed"
                }`}
              >
                %
              </span>
            </div>
            <Checkbox
              isChecked={descriptiveStatsChecked}
              onChange={() =>
                setDescriptiveStatsChecked(!descriptiveStatsChecked)
              }
              className="ml-5 w-full"
            >
              기술 통계
            </Checkbox>
            <Checkbox
              isChecked={descriptiveStatsChartChecked}
              onChange={() =>
                setDescriptiveStatsChartChecked(!descriptiveStatsChartChecked)
              }
              className="ml-5 w-full"
            >
              기술 통계 도표
            </Checkbox>
            <h1 className="font-bold">가정검증</h1>
            <Checkbox
              isChecked={normalityChecked}
              onChange={() => setNormalityChecked(!normalityChecked)}
              className="ml-5 w-full"
            >
              정규분포성 검증
            </Checkbox>
            <Checkbox
              isChecked={qqPlotChecked}
              onChange={() => setQqPlotChecked(!qqPlotChecked)}
              className="ml-5 w-full"
            >
              Q-Q 도표
            </Checkbox>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OptionForm;
