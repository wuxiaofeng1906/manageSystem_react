/* 使用rowSpan合并行之后，需要将显示的数据居中，则需要用到marginTop属性，
 本函数功能是求maginTop的高度。  */
const getRowSpanMarginPosition = (rowSpanCount: number, newline: boolean) => {
  let marginPosition = 0;

  if (newline) {
    if (rowSpanCount % 2 === 0) { // 如果是偶数行
      marginPosition = 16 * (rowSpanCount - 2);
    } else {
      marginPosition = Math.floor(rowSpanCount / 2) * 32
    }
  } else if (rowSpanCount % 2 === 0) { // 如果是偶数行
    marginPosition = 16 * (rowSpanCount - 1);
  } else {
    marginPosition = Math.floor(rowSpanCount / 2) * 32
  }

  return marginPosition;
};

// const cellBorder =
const cellBorderStyle = {
  "border-left": "1px solid lightgrey"
};
export {getRowSpanMarginPosition, cellBorderStyle}
