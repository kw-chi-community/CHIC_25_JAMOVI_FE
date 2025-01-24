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

const SelectOption = () => {
  const [hypothesisValue, setHypothesisValue] = useState("1"); // 가설 라디오 그룹 상태
  const [missingValue, setMissingValue] = useState("1"); // 결측 값 라디오 그룹 상태

  return (
    <div className="pt-2 p-4 w-full">
      <Card>
        <CardBody className="flex">
          <div className="w-1/2">
            <h1 className="font-bold">검증</h1>
            <Checkbox defaultChecked className="ml-5 w-full">
              Student's
            </Checkbox>
            <Checkbox className="ml-10 w-full">베이즈 계수</Checkbox>
            <span className="ml-[4rem] mr-2 w-full text-gray-400">사전</span>
            <Input size="xs" htmlSize={4} width="auto" />
            <Checkbox className="ml-5 w-full">Wilcoxon rank</Checkbox>
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
            <Checkbox className="ml-5 w-full">평균 차이</Checkbox>
            <div className="w-full flex">
              <Checkbox className="ml-10 text-gray-400">신뢰구간</Checkbox>
              <Input size="xs" htmlSize={4} width="auto" />
              <span className=" text-gray-400">%</span>
            </div>
            <Checkbox className="ml-5 w-full">효과 크기</Checkbox>
            <div className="w-full flex">
              <Checkbox className="ml-10 text-gray-400">효과 크기</Checkbox>
              <Input size="xs" htmlSize={4} width="auto" />
              <span className=" text-gray-400">%</span>
            </div>
            <Checkbox className="ml-5 w-full">기술 통계</Checkbox>
            <Checkbox className="ml-5 w-full">기술 통계 도표</Checkbox>
            <h1 className="font-bold">가정검증</h1>
            <Checkbox className="ml-5 w-full">정규분포성 검증</Checkbox>
            <Checkbox className="ml-5 w-full">Q-Q 도표</Checkbox>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SelectOption;
