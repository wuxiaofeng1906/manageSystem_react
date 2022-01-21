const getGridHeight = (gridRowCount: number, moreHigh: boolean = false) => {
  if (gridRowCount === 0) {
    return 100;
  }
  let height = gridRowCount * 25 + 50;
  if (moreHigh) {
    height += 100;
  }

  if (height > 300) {
    return 300;
  }

  return height;
};

export {getGridHeight}
