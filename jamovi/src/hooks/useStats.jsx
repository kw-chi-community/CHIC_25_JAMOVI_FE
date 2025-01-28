import { useEffect } from "react";

/**
 * useStats 훅
 *
 * 폼 상태가 변경될 때마다 백엔드로 데이터를 POST 요청으로 전송합니다.
 *
 * @param {Object} formState - OptionForm의 현재 상태 객체
 * @param {number} debounceDelay - 디바운스 시간 (밀리초 단위, 기본값: 500ms)
 */
const useStats = (formState, debounceDelay = 500) => {
  useEffect(() => {
    // 상태를 적절한 JSON 형식으로 변환하는 함수
    const prepareData = () => ({
      validation: {
        student: formState.studentChecked,
        bayesianCoefficient: formState.bayesChecked,
        prior: formState.bayesChecked ? formState.priorValue : null,
      },
      tests: {
        wilcoxonRank: formState.wilcoxonChecked,
      },
      hypothesis: {
        id: formState.hypothesisValue,
        label:
          formState.hypothesisValue === "1"
            ? "측정 1 ≠ 측정 2"
            : formState.hypothesisValue === "2"
            ? "측정 1 > 측정 2"
            : "측정 1 < 측정 2",
      },
      missingValueHandling: {
        id: formState.missingValue,
        label:
          formState.missingValue === "1"
            ? "대응별 결측값 제거(pairwise)"
            : "목록별 결측값 제거(listwise)",
      },
      additionalStatistics: {
        meanDifference: formState.meanDifferenceChecked,
        confidenceInterval:
          formState.meanDifferenceChecked && formState.confidenceInterval
            ? formState.confidenceInterval
            : null,
        effectSize: formState.effectSizeChecked,
        effectSizeValue:
          formState.effectSizeChecked && formState.effectSize
            ? formState.effectSize
            : null,
        descriptiveStats: formState.descriptiveStatsChecked,
        descriptiveStatsChart: formState.descriptiveStatsChartChecked,
      },
      assumptions: {
        normality: formState.normalityChecked,
        qqPlot: formState.qqPlotChecked,
      },
    });

    const data = prepareData();

    // 디바운스를 적용하여 일정 시간 이후에 POST 요청을 보냄
    const handler = setTimeout(() => {
      // POST 요청을 보낼 함수
      const postData = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/submit-form`,
            {
              // 경로 예시 나중에 바꿔야함
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();
          console.log("데이터가 성공적으로 전송되었습니다:", responseData);
        } catch (error) {
          console.error("데이터 전송 중 오류가 발생했습니다:", error);
        }
      };

      //   postData();
      console.log("postdata test", data); // 연결할 때 지워
    }, debounceDelay);

    // 클린업 함수: 컴포넌트가 언마운트되거나 상태가 변경되기 전에 타이머를 정리
    return () => clearTimeout(handler);
  }, [formState, debounceDelay]);
};

export default useStats;
