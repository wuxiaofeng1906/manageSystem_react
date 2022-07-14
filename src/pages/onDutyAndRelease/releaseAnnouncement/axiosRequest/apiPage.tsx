import {axiosGet,axiosGet_TJ, axiosPost} from "@/publicMethods/axios";
import {getCurrentUserInfo} from "@/publicMethods/authorityJudge";

const users = getCurrentUserInfo();


//根据编号获取公告内容
export const getAnnouncement = async (readyReleaseNum: string, releaseType: string) => {
debugger;
  const data = {
    ready_release_num: readyReleaseNum,
    releaseType: releaseType
  }
  const result = await axiosGet_TJ("/api/verify/release/announcement", data);
  return result;
};

// 发送（保存）公告
export const postAnnouncement = async (formData: any, type: string) => {
  const data: any = {
    "user_name": "string",
    "user_id": "string",
    "announcement_id": 0,
    "ready_release_num": "string",
    "upgrade_time": "string",
    "upgrade_description": "string",
    "is_upgrade": "yes",
    "announcement_status": type
  };
  return axiosPost("/api/verify/release/announcement", data);
};



