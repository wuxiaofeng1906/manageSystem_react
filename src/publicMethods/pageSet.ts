const getHeight = () => {
  const height = window.innerHeight;
  return height - 220;
};

// 保留count位小数
const customRound = (value: number, count: number) => {
  const rtValue = (value + 0.00000001).toFixed(count);
  return rtValue;
};
export {getHeight, customRound};
