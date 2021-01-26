import {MenuDataItem} from '@@/plugin-layout/runtime';

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcomes',
    name: '欢迎使用',
    icon: 'smile',
    component: './welcomes',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './ListTableList',
  // },
  {
    name: '开发者',
    icon: 'table',
    path: '/users/list',
    component: './dashboard/developer',
  },
  {
    name: '单元测试覆盖率',
    icon: 'table',
    path: '/coverage',
    routes: [
      {
        name: '按分支',
        icon: 'table',
        path: 'byBranch',
        component: './coverage/byBranch',
      },
      {
        name: '按组',
        icon: 'table',
        path: 'byGroup',
        routes: [
          {
            name: '前端',
            path: 'front',
            component: './coverage/byGroup/front',
          },
          {
            name: '后端',
            path: 'backend',
            component: './coverage/byGroup/backend',
          },
        ],
      },
    ],
  }, {
    name: 'sprint工作台',
    icon: 'table',
    path: '/sprint',
    routes: [
      {
        name: 'dsahboard',
        path: 'sprintDashboard',
        component: './sprint/sprintDashboard',
      },
      {
        name: 'list',
        path: 'sprintList',
        component: './sprint/sprintList',
      }
    ],
  },
  {
    path: '/',
    redirect: './welcomes',
  },
  {
    component: './404',
  },
] as MenuDataItem[];
