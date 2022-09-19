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
  // 待发布需求列表-预发布项目保存后 弹窗 sprint-type 含有emergency，stage-patch
  async getStoryList(params: any) {
    return request(`${baseUrl}/release/story`, { params });
  },
  // 更新待发布需求列表
  async updateStory(data: any) {
    return request(`${baseUrl}/release/story`, { data, method: 'post', msg: '保存成功' });
  },
  // 获取需求编号
  async getStoryNum(executions_id: string) {
    return request(`${baseUrl}/release/execution_story`, { params: { executions_id } });
  },
  // 获取所属执行
  async getExecutions(ready_release_num: string) {
    return request(`${baseUrl}/release/execution`, { params: { ready_release_num } });
  },
  // 刷新服务
  async refreshService(ready_release_num: string) {
    return request(`${baseUrl}/release/refresh_server`, {
      params: { ready_release_num },
    });
  },
  // 灰度发布失败列表
  async getGrayFailList(params: any) {
    return request(`${baseUrl}/release/gray_failure`, {
      params,
    });
  },
};
export default PreReleaseServices;
