import {axiosGet, axiosDelete, axiosPost, axiosPut} from "@/publicMethods/axios"

const getTaskTemplate = async () => {
  const tempData = await axiosGet("/api/verify/sprint/temp_detail");

  const datas: any = [];
  // 默认生成四个模块,新增显示的ID列
  if (tempData && tempData.length) {
    tempData.forEach((ele: any, index: number) => {
      datas.push({
        ...ele,
        No: index + 1
      })
    });
  }

  // 默认显示4大块模块
  let girdData: any = [];
  let index = 1;
  while (index < 5) {
    index += 1;
    girdData = girdData.concat(datas)
  }

  return girdData;
};

export {getTaskTemplate};
