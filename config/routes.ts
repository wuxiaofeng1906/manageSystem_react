﻿// @ts-ignore
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
            name: 'myLogin',
            path: '/user/myLogin',
            component: './user/myLogin',
          },
          // {
          //   name: 'login',
          //   path: '/user/login',
          //   component: './user/login',
          // },
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
    hideInMenu: true,
    routes: [
      {
        name: 'dsahboard',
        path: 'sprintDashboard',
        component: './sprint/sprintDashboard',
      },
      {
        name: 'bug明细（待隐藏）',
        path: 'basicTable/bugs/bug',
        component: './sprint/basicTable/bugs/bug',
      }, {
        name: '无指派bug（待隐藏）',
        path: 'basicTable/bugs/bugs-noAssign',
        component: './sprint/basicTable/bugs/bugs-noAssign',
      }, {
        name: '无排期bug（待隐藏）',
        path: 'basicTable/bugs/bugs-noSchedule',
        component: './sprint/basicTable/bugs/bugs-noSchedule',
      },
      {
        name: '激活bug（待隐藏）',
        path: 'basicTable/bugs/bugs-actived',
        component: './sprint/basicTable/bugs/bugs-actived',
      }, {
        name: '已关闭bug（待隐藏）',
        path: 'basicTable/bugs/bugs-closed',
        component: './sprint/basicTable/bugs/bugs-closed',
      }, {
        name: '已解决bug（待隐藏）',
        path: 'basicTable/bugs/bugs-resolved',
        component: './sprint/basicTable/bugs/bugs-resolved',
      }, {
        name: '已验证bug（待隐藏）',
        path: 'basicTable/bugs/bugs-verified',
        component: './sprint/basicTable/bugs/bugs-verified',
      },
      {
        name: 'story（待隐藏）',
        path: 'basicTable/story',
        component: './sprint/basicTable/stories/story',
      },
      {
        name: 'task（待隐藏）',
        path: 'basicTable/task',
        component: './sprint/basicTable/tasks/task',
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
    name: '研发绩效数据',
    icon: 'table',
    path: '/kpi',
    // access: 'canAdmin|testAccess',
    authority: ['user'],
    routes: [{
      name: '绩效指标',
      icon: 'table',
      path: '/kpi/performance',
      routes: [{
        name: '开发',
        icon: 'table',
        path: '/kpi/performance/developer',
        routes: [
          {
            name: '平均每周代码量',
            icon: 'table',
            path: 'avgCodePerWeek',
            component: './kpi/performance/developer/avgCodePerWeek',
          },
          {
            name: '千行Bug率',
            icon: 'table',
            path: 'thousandBugsRate',
            component: './kpi/performance/developer/thousandBugsRate',
          },
          {
            name: '千行Bug率(不含线上)',
            icon: 'table',
            path: 'thouBugsRateExcludeOnline',
            component: './kpi/performance/developer/thouBugsRateExcludeOnline',
          },
          {
            name: '单元测试覆盖率',
            icon: 'table',
            path: '/kpi/performance/developer/coverage',
            routes: [
              {
                name: '按分支',
                icon: 'table',
                path: '/kpi/performance/developer/coverage/byBranch',
                component: './kpi/performance/developer/coverage/byBranch',
              },
              {
                name: '按组',
                icon: 'table',
                path: '/kpi/performance/developer/coverage/byGroup',
                component: './kpi/performance/developer/coverage/byGroup',
                // routes: [
                //   {
                //     name: '前端',
                //     path: '/kpi/performance/developer/coverage/byGroup/front',
                //     component: './kpi/performance/developer/coverage/byGroup/front',
                //   },
                //   {
                //     name: '后端',
                //     path: '/kpi/performance/developer/coverage/byGroup/backend',
                //     component: './kpi/performance/developer/coverage/byGroup/backend',
                //   },
                // ],
              },
            ],
          },
          {
            name: '提测一次通过率',
            icon: 'table',
            path: 'testPassRateForOnce',
            component: './kpi/performance/developer/testPassRateForOnce',
          },
          {
            name: 'Bug Reopen率',
            icon: 'table',
            path: 'bugReopenRate',
            component: './kpi/performance/developer/bugReopenRate',
          },
          {
            name: 'Code Review',
            icon: 'table',
            path: 'codeReview',
            component: './kpi/performance/developer/codeReview',
          },
          {
            name: 'Bug修复时长',
            icon: 'table',
            path: 'bugRepairTime',
            component: './kpi/performance/developer/bugRepairTime',
          }, {
            name: 'Bug修复率',
            icon: 'table',
            path: 'bugRepairRate',
            component: './kpi/performance/developer/bugRepairRate',
          },
        ]
      }, {
        name: '测试',
        icon: 'table',
        path: '/kpi/performance/testers',
        routes: [
          {
            name: '线上千行bug率',
            icon: 'table',
            path: 'on-lineBugRate',
            component: './kpi/performance/testers/on-lineBugRate',
          },
          {
            name: '线上千行bug率(参考)',
            icon: 'table',
            path: 'on-lineBugRateRefer',
            component: './kpi/performance/testers/on-lineBugRateRefer',
          },
          {
            name: '线上千行bug率(含测试)',
            icon: 'table',
            path: 'on_lineBugIncTester',
            component: './kpi/performance/testers/on_lineBugIncTester',
          },
          {
            name: '用例执行率',
            icon: 'table',
            path: 'exampleCarryRate',
            component: './kpi/performance/testers/exampleCarryRate',
          },
          {
            name: 'bug回归时长',
            icon: 'table',
            path: 'avgBugReturnTime',
            component: './kpi/performance/testers/avgBugReturnTime',
          },
          {
            name: 'bug回归率',
            icon: 'table',
            path: 'bugBugReturnRate',
            component: './kpi/performance/testers/bugBugReturnRate',
          },
          {
            name: '自动化覆盖率',
            icon: 'table',
            path: 'autoTestCover',
            component: './kpi/performance/testers/autoTestCover',
          },
          {
            name: '用例执行量',
            icon: 'table',
            path: 'exampleCarryQuantity',
            component: './kpi/performance/testers/exampleCarryQuantity',
          },
          {
            name: '有效用例率',
            icon: 'table',
            path: 'effectiveExampleRate',
            component: './kpi/performance/testers/effectiveExampleRate',
          }
        ]
      }, {
        name: '产品',
        icon: 'table',
        path: '/kpi/performance/product',
        routes: [
          {
            name: '需求变更率',
            icon: 'table',
            path: 'needsChangeRate',
            component: './kpi/performance/product/needsChangeRate',
          },
          {
            name: '响应顾问平均时长',
            icon: 'table',
            path: 'avgAdviserFeedbackTime',
            component: './kpi/performance/product/avgAdviserFeedbackTime',
          },]
      }]
    }, {
      name: '绩效报告',
      icon: 'table',
      path: 'main',
      hideInMenu: true,
      component: './kpi/perReport/main',
    }, {
      name: '个人绩效报告',
      icon: 'table',
      path: 'reportDetails',
      hideInMenu: true,
      component: './kpi/perReport/reportDetails',
    }
    ]
  },

  {
    path: '/',
    redirect: './welcomes',
  },
  {
    component: './404',
  },
] as MenuDataItem[];
