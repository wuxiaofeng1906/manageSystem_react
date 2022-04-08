import {axiosGet, axiosPost} from "@/publicMethods/axios";

const getSqaByIterName = async (excutId: number) => {
  const result = await axiosGet("/api/verify/zentao/head", {execution_id: excutId});
  return result.sqa;
};

const setBaseLineFor = (baseInfo: any) => {
  const data: any = {
    "version_id": 0,
    "guid": "string",
    "user_id": "string"
  };

  return axiosPost("/api/verify/shimo/save_version", data);

};
export {getSqaByIterName,setBaseLineFor};
