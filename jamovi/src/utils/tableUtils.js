/**
 * 셀에 focus했을 때 길이 적당히 조절할 수 있도록 하는 무언가
 * 앱이 살짝 무거워지는 감이 없지않아 있어서 로직 개선이 필요할지도
 * @param {string} text - 길이 측정할 텍스트
 * @param {string} font - 폰트 스타일, 기본적으로 16px Arial
 * @returns {number} 텍스트 너비(픽셀)
 */
export const measureTextWidth = (text, font = "16px Arial") => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width + 20;
};

/**
 * 초기 테이블 데이터 받아오는 무언가
 * @param {number} rows
 * @param {number} cols
 * @returns {Array} 2차원 배열 형태
 */
export const createInitialData = (rows = 100, cols = 20) => {
  return Array(rows)
    .fill()
    .map(() => Array(cols).fill(""));
};
