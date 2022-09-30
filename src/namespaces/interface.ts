/*
 * @Description: 通用接口、类型
 * @Author: jieTan
 * @Date: 2021-11-29 15:07:54
 * @LastEditTime: 2021-12-22 09:01:24
 * @LastEditors: jieTan
 * @LastModify:
 */

/* 项目度量指标 */
export interface ProjectQualityResult {
  bugNumber?: string;
  thouslineRatio?: number;
  unitCover?: number;
  reopenRatio?: number;
  bugResolveDura?: number;
  effectiveBugRatio?: number;
  bugFlybackDura?: number;
}
export interface EXTRA_FILTER_TYPE {
  field?: string;
  values?: any[];
}
export interface ProjectKpiInput {
  category: string;
  column: string;
  newValue: any;
  projects: number[];
  modifier?: string;
} // 项目指标cell修改 - 需要传递的参数

/* graphql */
export interface GQL_PARAMS {
  func: string; // gql查询方法
  params?: object; // gql查询方法的参数
}
export type IRecord =Record<string, any>;

export interface PreUpgradeItem {
  pro_id: number;
  project_name: string;
  is_database_upgrade: string;
  is_recovery_database: string;
  is_clear_redis: string;
  is_clear_app_cache: string;
  is_add_front_config: string;
  is_front_data_update: string;
  mark: string;
  manager: string;
  [key: string]: any;
}
export interface PreSql {
  api_id: number;
  cluster_id: string;
  cluster_name: string;
  update_type: string;
  api_server: string;
  tenant: string;
  is_backlog: string;
  [key: string]: any;
}

export interface PreServices {
  server_id: number;
  cluster_id: string;
  app_name: string;
  technical_side: string;
  is_seal: string;
  seal_time: string;
  [key: string]: any;
}