import {axiosGet_TJ, axiosPost, axiosDelete} from '@/publicMethods/axios';
import {getCurrentUserInfo} from '@/publicMethods/authorityJudge';


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


// 一键发布
export const oneKeyToRelease = (id: any) => {
  return axiosPost('/api/77hub/notice/released/', {
    sid: id
  });
};


// 一键发布
export const deleteList = (id: any) => {
  return axiosPost('/api/77hub/notice/', {
    id: id
  });
};
