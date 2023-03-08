import {axiosGet_TJ, axiosPost, axiosDelete} from '@/publicMethods/axios';

// 获取公告列表
export const getAnnounceList = async (page: number, size: number, createdUser: any, createdTime: string, description: string) => {

  const params = {page, size, createdUser, createdTime, description}
  const result = await axiosGet_TJ('/api/77hub/notice/list', params);

  const data: any = [];
  if ((result.results) && (result.results).length) {
    (result.results).map((v: any) => {
      data.push({
        ...v,
        create_user: v.createdUser?.uname,
        create_time: v.createdUser?.timestamp,
        modified_user: v.modifiedUser?.uname,
        modified_time: v.modifiedUser?.timestamp,
      })

    });
  }

  return {
    results: data,
    page: page || 1,
    page_size: size || 20,
    total: result.count || 0,
  };
}

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


// 删除公告
export const deleteList = (id: any) => {
  return axiosDelete(`/api/77hub/notice/${id}`, {});
  // return axiosDelete(`/api/77hub/notice`, {data: {id: id}});
};
