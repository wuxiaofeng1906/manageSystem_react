import {axiosGet} from "@/publicMethods/axios";

const getGridData = () => {

};

// 获取迭代数据
const getIterDetailsData = async (myGuid: any) => {
  const deptData = await axiosGet("/api/verify/shimo/version_detail", {guid: myGuid});

  debugger;
  return [];
};

export {getIterDetailsData};
