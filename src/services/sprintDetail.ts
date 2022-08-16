import request from './request';
const SprintDetailServices = {
  // 记录标识
  async removeTag(data: any) {
    return request('/api/sprint/project/child/remove', { data, method: 'put' }, false);
  },
  // 移除
  async remove(data: any) {
    return request('/api/sprint/project/child/remove', { data, method: 'delete' }, false);
  },
  // 获取最近的班车
  async getNextSprint(params: any) {
    return request('/api/sprint/project', { params });
  },
};
export default SprintDetailServices;
