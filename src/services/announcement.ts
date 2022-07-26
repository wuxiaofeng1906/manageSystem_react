import request from './request';
const baseUrl = '/api/verify';
// 发布过程
const AnnouncementServices = {
  // 公告列表
  async announcementList(params: any) {
    return request(`${baseUrl}/release/announcement_list`, { params });
  },

  // 删除
  async deleteAnnouncement(announcement_num: string) {
    return request(`${baseUrl}/release/announcement`, {
      data: { announcement_num },
      method: 'delete',
      msg: '删除成功！',
    });
  },
};
export default AnnouncementServices;
