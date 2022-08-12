import request from './request';
const baseUrl = '/api/verify';
// 发布过程
const PreReleaseServices = {
  // 上线分支 手动执行状态检查
  async refreshCheckStatus(params: any) {
    return request(`${baseUrl}/release/refresh`, { params, msg: true });
  },
  // 热更新检查
  async hotUpdateCheck(data: any) {
    return request(`${baseUrl}/release/hotupdate`, { data, method: 'put', msg: true });
  },
  // 热更新的发布环境
  async getEnvList() {
    return request(`${baseUrl}/release/hotupdate`);
  },
  // 保存热更新的发布环境
  async saveHotEnv(data: any) {
    return request(`${baseUrl}/release/hotupdate`, { data, method: 'post' });
  },
};
export default PreReleaseServices;
