import request from './request';
import { warn } from 'echarts/types/src/util/log';
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
  // 关联值班名单
  async dutyOrder() {
    return request(`${baseUrl}/release/duty`);
  },
  // 发布集群
  async environment() {
    return request(`${baseUrl}/release/environment`);
  },
  // 发布项目
  async project() {
    return request(`${baseUrl}/duty/project`);
  },
  // 分支
  async branch() {
    return request(`${baseUrl}/sonar/branch`);
  },
  //  --------------新改版发布过程--------------
  // 发布列表
  async releaseList() {
    return request(`${baseUrl}/latest-release/list`);
  },
  // 发布列表排序
  async releaseOrder(data: any) {
    return request(`${baseUrl}/latest-release/order-by`, { method: 'post', data });
  },
  // 发布历史
  async historyList(params: any) {
    return request(`${baseUrl}/latest-release/history`, { params });
  },
  // 发布视图数据（版本基准）
  async releaseBaseline() {
    return request(`${baseUrl}/latest-release/views-version-baseline`);
  },
  // 发布视图数据（当天待发版）
  async releaseView() {
    return request(`${baseUrl}/latest-release/views-ready-release`);
  },
  // 删除发布列表（视图）
  async removeRelease(data: any) {
    return request(`${baseUrl}/latest-release/list`, { method: 'delete', data });
  },
  // 删除积压工单项目
  async removeOrder(data: any) {
    return request(`${baseUrl}/latest-release/order-project`, {
      method: 'delete',
      data,
      warn: true,
    });
  },
  // 积压工单【环境】对应的列表数据
  async orderList(cluster: string) {
    return request(`${baseUrl}/latest-release/order-project`, {
      params: { cluster },
    });
  },
  // 运维工单
  async opsList(cluster: string) {
    return request(`${baseUrl}/latest-release/ops-order`, {
      params: { cluster },
    });
  },
  // 保存
  async saveOrder(data: any) {
    return request(`${baseUrl}/latest-release/list`, { method: 'post', data });
  },
  async orderDetail(params: any) {
    return request(`${baseUrl}/latest-release/detail`, { params, warn: false });
  },
};
export default PreReleaseServices;
