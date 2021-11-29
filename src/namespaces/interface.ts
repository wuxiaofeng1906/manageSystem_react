/*
 * @Description: 通用接口、类型
 * @Author: jieTan
 * @Date: 2021-11-29 15:07:54
 * @LastEditTime: 2021-11-29 15:07:54
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