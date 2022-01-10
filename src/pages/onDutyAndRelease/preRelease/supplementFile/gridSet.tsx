const getGridHeight = (gridRowCount: number, moreHigh: boolean = false) => {
  let height = gridRowCount * 25 + 60;
  if (moreHigh) {
    height += 50;
  }

  if (height > 300) {
    return 300;
  }

  return height;
};

export {getGridHeight}
