const getGridHeight = (gridRowCount: number) => {
  const height = gridRowCount * 25 + 50;

  if (height > 300) {
    return 300;
  }

  return height;
};

export {getGridHeight}
