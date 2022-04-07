import {axiosGet} from "@/publicMethods/axios";


// 获取迭代数据
const getIterDetailsData = async (myGuid: any) => {
  const deptData = await axiosGet("api/verify/shimo/version_detail", {guid: myGuid});
  return deptData;
};

export {getIterDetailsData};
