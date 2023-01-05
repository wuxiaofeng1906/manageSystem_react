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
  // {
  //   path: '/welcomes',
  //   name: '首页',
  //   icon: 'smile',
  //   component: './welcomes',
  // },
  {
    path: '/home',
    name: '首页',
    icon: 'HomeOutlined',
    component: './home',
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
    icon: 'CarOutlined',
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
        wrappers: ['../wrappers/auth'],
      },
      {
        name: '项目详情',
        path: 'sprintListDetails',
        hideInMenu: true,
        component: './sprint/sprintListDetails/sprintListDetails',
        wrappers: ['../wrappers/auth'],
      },
    ],
  },
  {
    name: '值班',
    icon: 'DeploymentUnitOutlined',
    path: '/onDuty',
    routes: [
      {
        name: '值班计划',
        icon: 'table',
        path: 'dutyPlan',
        component: './onDuty/dutyPlan',
        wrappers: ['../wrappers/auth'],
      },
      {
        name: '值班列表',
        icon: 'table',
        path: 'dutyList',
        component: './onDuty/dutyDirectory/dutyList',
        wrappers: ['../wrappers/auth'],
      },
      {
        name: '值班名单',
        icon: 'table',
        path: 'dutyCatalog/:id',
        hideInMenu: true,
        component: './onDuty/dutyDirectory/dutyCatalog',
        wrappers: ['../wrappers/auth'],
      },
    ],
  },
  {
    name: '上线系统',
    icon: 'CodeSandboxOutlined',
    path: '/onlineSystem',
    access: 'devCenter', // 仅研发中心人员可见，客服不可见
    routes: [
      {
        name: '发布过程', // 旧版本
        path: 'preRelease',
        component: './onlineSystem/preRelease',
        hideInMenu: true,
        wrappers: ['../wrappers/auth'],
      },
      {
        name: '发布过程', // 新版本
        path: 'releaseProcess',
        component: './onlineSystem/releaseProcess/index',
        wrappers: ['../wrappers/auth'],
      },
      {
        name: '灰度推生产', // 新版本积压工单
        path: 'releaseOrder/:id',
        hideInMenu: true,
        component: './onlineSystem/releaseProcess/ReleaseOrder',
        wrappers: ['../wrappers/auth'],
      },
      {
        name: '发布历史',
        path: 'releaseHistory',
        component: './onlineSystem/releaseHistory',
        hideInMenu: true,
      },
      {
        name: '正式发布',
        path: 'officialRelease',
        component: './onlineSystem/officialRelease',
        hideInMenu: true,
      },
      {
        name: '升级公告',
        path: 'announcementList',
        component: './onlineSystem/announcement/AnnouncementList',
        wrappers: ['../wrappers/auth'],
      },
      {
        name: '升级公告详情',
        path: 'announcementDetail/:id/:type/:status',
        component: './onlineSystem/announcement/announcementDetail',
        hideInMenu: true,
        wrappers: ['../wrappers/auth'],
      },
      // {
      //   name: '上线日历',
      //   path: 'profile/:branch',
      //   component: './onlineSystem/prePublish/profile', // 禅道概况
      //   wrappers: ['../wrappers/auth'],
      //   hideInMenu: true,
      // },
      {
        name: '发布过程单',
        path: 'prePublish/:release_num/:branch',
        component: './onlineSystem/prePublish',
        wrappers: ['../wrappers/auth'],
        hideInMenu: true,
      },
      {
        name: '应用服务',
        path: 'applicationServerConfig',
        component: './onlineSystem/applicationServerConfig',
        wrappers: ['../wrappers/auth'],
      },
    ],
  },
  {
    name: '研发过程数据',
    access: 'devCenter', // 仅研发中心人员可见，客服不可见
    icon: 'FundProjectionScreenOutlined',
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
                // wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '千行Bug率',
                icon: 'table',
                path: 'thousandBugsRate',
                component: './kpi/performance/developer/thousandBugsRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '千行Bug率(不含线上)',
                icon: 'table',
                path: 'thouBugsRateExcludeOnline',
                component: './kpi/performance/developer/thouBugsRateExcludeOnline',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
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
                    wrappers: ['../wrappers/auth'],
                  },
                  {
                    name: '按分支',
                    icon: 'table',
                    path: '/kpi/performance/developer/coverage/byBranch',
                    component: './kpi/performance/developer/coverage/byBranch',
                    wrappers: ['../wrappers/auth'],
                  },
                  {
                    name: '按组',
                    icon: 'table',
                    path: '/kpi/performance/developer/coverage/byGroup',
                    component: './kpi/performance/developer/coverage/byGroup',
                    wrappers: ['../wrappers/auth'],
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
                wrappers: ['../wrappers/auth'],
              },
              {
                name: 'Bug Reopen率',
                icon: 'table',
                path: 'bugReopenRate',
                component: './kpi/performance/developer/bugReopenRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: 'Code Review',
                icon: 'table',
                path: 'codeReview',
                component: './kpi/performance/developer/codeReview',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: 'Bug修复时长',
                icon: 'table',
                path: 'bugRepairTime',
                component: './kpi/performance/developer/bugRepairTime',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: 'Bug修复率',
                icon: 'table',
                path: 'bugRepairRate',
                component: './kpi/performance/developer/bugRepairRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '缺陷排除率',
                icon: 'table',
                path: 'defectExclusionRate',
                component: './kpi/performance/developer/defectExclusionRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '项目计划偏差率',
                icon: 'table',
                path: 'projectPlanDeviationRate',
                component: './kpi/performance/developer/projectPlanDeviationRate',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '管理事务计划偏差率',
                icon: 'table',
                path: 'manWorkPlanDevRate',
                component: './kpi/performance/developer/manWorkPlanDevRate',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '提测计划偏差率',
                icon: 'table',
                path: 'devShowTestPlanDeviationRate',
                component: './kpi/performance/developer/devShowTestPlanDeviationRate',
                // hideInMenu: true,
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '任务计划偏差率',
                icon: 'table',
                path: 'taskScheduleRate',
                component: './kpi/performance/developer/taskScheduleRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: 'A类客户服务投入比',
                icon: 'table',
                path: 'cusInputRate_A',
                component: './kpi/performance/developer/cusInputRate_A',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '用户体验优化投入比',
                icon: 'table',
                path: 'cusExperienceInputRate',
                component: './kpi/performance/developer/cusExperienceInputRate',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '发布引入emergency数',
                icon: 'table',
                path: 'releaseEmergencyCount',
                component: './kpi/performance/developer/releaseEmergencyCount',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '发布引入patch数',
                icon: 'table',
                path: 'patch',
                component: './kpi/performance/developer/patch',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '线上反馈平均响应时长',
                icon: 'table',
                path: 'avgOnlineTimeFeedBack',
                component: './kpi/performance/developer/avgOnlineTimeFeedBack',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '生产规模',
                icon: 'table',
                path: 'productionScale',
                component: './kpi/performance/developer/productionScale',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '生产率',
                icon: 'table',
                path: 'humanEffect',
                component: './kpi/performance/developer/humanEffect',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '班车延期需求数',
                icon: 'table',
                path: 'shuttleDelay',
                component: './kpi/performance/developer/shuttleDelay',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '阻塞次数',
                icon: 'table',
                path: 'blockingTimes',
                component: './kpi/performance/developer/blockingTimes',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '阻塞测试工作量',
                icon: 'table',
                path: 'blockingTestWorkload',
                component: './kpi/performance/developer/blockingTestWorkload',
              },
              {
                name: '千行bug率',
                icon: 'table',
                path: 'cumulativeLineBugRate',
                component: './kpi/performance/developer/cumulativeLineBugRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '千行bug率（不含线上）',
                path: 'cumulativeLineBugRateExcludeOnline',
                component: './kpi/performance/developer/cumulativeLineBugRateExcludeOnline',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '上线后emergency占比',
                path: 'productOnlineEmergencyRate',
                component: './kpi/performance/developer/productOnlineEmergencyRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '实际产出率',
                path: 'actualRate',
                component: './kpi/performance/developer/actualRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true, // 接口未开发
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
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '线上千行bug率(参考)',
                icon: 'table',
                path: 'on-lineBugRateRefer',
                component: './kpi/performance/testers/on-lineBugRateRefer',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '线上千行bug率(含测试)',
                icon: 'table',
                path: 'on_lineBugIncTester',
                component: './kpi/performance/testers/on_lineBugIncTester',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '用例执行率',
                icon: 'table',
                path: 'exampleCarryRate',
                component: './kpi/performance/testers/exampleCarryRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: 'bug回归时长',
                icon: 'table',
                path: 'avgBugReturnTime',
                component: './kpi/performance/testers/avgBugReturnTime',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: 'bug回归率',
                icon: 'table',
                path: 'bugReturnRate',
                component: './kpi/performance/testers/bugReturnRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '自动化覆盖率',
                icon: 'table',
                path: 'autoTestCover',
                component: './kpi/performance/testers/autoTestCover',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '用例执行量',
                icon: 'table',
                path: 'exampleCarryQuantity',
                component: './kpi/performance/testers/exampleCarryQuantity',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '有效用例率',
                icon: 'table',
                path: 'effectiveExampleRate',
                component: './kpi/performance/testers/effectiveExampleRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '千行bug率收敛',
                icon: 'table',
                path: 'bugRateConvergency',
                component: './kpi/performance/testers/bugRateConvergency',
                hideInMenu: true,
              },
              {
                name: '计划偏差率',
                icon: 'table',
                path: 'palnDeviationRate',
                component: './kpi/performance/testers/palnDeviationRate',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '任务计划偏差率',
                icon: 'table',
                path: 'taskScheduleRate',
                component: './kpi/performance/testers/taskScheduleRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: 'A类客户服务投入比',
                icon: 'table',
                path: 'cusInputRate_A',
                component: './kpi/performance/testers/cusInputRate_A',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '用户体验优化投入比',
                icon: 'table',
                path: 'cusExperienceInputRate',
                component: './kpi/performance/testers/cusExperienceInputRate',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '发布引入emergency数',
                icon: 'table',
                path: 'releaseEmergencyCount',
                component: './kpi/performance/testers/releaseEmergencyCount',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '发布引入patch数',
                icon: 'table',
                path: 'patch',
                component: './kpi/performance/testers/patch',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '线上反馈平均响应时长',
                icon: 'table',
                path: 'avgOnlineTimeFeedBack',
                component: './kpi/performance/testers/avgOnlineTimeFeedBack',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '线上反馈平均上线时长',
                icon: 'table',
                path: 'avgTimeOnline',
                component: './kpi/performance/testers/avgTimeOnline',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '生产规模',
                icon: 'table',
                path: 'productionScale',
                component: './kpi/performance/testers/productionScale',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '生产率',
                icon: 'table',
                path: 'humanEffect',
                component: './kpi/performance/testers/humanEffect',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '班车延期需求数',
                icon: 'table',
                path: 'shuttleDelay',
                component: './kpi/performance/testers/shuttleDelay',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '灰度千行bug率',
                icon: 'table',
                path: 'grayScaleBugRate',
                component: './kpi/performance/testers/grayScaleBugRate',
              },
              {
                name: '轮次测试P0+P1占比',
                icon: 'table',
                path: 'roundsTestRate',
                component: './kpi/performance/testers/roundsTestRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '千行bug率收敛', // 实际是累计千行bug率收敛
                icon: 'table',
                path: 'convergenceBugRate',
                component: './kpi/performance/testers/convergenceBugRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '线上千行bug率',
                icon: 'table',
                path: 'cumulativeLineBugRate',
                component: './kpi/performance/testers/cumulativeLineBugRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '线上千行bug率参考',
                icon: 'table',
                path: 'cumulativeLineBugRateReference',
                component: './kpi/performance/testers/cumulativeLineBugRateReference',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '线上千行bug率（含测试）',
                icon: 'table',
                path: 'cumulativeLineBugRateTests',
                component: './kpi/performance/testers/cumulativeLineBugRateTests',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '线上千行bug率P0P1占比',
                path: 'onlineTestThouBugRate',
                component: './kpi/performance/testers/onlineTestThouBugRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '线上千行bug率P0P1占比(参考)',
                path: 'onlineReferThouBugRate',
                component: './kpi/performance/testers/onlineReferThouBugRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '线上千行bug率P0P1占比(含测试)',
                path: 'onlineOwnThouBugRate',
                component: './kpi/performance/testers/onlineOwnThouBugRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '线上千行bug率P0P1占比', // 实际是累计线上bug率p0p1占比
                icon: 'table',
                path: 'cumulativeTestLineBugRate',
                component: './kpi/performance/testers/cumulativeTestLineBugRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '累计线上千行bug率P0P1占比参考',
                path: 'cumulativeReferLineBugRate',
                component: './kpi/performance/testers/cumulativeReferLineBugRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '线上千行bug率P0P1占比（含测试）', // 实际是累计线上bug率p0p1占比（含测试）
                icon: 'table',
                path: 'cumulativeOwnLineBugRate',
                component: './kpi/performance/testers/cumulativeOwnLineBugRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '上线后emergency占比',
                icon: 'table',
                path: 'productOnlineEmergencyRate',
                component: './kpi/performance/testers/productOnlineEmergencyRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '自动化发现bug数',
                icon: 'table',
                path: 'autoDiscoveryBugCount',
                component: './kpi/performance/testers/autoDiscoveryBugCount',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '自动化提效比',
                icon: 'table',
                path: 'autoEffectRate',
                component: './kpi/performance/testers/autoEffectRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '自动化单元测试覆盖率',
                icon: 'table',
                path: 'autoTestCoverageUnit',
                component: './kpi/performance/testers/autoTestCoverageUnit',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '实际产出率',
                path: 'actualRate',
                component: './kpi/performance/testers/actualRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true, // 接口未开发
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
                wrappers: ['../wrappers/auth'],
                hideInMenu: true,
              },
              {
                name: '响应顾问平均时长',
                icon: 'table',
                path: 'avgAdviserFeedbackTime',
                component: './kpi/performance/product/avgAdviserFeedbackTime',
                wrappers: ['../wrappers/auth'],
              },
            ],
          },
          // ...ProjectKpiRoute,
          {
            name: '项目',
            path: '/kpi/performance/project',
            routes: [
              {
                name: '实际产出率',
                path: 'actualOutputRate',
                component: './kpi/performance/project/actualOutputRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '标准产出率',
                path: 'standardOutputRate',
                component: './kpi/performance/project/standardOutputRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true, // 接口未开发
              },
              {
                name: '计划产出率',
                path: 'plannedOutputRate',
                component: './kpi/performance/project/plannedOutputRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true, // 接口未开发
              },
              {
                name: '产出计划偏差率',
                path: 'deviationOutputRate',
                component: './kpi/performance/project/deviationOutputRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true, // 接口未开发
              },
              {
                name: '效能偏差率',
                path: 'efficiencyRate',
                component: './kpi/performance/project/efficiencyRate',
                wrappers: ['../wrappers/auth'],
                hideInMenu: true, // 接口未开发
              },
            ],
          },
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
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '线上问题平均立项时长',
                icon: 'table',
                path: 'avgEstablishTime',
                component: './kpi/performance/service/avgEstablishTime',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '上线后emergency占比',
                icon: 'table',
                path: 'productOnlineEmergencyRate',
                component: './kpi/performance/service/productOnlineEmergencyRate',
                wrappers: ['../wrappers/auth'],
                // hideInMenu: true,
              },
              {
                name: '交付吞吐量',
                icon: 'table',
                path: 'deliveryThroughput',
                component: './kpi/performance/service/deliveryThroughput',
                wrappers: ['../wrappers/auth'],
              },
            ],
          },
          {
            name: '积分',
            path: '/kpi/performance/integral',
            routes: [
              {
                name: '已发布需求平均关闭时长',
                path: 'averageShutdownDuration',
                component: './kpi/performance/integral/averageShutdownDuration',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '已发布未关闭需求数',
                path: 'publishedAndUnclosedNumber',
                component: './kpi/performance/integral/publishedAndUnclosedNumber',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '班车超范围bug数',
                path: 'sprintOverRangeBug',
                component: './kpi/performance/integral/sprintOverRangeBug',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '需求关闭不规范数',
                path: 'closeNormativeRequired',
                component: './kpi/performance/integral/closeNormativeRequired',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '计划平均延期次数',
                path: 'planedDelayAverageNum',
                component: './kpi/performance/integral/planedDelayAverageNum',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '任务平均延期次数',
                path: 'taskCumulativeDelayNum',
                component: './kpi/performance/integral/taskCumulativeDelayNum',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: 'Code Review',
                icon: 'table',
                path: 'codeReview',
                component: './kpi/performance/developer/codeReview',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '缺陷排除率',
                icon: 'table',
                path: 'defectExclusionRate',
                component: './kpi/performance/developer/defectExclusionRate',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '用例执行率',
                icon: 'table',
                path: 'exampleCarryRate',
                component: './kpi/performance/testers/exampleCarryRate',
                wrappers: ['../wrappers/auth'],
              },
            ],
          },
          {
            name: '运维',
            path: '/kpi/performance/operations',
            routes: [
              {
                name: '系统可用/修复时间',
                path: 'systemAvailable',
                component: './kpi/performance/operations/systemAvailable',
                wrappers: ['../wrappers/auth'],
              },
              {
                name: '系统平均响应时间',
                path: 'systemAvgRespTime',
                component: './kpi/performance/operations/systemAvgRespTime',
                wrappers: ['../wrappers/auth'],
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
            wrappers: ['../wrappers/auth'],
          },
          {
            name: '前端 Dashboard',
            icon: 'table',
            path: 'front_dashboard',
            component: './kpi/analysis/front_dashboard',
            access: 'frontManager',
            wrappers: ['../wrappers/auth'],
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
            wrappers: ['../wrappers/auth'],
          },
        ],
      },
    ],
  },
  {
    name: '工具入口',
    icon: 'ToolOutlined',
    path: 'toolIntegration',
    component: './toolIntegration',
    access: 'devCenter', // 仅研发中心人员可见，客服不可见
    wrappers: ['../wrappers/auth'],
  },
  {
    name: '检查工具',
    icon: 'BugOutlined',
    path: '/checkTools',
    routes: [
      {
        name: '上线前检查',
        path: 'checkBeforeOnline',
        access: 'onlineCheck',
        component: './checkTools/checkBeforeOnline',
        wrappers: ['../wrappers/auth'],
      },
      {
        name: 'sonar扫描',
        path: 'sonar',
        access: 'sonarCheck',
        component: './checkTools/sonar',
        wrappers: ['../wrappers/auth'],
      },
    ],
  },
  {
    name: '企业微信审批流',
    icon: 'CommentOutlined',
    path: '/approvalFlow',
    // access: 'sysAdmin',
    // hideInMenu: true,
    component: './approvalFlow',
    access: 'devCenter', // 仅研发中心人员可见，客服不可见
    wrappers: ['../wrappers/auth'],
  },
  {
    name: '禅道管理',
    icon: 'BlockOutlined',
    path: '/zentao',
    // hideInMenu: true,
    routes: [
      {
        name: '人员执行设置',
        icon: 'table',
        path: 'peopleExcuteSetting',
        component: './zentao/peopleExcuteSetting',
        access: 'sysAdmin', // 管理员可见
        wrappers: ['../wrappers/auth'],
      },
      {
        name: '禅道模板',
        icon: 'table',
        path: 'templateList',
        component: './zentao/zentaoTemplate/templateList',
        access: 'sysAdmin', // 管理员可见
        wrappers: ['../wrappers/auth'],
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
        wrappers: ['../wrappers/auth'],
        // hideInMenu: true
      },
    ],
  },
  {
    name: '石墨管理',
    icon: 'BookOutlined',
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
            wrappers: ['../wrappers/auth'],
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
    icon: 'SettingOutlined',
    path: '/authority',
    access: 'sysAdmin',
    routes: [
      {
        name: '权限管理',
        path: 'main',
        component: './authority/system/main',
        wrappers: ['../wrappers/auth'],
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
    path: '/',
    redirect: './home',
  },
  {
    component: './404',
  },
] as MenuDataItem[];
