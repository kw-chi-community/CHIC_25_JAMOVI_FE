import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  Select,
  Button,
} from "@chakra-ui/react";

const testTypes = [
  { id: "OneWayANOVA", label: "📊 One-Way ANOVA" },
  { id: "PairedTTest", label: "🔗 Paired T-Test" },
  { id: "IndependentTTest", label: "🔄 Independent T-Test" },
  { id: "OneSampleTTest", label: "🧪 One-Sample T-Test" },
];

const columns = Array.from({ length: 20 }, (_, i) => String.fromCharCode(97 + i)); // "a" to "t"

const OptionForm = () => {
  const [test, setTest] = useState("OneWayANOVA");
  const [hypothesis, setHypothesis] = useState("TwoTailedDiff");
  const [meanDifference, setMeanDifference] = useState(false);
  const [confidenceInterval, setConfidenceInterval] = useState("95");
  const [effectSize, setEffectSize] = useState("Eta_Squared");
  const [effectSizeValue, setEffectSizeValue] = useState("0.06");
  const [descriptiveStats, setDescriptiveStats] = useState(true);

  // Data input fields
  const [dataInputs, setDataInputs] = useState([{ id: 1, column: "a", startRow: "", endRow: "", groupName: "" }]);

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
      setDataInputs([...dataInputs, { id: Date.now(), column: "a", startRow: "", endRow: "", groupName: "" }]);
    }
  };

  const removeDataInput = (id) => {
    setDataInputs(dataInputs.filter((input) => input.id !== id));
  };

  const handleDataInputChange = (id, field, value) => {
    setDataInputs(dataInputs.map((input) => (input.id === id ? { ...input, [field]: value } : input)));
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
                    test === item.id ? "border-blue-500 shadow-md" : "border-gray-300"
                  }`}
                  onClick={() => {
                    setTest(item.id);
                    setDataInputs([{ id: 1, column: "a", startRow: "", endRow: "", groupName: "" }]);
                  }}
                >
                  <p className="text-center mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Input Fields */}
          <div className="mb-6 p-4 border rounded bg-gray-100">
            <h1 className="font-bold text-lg mb-3">데이터 입력 설정</h1>
            {dataInputs.map((input) => (
              <div key={input.id} className="grid grid-cols-2 gap-4 mb-3 border p-3 rounded">
                <div>
                  <label className="font-medium">열 선택</label>
                  <Select value={input.column} onChange={(e) => handleDataInputChange(input.id, "column", e.target.value)}>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="font-medium">그룹 이름 셀</label>
                  <Input value={input.groupName} onChange={(e) => handleDataInputChange(input.id, "groupName", e.target.value)} placeholder="입력하세요" />
                </div>
                <div>
                  <label className="font-medium">시작 행</label>
                  <Input type="number" value={input.startRow} onChange={(e) => handleDataInputChange(input.id, "startRow", e.target.value)} placeholder="숫자를 입력하세요" />
                </div>
                <div>
                  <label className="font-medium">끝 행</label>
                  <Input type="number" value={input.endRow} onChange={(e) => handleDataInputChange(input.id, "endRow", e.target.value)} placeholder="숫자를 입력하세요" />
                </div>
                {dataInputs.length > 1 && (
                  <Button
                  variant="outline"
                  border="2px"
                  borderColor="red.500"
                  color="red.500"
                  borderRadius="md"
                  _hover={{ bg: "red.50", borderColor: "red.600", color: "red.600" }}
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
              <h1 className="font-bold text-lg text-gray-700 mb-4">가설</h1>
              <RadioGroup onChange={handleInputChange(setHypothesis)} value={hypothesis}>
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
              <h1 className="font-bold text-lg text-gray-700 mb-4">추가 통계</h1>

              {/* Effect Size Type Selection */}
              <div className="mb-5">
                <label className="font-medium text-gray-700">Effect Size Type</label>
                <Select 
                  value={effectSize} 
                  onChange={handleInputChange(setEffectSize)} 
                  className="mt-2 border-gray-300 rounded-md"
                >
                  <option value="Cohens_d">Cohen’s d</option>
                  <option value="Hedges_g">Hedges’ g</option>
                  <option value="Eta_Squared">Eta squared</option>
                  <option value="Partial_Eta_Squared">Partial eta squared</option>
                  <option value="Glasss_Delta">Glass’s delta</option>
                </Select>
              </div>

              {/* 신뢰구간 (Confidence Interval) */}
              <div className="mb-5 flex items-center gap-2">
                <Checkbox
                  isChecked={confidenceInterval !== ""}
                  onChange={() => setConfidenceInterval(confidenceInterval ? "" : "95")} // Default to 95 when checked
                >
                  신뢰구간
                </Checkbox>
                <Input
                  type="number"
                  size="xs"
                  width="2.5rem"
                  textAlign="center"
                  value={confidenceInterval}
                  onChange={(e) => setConfidenceInterval(e.target.value ? parseFloat(e.target.value) : "")} // Converts input to number
                  className="border-gray-300 rounded-md px-2"
                />
                <span className="text-gray-600">%</span>
              </div>
              {/* 기술 통계 (Descriptive Stats) */}
              <div className="mb-5">
                <Checkbox isChecked={descriptiveStats} onChange={toggleCheckbox(setDescriptiveStats)}>
                  기술 통계
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
