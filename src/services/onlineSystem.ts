import request from './request';
import { GqlClient } from '@/hooks';
const baseUrl = '/api/verify';
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
  // 禅道-需求任务bug
  async getZentaoList(params: any) {
    return request(`${baseUrl}/online/zt-data`, { params });
  },
  // 禅道-测试单
  // async getTestOrderList(params: any) {
  //   return request(`${baseUrl}/online/test-case`, { params });
  // },
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
    return request(`${baseUrl}/online/project-app`, { data, method: 'delete', msg: '移除成功' });
  },
  // 封板、解除封板
  async updateServerApp(data: any) {
    return request(`${baseUrl}/online/sealing-version`, {
      data,
      method: 'post',
      msg: `批量${data.is_seal ? '' : '解除'}封板成功`,
    });
  },
  // 封版检查【测试用例是否通过】
  async sealingCheck(params: any) {
    return request(`${baseUrl}/online/sealing-confirm`, {
      params,
      warn: '当前测试用例未通过，不能进行封板！',
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
