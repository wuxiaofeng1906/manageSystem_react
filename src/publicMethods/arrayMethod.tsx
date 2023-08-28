// 保留count位小数
const removeElement = (arrays: any, values: string) => {

  const index = arrays.indexOf(values);
  if (index > -1) {
    arrays.splice(index, 1);
  }

  return arrays;
};


const addOrRemoveElement = (arrays: any, values: any) => {

  // for (let index = 0; index < values.length; index += 1) {
  const flag = arrays.indexOf(values);
  if (flag > -1) {
    arrays.splice(flag, 1);
  } else {
    arrays.push(values);
  }
  // }

  return arrays;
};

// 对数组对象进行排序(降序)
const objectArraySortByDesc = (prop: string) => {
  return function (obj1: any, obj2: any) {
    const val1 = obj1[prop];
    const val2 = obj2[prop];
    if (val1 > val2) {
      return -1;
    }
    if (val1 < val2) {
      return 1;
    }
    return 0;
  };
};

// 对数组对象进行排序(升序)
const objectArraySortByAsc = (prop: string) => {

  return function (obj1: any, obj2: any) {
    const val1 = obj1[prop];
    const val2 = obj2[prop];
    if (val1 < val2) {
      return -1;
    }
    if (val1 > val2) {
      return 1;
    }
    return 0;

  };
};




export {removeElement, addOrRemoveElement, objectArraySortByDesc, objectArraySortByAsc};
