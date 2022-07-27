import request from './request';
const baseUrl = '/api/verify';
// 发布过程
const AnnouncementServices = {
  // 公告列表
  async announcementList(params: any) {
    return request(`${baseUrl}/release/announcement_list`, { params });
  },
  // 所有人员
  async applicant() {
    return request(`${baseUrl}/apply/applicant`);
  },

  // 删除
  async deleteAnnouncement(data: any) {
    return request(`${baseUrl}/release/announcement`, {
      data,
      method: 'delete',
      msg: '删除成功！',
    });
  },
};
export default AnnouncementServices;
