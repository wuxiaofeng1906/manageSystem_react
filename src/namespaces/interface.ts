/*
 * @Description: 通用接口、类型
 * @Author: jieTan
 * @Date: 2021-11-29 15:07:54
 * @LastEditTime: 2021-12-22 06:34:02
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
  newValue: string;
  project: number;
  modifier?: string;
} // 项目指标cell修改 - 需要传递的参数

/* graphql */
export interface GQL_PARAMS {
  func: string; // gql查询方法
  params?: object; // gql查询方法的参数
}
