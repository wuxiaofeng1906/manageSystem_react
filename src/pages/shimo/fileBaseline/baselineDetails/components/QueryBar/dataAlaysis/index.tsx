import {axiosGet, axiosPost} from "@/publicMethods/axios";

const getSqaByIterName = async (excutId: number) => {
  const result = await axiosGet("/api/verify/zentao/head", {execution_id: excutId});
  return result.sqa;
};

const setBaseLineFor = (data: any) => {
  return axiosPost("/api/verify/shimo/save_version", data);

};
export {getSqaByIterName, setBaseLineFor};
