/*
 * @Description: 通用枚举型
 * @Author: jieTan
 * @Date: 2021-11-23 10:42:47
 * @LastEditTime: 2021-11-29 17:11:14
 * @LastEditors: jieTan
 * @LastModify:
 */

// js中的原声类型 => 未列举完
export enum JS_PROTOTYPE_TYPE {
  Array = '[object Array]',
  Boolean = '[object Boolean]',
  String = '[object String]',
  Function = '[object Function]',
  Date = '[object Date]',
  Object = '[object Object]',
  Number = '[object Number]',
}

/* ag-grid */
export enum TABLE_GROUP_SHOW {
  open = 'open',
  closed = 'closed',
}

/* gql查询方法 */
export enum GRAPHQL_QUERY {
  PROJECT_KPI = 'projectKpi', // 项目度量指标
  ORGANIZATION = 'organization', // 企业微信组织架构
}
