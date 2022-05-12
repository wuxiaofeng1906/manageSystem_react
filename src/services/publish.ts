import request from './request';

const PublishServices = {
  async getZentaoUsers() {
    return request('/api/verify/zentao/users');
  },
  async getList(params: any) {
    return request('/api/verify/duty/plan_data', { params });
  },
};
export default PublishServices;
