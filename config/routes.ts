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
  // {
  //   path: 'login',
  //   layout: false,
  //   name: '用户登录',
  //   component: './'
  // },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './ListTableList',
  },
  {
    name: '开发者',
    icon: 'table',
    path: '/users/list',
    component: './dashboard/developer',
  },
  {
    name: '单元测试覆盖率',
    icon: 'AppstoreOutlined',
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
            icon: 'table',
            path: 'front',
            component: './coverage/byGroup/front',
          },
          {
            name: '后端',
            icon: 'table',
            path: 'backend',
            component: './coverage/byGroup/backend',
          },
        ],
      },
    ],
  }, {
    name: 'sprint工作台',
    icon: 'AppstoreOutlined',
    path: '/sprint',
    routes: [
      {
        name: 'dsahboard',
        icon: 'table',
        path: 'sprintDashboard',
        component: './sprint/sprintDashboard',
      },
      {
        name: 'list',
        icon: 'table',
        path: 'sprintList',
        component: './sprint/sprintList',
      }
    ],
  },
  {
    path: '/',
    redirect: './welcome',
  },
  {
    component: './404',
  },
] as MenuDataItem[];
