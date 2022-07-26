import request from './request';
const baseUrl = '/api/verify';
// 发布过程
const announcementServices = {
  // 公告列表
  async announcementList(params: any) {
    return request(`${baseUrl}/release/announcement_list`, { params });
  },
  // 保存 、挂起、新增
  async saveAnnouncement(data: any) {
    return request(`${baseUrl}/release/announcement`, { data, msg: true, method: 'post' });
  },
  // 删除
  async deleteAnnouncement(announcement_num: string) {
    return request(`${baseUrl}/release/announcement`, {
      data: { announcement_num },
      method: 'delete',
    });
  },
  // 公告详情
  async announcementDetail(data: {
    announcement_num: string;
    announcement_time: 'before' | 'after';
  }) {
    return request(`${baseUrl}/release/announcement`, { data });
  },
};
export default announcementServices;
