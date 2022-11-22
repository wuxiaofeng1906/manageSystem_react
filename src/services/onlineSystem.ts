import request from './request';
import { GqlClient } from '@/hooks';
const baseUrl = '/api/verify';
export const OnlineSystemServices = {
  async getProjects() {
    return request(`${baseUrl}/duty/project`);
  },
  async getEnvs() {
    return request(`${baseUrl}/release/online_environment`);
  },
  // 上线分支
  async getBranch() {
    return request(`${baseUrl}/sonar/branch`);
  },
  // 上线计划
  async getOnlineList(params: any) {
    return request(`${baseUrl}/online/release-plan`, { params });
  },
  // 禅道-需求任务bug
  async getZentaoList(params: any) {
    return request(`${baseUrl}/online/zt-data`, { params });
  },
  // 禅道-测试单
  async getTestOrderList(params: any) {
    return request(`${baseUrl}/online/test-case`, { params });
  },
  // 发布过程列表
  async getReleaseList(params: any) {
    return request(`${baseUrl}/online/release-list`, { params });
  },
  // 新增发布
  async addRelease(data: any) {
    return request(`${baseUrl}/online/release-list`, { data, method: 'post' });
  },
  // 发布过程单-需求列表
  async getStoryList(params: any) {
    return request(`${baseUrl}/online/release-project-story`, { params });
  },
  // 发布过程单-基础信息
  async getBasicInfo(params: any) {
    return request(`${baseUrl}/online/repair-order-basic`, { params });
  },
  async updateBasicInfo(data: any) {
    return request(`${baseUrl}/online/repair-order-basic`, { data, method: 'post' });
  },
  // 发布过程单-应用服务
  async getServerApp(params: any) {
    return request(`${baseUrl}/online/project-app`, { params });
  },
  async removeServerApp(data: any) {
    return request(`${baseUrl}/online/project-app`, { data, method: 'delete' });
  },
  // 封板、解除封板
  async updateServerApp(data: any) {
    return request(`${baseUrl}/online/sealing-version`, { data, method: 'post' });
  },
  // 发布过程单-升级接口
  async getUpgradeInfo(params: any) {
    return request(`${baseUrl}/online/upgrade-api`, { params });
  },
  async removeUpgradeInfo(data: any) {
    return request(`${baseUrl}/online/upgrade-api`, { data, method: 'delete' });
  },
  // 发布过程单-数据修复
  async getRepairInfo(params: any) {
    return request(`${baseUrl}/online/data-recovery`, { params });
  },
  async removeRepaireInfo(data: any) {
    return request(`${baseUrl}/online/data-recovery`, { data, method: 'delete' });
  },
  // 服务确认
  async getServerConfirm(params: any) {
    return request(`${baseUrl}/online/server-confirm`, { params });
  },
  async updateServerConfirm(data: any) {
    return request(`${baseUrl}/online/server-confirm`, { data, method: 'put' });
  },
  // 检查列表
  async getCheckInfo(params: any) {
    return request(`${baseUrl}/online/check-data`, { params });
  },
  // 检查-参数设置
  async checkSetting(data: any) {
    return request(`${baseUrl}/online/check-param`, { data, method: 'post' });
  },
  // 工单
  async getOrderDetail(params: any) {
    return request(`${baseUrl}/online/rd-repair-order`, { params });
  },

  async getOrgList(client: GqlClient<object>) {
    const { data } = await client.query(`
      {
        data:organization{
          organization{
            id
            name
            parent
            parentName
          }
        }
      }
  `);
    return data.data;
  },
};
