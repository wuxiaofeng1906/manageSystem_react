import {axiosGet, axiosPost} from "@/publicMethods/axios";

const getSqaByIterName = async (excutId: number) => {
  const result = await axiosGet("/api/verify/zentao/head", {execution_id: excutId});
  return result.sqa;
};

const setBaseLineFor = (baseInfo: any) => {
  const data: any = {
    "guid": "string",
    "user_id": "string",
    "file_name": "string",
    "file_type": "string",
    "execution_name": "string"
  };

  return axiosPost("/api/verify/shimo/save_version", data);

};
export {getSqaByIterName,setBaseLineFor};
