/*
 * @Description: 定义路由 => JieTan
 * @Author: jieTan
 * @Date: 2021-11-19 16:36:02
 * @LastEditTime: 2021-11-19 17:44:38
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
};

export const ProjectKpiRoute: RouteType = {
  name: '项目度量',
  path: './kpi/project',
  //   component: '',
  routes: [
    {
      name: '过程质量',
      path: './kpi/project/quality',
      component: './kpi/forProject/ProcessQuality',
    },
  ],
};
