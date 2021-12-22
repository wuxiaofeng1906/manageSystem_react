/*
 * @Description: 通用接口、类型
 * @Author: jieTan
 * @Date: 2021-11-29 15:07:54
 * @LastEditTime: 2021-12-02 15:22:42
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

/* graphql */
export interface GQL_PARAMS {
  func: string;
  params?: object;
}