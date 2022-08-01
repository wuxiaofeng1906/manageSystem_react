import request from './request';
const baseUrl = '/api/verify';
const DutyListServices = {
  // 研发所有人
  // 1：前端 2：后端 3：测试
  async getDevperson(params: any) {
    return request(`${baseUrl}/duty/devperson`, { params });
  },
  async getSQA() {
    return request(`${baseUrl}/duty/person?tech=7`);
  },
  async getProject() {
    return request(`${baseUrl}/duty/project`);
  },
  // 当周值班人
  async getFirstDutyPerson(params: any) {
    return request(`${baseUrl}/duty/plan_data`, { params });
  },
  // 新增编号
  async getDutyNum() {
    return request(`${baseUrl}/release/release_num`);
  },
  // 值班列表
  async getDutyList(params: any) {
    return request(`${baseUrl}/duty/list`, { params });
  },
  // 创建&更新
  async addDuty(data: any) {
    return request(`${baseUrl}/duty/detail`, { data, method: 'post' });
  },
  async getDutyDetail(params: any) {
    return request(`${baseUrl}/duty/detail`, { params });
  },
  // 环境
  async releaseEnv() {
    return request(`${baseUrl}/duty/release_env`);
  },
  // 方式
  async releaseMethod() {
    return request(`${baseUrl}/duty/release_method`);
  },
  // 推送
  async pushWechat(data: any) {
    return request(`${baseUrl}/duty/file`, { data, method: 'post', msg: '推送成功' });
  },
};
export default DutyListServices;
