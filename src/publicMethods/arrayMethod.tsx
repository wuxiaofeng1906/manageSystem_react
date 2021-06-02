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


export {removeElement, addOrRemoveElement};
