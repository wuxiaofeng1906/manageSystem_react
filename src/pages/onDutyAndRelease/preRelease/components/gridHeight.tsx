// 获取表格高度
const getGridRowsHeight = (sourceDt: any, moreHigh: boolean = false) => {

  if (!sourceDt) {
    return "100px";
  }
  const gridRowCount = sourceDt.length;
  if (gridRowCount === 0) {
    return "100px";
  }

  let height = gridRowCount * 25 + 50;
  if (moreHigh) {
    height += 100;
  }
  if (height > 300) {
    return "300px";
  }

  return `${height.toString()}px`;
};

export {getGridRowsHeight}
