﻿// @ts-ignore
import { MenuDataItem } from '@@/plugin-layout/runtime';
import { ProjectKpiRoute } from './routes-tj';

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
  //   access: 'asd',
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
    name: '班车工作台',
    icon: 'table',
    path: '/sprint',
    routes: [
      {
        name: 'dashboard（开发中）',
        path: 'sprintDashboard',
        component: './sprint/sprintDashboard/index',
        access: 'spAdmin',
        hideInMenu: true,
      },
      {
        name: 'details',
        path: 'details',
        component: './sprint/sprintDashboard/details',
        hideInMenu: true,
      },
      {
        name: 'dt_details',
        path: 'dt_details',
        component: './sprint/sprintDashboard/dt_details',
        hideInMenu: true,
      },
      // {
      //   name: 'bug',
      //   path: 'basicTable/bugs/bugAll',
      //   component: './sprint/basicTable/bugs/bugAll',
      //   hideInMenu: true,
      // },
      // {
      //   name: 'bug明细',
      //   path: 'basicTable/bugs/bugDetails',
      //   component: './sprint/basicTable/bugs/bugDetails',
      //   hideInMenu: true,
      // },
      // {
      //   name: 'story',
      //   path: 'basicTable/stories/storyAll',
      //   component: './sprint/basicTable/stories/storyAll',
      //   hideInMenu: true,
      // },
      // {
      //   name: 'story明细',
      //   path: 'basicTable/stories/storyDetails',
      //   component: './sprint/basicTable/stories/storyDetails',
      //   hideInMenu: true,
      // },
      // {
      //   name: 'task',
      //   path: 'basicTable/tasks/taskAll',
      //   component: './sprint/basicTable/tasks/taskAll',
      //   hideInMenu: true,
      // },
      // {
      //   name: 'task明细',
      //   path: 'basicTable/tasks/taskDetails',
      //   component: './sprint/basicTable/tasks/taskDetails',
      //   hideInMenu: true,
      // },
      {
        name: '项目列表',
        path: 'sprintList',
        component: './sprint/sprintList/sprintList',
      },
      {
        name: '项目详情',
        path: 'sprintListDetails',
        hideInMenu: true,
        component: './sprint/sprintListDetails/sprintListDetails',
      },
    ],
  },
  {
    name: '研发过程数据',
    access: 'devCenter', // 仅研发中心人员可见，客服不可见
    icon: 'table',
    path: '/kpi',
    routes: [
      {
        name: '度量指标',
        icon: 'table',
        path: '/kpi/performance',
        routes: [
          {
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
                    name: '按仓库',
                    icon: 'table',
                    path: '/kpi/performance/developer/coverage/byStorehouse',
                    component: './kpi/performance/developer/coverage/byStorehouse',
                  },
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
              },
              {
                name: 'Bug修复率',
                icon: 'table',
                path: 'bugRepairRate',
                component: './kpi/performance/developer/bugRepairRate',
              },
              {
                name: '开发缺陷排除率',
                icon: 'table',
                path: 'defectExclusionRate',
                component: './kpi/performance/developer/defectExclusionRate',
              },
              {
                name: '项目计划偏差率',
                icon: 'table',
                path: 'projectPlanDeviationRate',
                component: './kpi/performance/developer/projectPlanDeviationRate',
              },
              {
                name: '管理事务计划偏差率',
                icon: 'table',
                path: 'manWorkPlanDevRate',
                component: './kpi/performance/developer/manWorkPlanDevRate',
              },
              {
                name: '提测计划偏差率',
                icon: 'table',
                path: 'devShowTestPlanDeviationRate',
                component: './kpi/performance/developer/devShowTestPlanDeviationRate',
              },
            ],
          },
          {
            name: '测试',
            icon: 'table',
            path: '/kpi/performance/testers',
            routes: [
              // {
              //   name: '线上千行bug率',
              //   icon: 'table',
              //   path: 'on-lineBugRate',
              //   component: './kpi/performance/testers/on-lineBugRate',
              // },
              {
                name: '线上千行bug率',
                icon: 'table',
                path: 'on-lineBugRate-new',
                component: './kpi/performance/testers/on-lineBugRate-new',
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
                path: 'bugReturnRate',
                component: './kpi/performance/testers/bugReturnRate',
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
              },
              {
                name: '千行bug率收敛',
                icon: 'table',
                path: 'bugRateConvergency',
                component: './kpi/performance/testers/bugRateConvergency',
                // hideInMenu: true,
              },
              {
                name: '测试计划偏差率',
                icon: 'table',
                path: 'palnDeviationRate',
                component: './kpi/performance/testers/palnDeviationRate',
                // hideInMenu: true,
              },
            ],
          },
          {
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
              },
            ],
          },
          ...ProjectKpiRoute,
          {
            name: '服务',
            icon: 'table',
            path: '/kpi/performance/service',
            routes: [
              {
                name: '线上问题平均上线时长',
                icon: 'table',
                path: 'avgLaunchTime',
                component: './kpi/performance/service/avgLaunchTime',
              },
              {
                name: '线上问题平均立项时长',
                icon: 'table',
                path: 'avgEstablishTime',
                component: './kpi/performance/service/avgEstablishTime',
              },
            ],
          },
        ],
      },
      {
        name: '绩效报告',
        icon: 'table',
        path: 'main',
        hideInMenu: true,
        component: './kpi/perReport/main',
      },
      {
        name: '个人绩效报告',
        icon: 'table',
        path: 'reportDetails',
        hideInMenu: true,
        component: './kpi/perReport/reportDetails',
      },
      {
        name: '数据分析',
        icon: 'table',
        path: '/kpi/analysis',
        access: 'frontManager',
        routes: [
          {
            name: '代码贡献',
            icon: 'table',
            path: 'code',
            access: 'sysAdmin',
            component: './kpi/analysis/code',
          },
          {
            name: '前端 Dashboard',
            icon: 'table',
            path: 'front_dashboard',
            component: './kpi/analysis/front_dashboard',
            access: 'frontManager',
          },
          {
            name: 'bug',
            icon: 'table',
            path: 'bug',
            component: './kpi/analysis/front_dashboard/details/bug',
            hideInMenu: true,
          },
          {
            name: 'story',
            icon: 'table',
            path: 'story',
            component: './kpi/analysis/front_dashboard/details/story',
            hideInMenu: true,
          },
          {
            name: 'task',
            icon: 'table',
            path: 'task',
            component: './kpi/analysis/front_dashboard/details/task',
            hideInMenu: true,
          },
          {
            name: 'codes',
            icon: 'table',
            path: 'codes',
            component: './kpi/analysis/front_dashboard/details/codes',
            hideInMenu: true,
          },
          {
            name: 'Bug解决速能',
            icon: 'table',
            path: 'bugResolutionSpeed',
            component: './kpi/analysis/bugResolutionSpeed',
            access: 'sysAdmin',
          },
        ],
      },
    ],
  },
  {
    name: '工具入口',
    icon: 'table',
    path: 'toolIntegration',
    component: './toolIntegration',
    access: 'devCenter', // 仅研发中心人员可见，客服不可见
  },
  {
    name: '检查工具',
    icon: 'table',
    path: '/checkTools',
    routes: [
      {
        name: '上线前检查',
        path: 'checkBeforeOnline',
        access: 'onlineCheck',
        component: './checkTools/checkBeforeOnline',
      },
      {
        name: 'sonar扫描',
        path: 'sonar',
        access: 'sonarCheck',
        component: './checkTools/sonar',
      },
    ],
  },
  {
    name: '企业微信审批流',
    icon: 'table',
    path: '/approvalFlow',
    // access: 'sysAdmin',
    // hideInMenu: true,
    component: './approvalFlow',
    access: 'devCenter', // 仅研发中心人员可见，客服不可见
  },
  {
    name: '值班与发布',
    icon: 'table',
    path: '/onDutyAndRelease',
    access: 'devCenter', // 仅研发中心人员可见，客服不可见
    routes: [
      {
        name: '值班计划',
        icon: 'table',
        path: 'dutyPlan',
        component: './onDutyAndRelease/dutyPlan',
      },
      {
        name: '值班列表',
        icon: 'table',
        path: 'dutyList',
        // access: 'dutyManager',
        component: './onDutyAndRelease/dutyDirectory/dutyList',
      },
      {
        name: '值班名单',
        icon: 'table',
        path: 'dutyCatalog/:id',
        hideInMenu: true,
        // access: 'dutyManager',
        component: './onDutyAndRelease/dutyDirectory/dutyCatalog',
      },
      {
        name: '发布过程',
        icon: 'table',
        path: 'preRelease',
        component: './onDutyAndRelease/preRelease',
      },
      {
        name: '发布历史',
        icon: 'table',
        path: 'releaseHistory',
        component: './onDutyAndRelease/releaseHistory',
      },
    ],
  },
  {
    name: '禅道管理',
    icon: 'table',
    path: '/zentao',
    // hideInMenu: true,
    routes: [
      {
        name: '人员执行设置',
        icon: 'table',
        path: 'peopleExcuteSetting',
        component: './zentao/peopleExcuteSetting',
        access: 'sysAdmin', // 管理员可见
      },
      {
        name: '禅道模板',
        icon: 'table',
        path: 'templateList',
        component: './zentao/zentaoTemplate/templateList',
        access: 'sysAdmin', // 管理员可见
      },
      {
        name: '禅道任务模板',
        icon: 'table',
        path: 'editTemplate',
        component: './zentao/zentaoTemplate/editTemplate',
        hideInMenu: true,
      },
      {
        name: '禅道任务生成（上线检查）',
        icon: 'table',
        path: 'btForCheckBeforeOnline',
        component: './zentao/zentaoTemplate/btForCheckBeforeOnline',
        hideInMenu: true,
      },
      {
        name: '禅道任务生成（项目计划）',
        icon: 'table',
        path: 'btForProjectTemplate',
        component: './zentao/zentaoTemplate/btForProjectTemplate',
        hideInMenu: true,
      },
      {
        name: '禅道任务分解',
        icon: 'table',
        path: 'taskDecomposition',
        component: './zentao/taskDecomposition',
        access: 'devCenter', // 研发中心可见
        // hideInMenu: true
      },
    ],
  },
  {
    name: '石墨管理',
    icon: 'table',
    path: '/shimo',
    hideInMenu: false,
    access: 'devCenter', // 仅研发中心人员可见，客服不可见，
    routes: [
      {
        name: '文档基线',
        icon: 'table',
        path: 'fileBaseline',
        routes: [
          {
            name: '迭代列表',
            icon: 'table',
            path: 'iterateList',
            component: './shimo/fileBaseline/iterateList',
          },
          {
            name: '基线详情',
            icon: 'table',
            path: 'baselineDetails',
            component: './shimo/fileBaseline/baselineDetails',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    name: '系统管理',
    icon: 'table',
    path: '/authority',
    access: 'sysAdmin',
    routes: [
      {
        name: '权限管理',
        path: 'main',
        component: './authority/system/main',
      },
      {
        name: '权限明细',
        path: 'autority_details',
        component: './authority/system/autority_details',
        hideInMenu: true,
      },
      {
        name: '成员明细',
        path: 'user',
        component: './authority/system/user',
        hideInMenu: true,
      },
      {
        name: '日志查询',
        path: 'logs',
        component: './log',
      },
    ],
  },
  {
    name: '上线系统',
    icon: 'table',
    path: '/systemOnline',
    // hideInMenu: true,
    routes: [
      {
        name: '发布列表',
        icon: 'table',
        path: 'publishList',
        component: './systemOnline/publishList',
      },
      {
        name: '预发布',
        icon: 'table',
        path: 'prePublish',
        component: './systemOnline/prePublish/layout',
        hideChildrenInMenu: true,
        hideInMenu: true,
        routes: [
          {
            path: 'projectServices',
            component: './systemOnline/prePublish/projectServices',
          },
          {
            path: 'deploy',
            component: './systemOnline/prePublish/deploy',
          },
          {
            path: 'duty',
            component: './systemOnline/prePublish/duty',
          },
          {
            path: 'check',
            component: './systemOnline/prePublish/check',
          },
          {
            path: 'publish',
            component: './systemOnline/prePublish/publish',
          },
          {
            path: 'overview',
            component: './systemOnline/prePublish/overview',
          },
          {
            path: 'worksheet',
            component: './systemOnline/prePublish/worksheet',
          },
          {
            path: '/',
            redirect: './systemOnline/prePublish/projectServices',
          },
        ],
      },
      {
        name: '前端服务配置',
        icon: 'table',
        path: 'webServicesSetting',
        component: './systemOnline/webServicesSetting',
      },
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
