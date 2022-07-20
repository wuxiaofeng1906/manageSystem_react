import request from './request';
const baseUrl = '/api/verify';
// 发布过程
const PreReleaseServices = {
  // 上线分支 手动执行状态检查
  async refreshCheckStatus(params: any) {
    return request(`${baseUrl}/release/refresh`, { params, msg: true });
  },
};
export default PreReleaseServices;
