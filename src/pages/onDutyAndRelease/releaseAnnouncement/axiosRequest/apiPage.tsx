import {axiosGet_TJ, axiosPost} from "@/publicMethods/axios";
import {getCurrentUserInfo} from "@/publicMethods/authorityJudge";
import dayjs from "dayjs";

const users = getCurrentUserInfo();


//根据编号获取公告内容
export const getAnnouncement = async (readyReleaseNum: string, releaseType: string) => {

  const data = {
    ready_release_num: readyReleaseNum,
    announcement_time: releaseType
  }
  const result = await axiosGet_TJ("/api/verify/release/announcement", data);
  return result;
};

// 发送（保存）公告
export const postAnnouncement = async (formData: any, basicInfo: any) => {

  const upgradeTime = dayjs(formData.announceTime).format("YYYY-MM-DD HH:mm:ss");
  const data: any = {
    "user_name": users.name,
    "user_id": users.userid,
    "ready_release_num": basicInfo.releaseNum,
    "upgrade_time": upgradeTime,
    "upgrade_description": `${formData.announceDetails_1}${upgradeTime}${formData.announceDetails_2}`,
    "is_upgrade": formData.showUpdateDetails === "true" ? "yes" : "no",
    "announcement_status": basicInfo.releaseType,
    "announcement_time": basicInfo.releaseTime
  };

  if (formData.announcementId > 0) {
    data.announcement_id = formData.announcementId;
  }
  return axiosPost("/api/verify/release/announcement", data);
};



