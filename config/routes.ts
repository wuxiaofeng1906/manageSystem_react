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
          name: 'Bug修复时长',
          icon: 'table',
          path: 'bugResolutionTime',
          component: './performance/developer/bugResolutionTime',
        }, {
          name: 'Bug Reopen率',
          icon: 'table',
          path: 'bugReopenRate',
          component: './performance/developer/bugReopenRate',
        }, {
          name: '平均每周代码量',
          icon: 'table',
          path: 'avgCodePerWeek',
          component: './performance/developer/avgCodePerWeek',
        }, {
          name: '千行Bug率',
          icon: 'table',
          path: 'thousandBugsRate',
          component: './performance/developer/thousandBugsRate',
        }, {
          name: '提测一次通过率',
          icon: 'table',
          path: 'testPassRateForOnce',
          component: './performance/developer/testPassRateForOnce',
        },
      ]
    }, {
      name: '测试',
      icon: 'table',
      path: '/performance/testers',
      routes: [{
        name: '线上千行Bug率',
        icon: 'table',
        path: 'on-lineBugRate',
        component: './performance/testers/on-lineBugRate',
      }, {
        name: '线上千行Bug率(参考)',
        icon: 'table',
        path: 'on-lineBugRateRefer',
        component: './performance/testers/on-lineBugRateRefer',
      }, {
        name: '用例执行率',
        icon: 'table',
        path: 'examCarryRate',
        component: './performance/testers/examCarryRate',
      }, {
        name: 'bug回归时长',
        icon: 'table',
        path: 'avgBugReturnDurtion',
        component: './performance/testers/avgBugReturnDur',
      }]
    }, {
      name: '产品',
      icon: 'table',
      path: '/performance/product',
      routes: [{
        name: '需求变更率',
        icon: 'table',
        path: 'needsChangeRate',
        component: './performance/product/needsChangeRate',
      }, {
        name: '响应顾问平均时长',
        icon: 'table',
        path: 'avgAdviserFeedbackTime',
        component: './performance/product/avgAdviserFeedbackTime',
      },]
    }]
  },

  {
    path: '/',
    redirect: './welcomes',
  },
  {
    component: './404',
  },
] as MenuDataItem[];
