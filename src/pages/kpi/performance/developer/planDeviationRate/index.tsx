import React from 'react';
import IStaticAgTable, {IRuleData} from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
// 需求链接：https://shimo.im/docs/XKq4MJdn7RfmpBkN#anchor-Yrw2 《研发过程数据统计2022-2023年》
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周、按月、按季、按年统计（实际提测完成日期落在哪个周期，就算到对应周期）'],
  },
  {
    title: '计算公式',
    child: [
      '提测计划偏差率 =Average（各项目的提测计划偏差率）',
      '单个项目的提测计划偏差率 = (实际提测完成日期 - 计划提测截止日期)/(计划提测截止日期 - 开发阶段计划开始日期）*100%'
    ],
  },
  {
    title: "项目取值范围：",
    child: [],
    table: {
      dataSource: [
        {
          key: '1',
          dept: '研发中心',
          projectRange: "特性项目+班车项目+emergency项目",
          instructions: ""
        },
        {
          key: '2',
          dept: '经营会计研发部',
          projectRange: "特性项目",
          instructions: "执行概况中的项目负责人是哪个研发部门的，该项目就算在哪个研发部门中"
        }, {
          key: '3',
          dept: '收付报销研发部',
          projectRange: "特性项目",
          instructions: ""
        }, {
          key: '4',
          dept: ' 财务项目研发部',
          projectRange: "特性项目",
          instructions: ""
        },
        {
          key: '5',
          dept: '前端平台研发部',
          projectRange: "特性项目",
          instructions: ""
        }, {
          key: '6',
          dept: '后端平台研发部',
          projectRange: "特性项目",
          instructions: ""
        }, {
          key: '7',
          dept: '供应链研发部',
          projectRange: "特性项目",
          instructions: ""
        }, {
          key: '8',
          dept: '管理会计研发部',
          projectRange: "特性项目",
          instructions: ""
        }
      ],
      column: [
        {
          title: '部门',
          dataIndex: 'dept',
          width: 100,
        },
        {
          title: '项目范围',
          dataIndex: 'projectRange',
          render: (value: any, row: any, index: number) => {
            const obj: any = {
              children: value,
              props: {},
            };
            if (index === 0) {
              obj.props.rowSpan = 1;
            } else if (index === 1) {
              obj.props.rowSpan = 7;
            } else {
              obj.props.rowSpan = 0; // 其他行不进行渲染
            }
            return obj;
          }
        },
        {
          title: '补充说明',
          dataIndex: 'instructions',
          render: (value: any, row: any, index: number) => {
            const obj: any = {
              children: value,
              props: {},
            };
            if (index === 0) {
              obj.props.rowSpan = 1;
            } else if (index === 1) {
              obj.props.rowSpan = 7;
            } else {
              obj.props.rowSpan = 0; // 其他行不进行渲染
            }
            return obj;
          }
        }
      ]
    },
  },
  {
    title: '实际提测完成日期取值',
    child: ['任务类型为‘计划’，且任务名称包含"开发提测演示"，且任务状态为‘已完成 或 已关闭’ ，取该任务的‘实际完成日期’（finishedDate）。如果有多个该类型任务，"实际完成日期"取该类任务最后的日期，Max（finishDate）'],
  },
  {
    title: '计划提测截止日期取值',
    child: ['取执行概况中的"计划提测时间"'],
  },
  {
    title: '开发阶段计划开始日期取值',
    child: ['任务类型为‘计划’，且任务名称包含"开发阶段计划"，且任务状态为‘已完成 或 已关闭’ ，取该任务的‘预计开始日期’（estStarted）'],
  },
  {
    title: '',
    child: [
      '优先查新表zt_executionplan，没有数据再去查‘计划’类任务单个项目的开发计划偏差率直接取新表zt_executionplan中该执行的‘开发阶段计划--基线偏差率’'],
  },

];
const PlanDeviationRate: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.planDeviationRate}
      identity={'DEVELOPER'}
      unit={'%'}
      len={2}
    />
  );
};

export default PlanDeviationRate;
