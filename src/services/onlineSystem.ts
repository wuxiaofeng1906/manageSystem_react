import request from './request';
import { GqlClient } from '@/hooks';
const baseUrl = '/api/verify';
export type ICheckType =
  | 'test-unit' // 单元测试
  | 'icon-check' // 图标一致性
  | 'version-check' // 代码遗漏检查
  | 'hot-update-check' // 热更检查
  | 'create-libray' // 构建时间比较
  | 'env-check' // 环境一致性
  | 'zt-check-list' //特性、班车项目
  | 'preview-sql' //  previewsql
  | 'web-h5-automation' // 自动化检查
  | 'sealing-version-check' // 分支封版
  | 'story-status' // 需求阶段
  | 'auto-check'; // 升级自动化检查

export const OnlineSystemServices = {
  async getProjects() {
    return request(`${baseUrl}/duty/project`);
  },
  // 上线分支
  async getBranch() {
    return request(`${baseUrl}/sonar/branch`);
  },
  // 上线计划
  async getOnlineList(params: any) {
    return request(`${baseUrl}/online/release-plan`, { params });
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
  // 已关联需求项
  async getRelatedStory(params: any) {
    return request(`${baseUrl}/online/story`, { params });
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
    return request(`${baseUrl}/online/project-app`, { data, method: 'delete', msg: '移除成功' });
  },
  // 封版、解除封版
  async updateServerApp(data: any) {
    return request(`${baseUrl}/online/sealing-version`, {
      data,
      method: 'post',
      msg: `批量${data.is_seal ? '' : '解除'}封版成功`,
    });
  },
  // 封版检查【测试用例是否通过】
  async sealingCheck(params: any) {
    return request(`${baseUrl}/online/sealing-confirm`, {
      params,
      warn: false,
    });
  },
  // 发布过程单-升级接口
  async getUpgradeInfo(params: any) {
    return request(`${baseUrl}/online/upgrade-api`, { params });
  },
  async removeUpgradeInfo(data: any) {
    return request(`${baseUrl}/online/upgrade-api`, { data, method: 'delete', msg: '移除成功' });
  },
  // 发布过程单-数据修复
  async getRepairInfo(params: any) {
    return request(`${baseUrl}/online/data-recovery`, { params });
  },
  async removeRepaireInfo(data: any) {
    return request(`${baseUrl}/online/data-recovery`, { data, method: 'delete', msg: '移除成功' });
  },
  async refreshProjectInfo(data: any) {
    return request(`${baseUrl}/online/fresh-data`, { data, method: 'post' });
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
  // 参数设置-详情
  async getCheckSettingDetail(params: any) {
    return request(`${baseUrl}/online/check-param`, { params });
  },

  // 一键执行检查/修改启用状态
  async checkOpts(data: any, type: ICheckType) {
    return request(`${baseUrl}/online/${type}`, { data, method: 'post' });
  },
  // 检查-封版锁定
  async checkSealingLock(data: any) {
    return request(`${baseUrl}/online/sealing-lock`, { data, method: 'post' });
  },
  // 检查-封版锁定检查是否确认和服务封版
  async checkProcess(params: any) {
    return request(`${baseUrl}/online/sealing-lock`, { params });
  },
  // 镜像环境
  async branchEnv(params: any) {
    return request(`${baseUrl}/online/branch-env`, { params, warn: false });
  },

  // 工单
  async getOrderDetail(params: any) {
    return request(`${baseUrl}/online/rd-repair-order`, { params });
  },
  async updateOrderDetail(data: any) {
    return request(`${baseUrl}/online/rd-repair-order`, { data, method: 'post' });
  },
  async removeOrder(data: any) {
    return request(`${baseUrl}/online/rd-repair-order`, { data, method: 'delete' });
  },

  // sql工单
  async sqlOrder() {
    return request(`${baseUrl}/online/sql-order`);
  },
  async deployments(params: any) {
    return request(`${baseUrl}/online/one-deployment-id`, { params });
  },
  // 数据修复读取异常提示
  async abnormalApi(params: any) {
    return request(`${baseUrl}/online/abnormal-api`, { params, warn: false });
  },
  // 获取工单状态
  async getReleaseStatus(params: any) {
    return request(`${baseUrl}/online/release-status`, { params });
  },
  async getLog(params: any) {
    return request(`${baseUrl}/online/options-log`, { params });
  },
  // 获取 global、租户可上的服务
  async getTenantGlobalApps() {
    return request(`${baseUrl}/online/tenant-global`);
  },

  // 应用服务
  async appConfig() {
    return request(`${baseUrl}/online/app-config`);
  },
  async updateAppConfig(data: any) {
    return request(`${baseUrl}/online/app-config`, { data, method: 'post', msg: '更新成功' });
  },
  async removeAppConfig(data: any) {
    return request(`${baseUrl}/online/app-config`, { data, method: 'delete', msg: '删除成功' });
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
  // 禅道测试单列表
  async getTestOrderList(client: GqlClient<object>, params: any) {
    const { data } = await client.query(`
      {
        data:supportForOnlineTesttask(branch:"${params.branch}"){
           execution{
            id
            name
            }
            testtask{
              id
              name
            }
            status{
              en
              zh
            }
            build{
              id
              name
            }
            owner{
              account
              realname
            }
            caseNums
            bugNums
            }
          }
  `);
    return data.data;
  },

  // 禅道任务
  async getOnlineCalendarList(client: GqlClient<object>, params: any) {
    const { data } = await client.query(`
      {
        data:supportForOnlineCalendar(branch:"${params.branch}",force:${params.force}){
        category
        ztNo
        stage{
          orig
          show{
            en
            zh
          }
        }
        execution{
          id
          name
        }
        title
        appservices
        severity
        module{
          id
          name
        }
        openedBy{
          account
          realname
          dept{
            id
            name
            parent{
              id
            }
          }
        }
        assignedTo{
          account
          realname
          dept{
            id
            name
            pinyin
            parent{
              id
            }
          }
        }
      }
    }
  `);
    return data.data;
  },
};
