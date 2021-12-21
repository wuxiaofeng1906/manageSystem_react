/*
 * @Description: 定义路由 => JieTan
 * @Author: jieTan
 * @Date: 2021-11-19 16:36:02
 * @LastEditTime: 2021-12-21 09:56:51
 * @LastEditors: jieTan
 * @LastModify:
 */
type RouteType = {
  name?: string;
  path?: string;
  icon?: string;
  layout?: boolean;
  component?: string;
  exact?: string;
  routes?: RouteType[];
  redirect?: string;
  wrappers?: string;
  title?: string;
  hash?: string;
  hideInMenu?: boolean;
};

export const ProjectKpiRoute: RouteType[] = [
  {
    name: '项目',
    path: './project/overview',
    component: './kpi/forProject/ProjectMetric',
  },
  {
    path: './project/detail',
    component: './kpi/forProject/PorjectKpiDetail',
    hideInMenu: true,
  },
];
