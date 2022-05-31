import request from './request';
const baseUrl ='/api/verify/online';

const OnlineServices = {
  // 发布类型
  async releaseType() {
    return request(`${baseUrl}/release_type`);
  },
  // 发布项目
  async releasePro() {
    return request('/api/verify/sprint/execution');
  },
  // 发布方式
  async releaseMethod() {
    return request(`${baseUrl}/release_method`);
  },
  // 发布分支
  async releaseBranch() {
    return request(`${baseUrl}/branch`);
  },
  // 前端应用
  async frontApp() {
    return request(`${baseUrl}/front_app`);
  },
  // 发布列表
  async releaseList(params: any) {
    return request(`${baseUrl}/release_list`,{params});
  },
  // 获取发布编号
  async getReleaseNum() {
    return request(`${baseUrl}/release_num`);
  },
  // 发布栏目
  async releaseColumn(data: any) {
    return request(`${baseUrl}/column`,{method:'post',data});
  },

  // 项目&服务数据
  async proDetail(release_num: string) {
    return request(`${baseUrl}/pro_detail`,{ params: {release_num} });
  },
  // 预发布分支和环境填写
  async updatePreProject(data: any) {
    return request(`${baseUrl}/project`,{method:'post',data});
  },
  
  // 更新发布服务
  async updatePublishServer(data: any) {
    return request(`${baseUrl}/server`,{method:'put',data});
  },

  // 升级接口排序
  async preInterfaceSort(data: any) {
    return request(`${baseUrl}/interface`,{method:'post',data});
  },
  // 更新升级接口
  async updatePreInterface(data: any) {
    return request(`${baseUrl}/interface`,{method:'put',data});
  },

  // 项目关联服务列表【前端服务配置】
  async projectServerList(params: any) {
    return request(`${baseUrl}/project_server`,{params});
  },
  async addProjectServer(data: any) {
    return request(`${baseUrl}/project_server`,{method:'post',data});
  },
  async removeProjectServer(data: {user_id: string,pro_server_id: number}) {
    return request(`${baseUrl}/project_server`,{method:'delete',data});
  },

  // 部署服务列表
  async deployList(release_num: string) {
    return request(`${baseUrl}/deployment`,{params: {release_num}});
  },
   // 部署服务参数设置
   async updateDeploySetting(data: any) {
    return request(`${baseUrl}/deployment`,{method:'post',data});
  },
   // 服务列表
   async deployServer(params: any) {
    return request(`${baseUrl}/deployment_server`,{params});
  },
   // 点击部署
   async deployConfirm(data: any) {
    return request(`${baseUrl}/deployment_server`,{method:'post',data});
  },
   // 获取部署参数
   async getDeploySetting(release_env: string) {
    return request(`${baseUrl}/deployment_param`,{params:{release_env}});
  },
   // 获取分支检查参数
   async getCheckBranchInfo(release_num: string) {
    return request(`${baseUrl}/version_check`,{params:{release_num}});
  },
   // 更新分支检查参数
   async updateCheckBranchInfo(data: any) {
    return request(`${baseUrl}/version_check`,{data, method:'put'});
  },
  
};
export default OnlineServices;
