import request from './request';
const SprintDetailServices = {
  async remove(data: any) {
    // 移除
    return request('/api/sprint/project/child/remove', { data, method: 'delete' });
  },
};
export default SprintDetailServices;
