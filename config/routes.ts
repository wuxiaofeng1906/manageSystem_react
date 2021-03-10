// @ts-ignore
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
    name: '首页',
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
  // {
  //   name: '开发者',
  //   icon: 'table',
  //   path: '/users/list',
  //   component: './dashboard/developer',
  // },

  {
    name: 'sprint 工作台',
    icon: 'table',
    path: '/sprint',
    routes: [
      {
        name: 'dsahboard',
        path: 'sprintDashboard',
        component: './sprint/sprintDashboard/sprintDashboard',
      },
      {
        name: 'bug明细（待隐藏）',
        path: 'basicTable/bug',
        component: './sprint/basicTable/bug',
      },
      {
        name: 'story（待隐藏）',
        path: 'basicTable/story',
        component: './sprint/basicTable/story',
      },
      {
        name: 'task（待隐藏）',
        path: 'basicTable/task',
        component: './sprint/basicTable/task',
      },
      {
        name: 'sprint 列表',
        path: 'sprintList',
        component: './sprint/sprintList/sprintList',
      },
      {
        name: 'sprint 项目详情',
        path: 'sprintListDetails',
        hideInMenu: true,
        component: './sprint/sprintListDetails/sprintListDetails',
      }
    ],
  },
  {
    name: '绩效数据',
    icon: 'table',
    path: '/performance',
    routes: [{
      name: '开发',
      icon: 'table',
      path: '/performance/developer',
      routes: [{
        name: '单元测试覆盖率',
        icon: 'table',
        path: '/performance/developer/coverage',
        routes: [
          {
            name: '按分支',
            icon: 'table',
            path: '/performance/developer/coverage/byBranch',
            component: './performance/developer/coverage/byBranch',
          },
          {
            name: '按组',
            icon: 'table',
            path: '/performance/developer/coverage/byGroup',
            routes: [
              {
                name: '前端',
                path: '/performance/developer/coverage/byGroup/front',
                component: './performance/developer/coverage/byGroup/front',
              },
              {
                name: '后端',
                path: '/performance/developer/coverage/byGroup/backend',
                component: './performance/developer/coverage/byGroup/backend',
              },
            ],
          },
        ],
      },
        {
          name: 'Code Review',
          icon: 'table',
          path: 'codeReview',
          component: './performance/developer/codeReview',
        }, {
          name: 'Bug解决时长',
          icon: 'table',
          path: 'bugResolutionTime',
          component: './performance/developer/bugResolutionTime',
        }, {
          name: 'Bug Reopen率',
          icon: 'table',
          path: 'bugReopenRate',
          component: './performance/developer/bugReopenRate',
        }, {
          name: '千行Bug率',
          icon: 'table',
          path: 'thousandBugsRate',
          component: './performance/developer/thousandBugsRate',
        },
      ]
    }, {
      name: '测试',
      icon: 'table',
      path: '/performance/tester',
      routes: []
    },]
  },

  {
    path: '/',
    redirect: './welcomes',
  },
  {
    component: './404',
  },
] as MenuDataItem[];
