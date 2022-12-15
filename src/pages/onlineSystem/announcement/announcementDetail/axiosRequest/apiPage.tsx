import { axiosGet_TJ, axiosPost } from '@/publicMethods/axios';
import { getCurrentUserInfo } from '@/publicMethods/authorityJudge';
import dayjs from 'dayjs';

const users = getCurrentUserInfo();

//根据编号获取公告内容
export const getAnnouncement = async (readyReleaseNum: string, releaseType: string) => {
  const data = {
    announcement_num: readyReleaseNum,
    announcement_time: releaseType,
  };
  const result = await axiosGet_TJ('/api/verify/release/announcement', data);
  return result;
};

// 发送（保存）公告
export const postAnnouncement = async (formData: any, basicInfo: any) => {
  // 需要判断内容是否为空
  const upgradeTime = dayjs(formData.announceTime).format('YYYY-MM-DD HH:mm:ss');
  const data: any = {
    user_name: users.name,
    user_id: users.userid,
    announcement_num: formData.announcement_num,
    upgrade_time: upgradeTime,
    upgrade_description: `${formData.announceDetails_1}${upgradeTime}${formData.announceDetails_2}`,
    is_upgrade: formData.showUpdateDetails === 'true' ? 'yes' : 'no',
    announcement_status: basicInfo.releaseType,
    announcement_time: basicInfo.releaseTime,
    announcement_name: formData.announcement_name,
  };

  if (basicInfo.announceId > 0) {
    data.announcement_id = formData.announcementId;
  }
  return axiosPost('/api/verify/release/announcement', data);
};

// 发送（保存）公告
export const postAnnouncementForOtherPage = async (formData: any) => {
  const data: any = {
    user_name: users.name,
    user_id: users.userid,
    announcement_id: formData.announcement_id,
    // ready_release_num: formData.ready_release_num,
    upgrade_time: formData.upgrade_time,
    upgrade_description: formData.upgrade_description,
    is_upgrade: formData.is_upgrade,
    announcement_status: 'release',
    announcement_time: formData.announcement_time,
    announcement_num: formData.announcement_num,
    announcement_name: formData.announcement_name,
  };
  return axiosPost('/api/verify/release/announcement', data);
};
