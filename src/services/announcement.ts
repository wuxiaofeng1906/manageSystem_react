import request from './request';

const baseUrl = '/api/verify';
// 发布过程
const AnnouncementServices = {
  // 公告列表
  async announcementList(params: any) {
    return request(`${baseUrl}/release/announcement_list`, {params});
  },
  // 发布过程 公告列表
  async preAnnouncement() {
    debugger
    return request(`${baseUrl}/release/announcement_name`, {params: {size: 50}});
  },
  // 发布过程 公告关联
  async preReleaseAssociation(data: any) {
    return request(`${baseUrl}/release/ready_announcement_num`, {data, method: 'post'});
  },
  // 发布历史 公告关联
  async releaseHistoryAssociation(data: any) {
    return request(`${baseUrl}/release/release_announcement_num`, {data, method: 'post'});
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
  // 删除验证是否存在关联公告
  async checkDeleteAnnouncement(announcement_num: string) {
    return request(`${baseUrl}/release/release_announcement_num`, {
      params: {announcement_num},
    });
  },
};
export default AnnouncementServices;
