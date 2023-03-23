import React from 'react';
import IStaticAgTable, {IRuleData} from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
// 计划偏差率需求链接：https://shimo.im/docs/XKq4MJdn7RfmpBkN#anchor-dn7Q 《研发过程数据统计2022-2023年》
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周、按月、按季、按年统计（实际灰度日期落在哪个周期，就算到对应周期）'],
  },
  {
    title: '计算公式',
    child: [
      '测试计划偏差率 =Average（各项目的测试计划偏差率）',
      '单个项目的测试计划偏差率 = (实际灰度日期 - 计划灰度日期)/(计划灰度日期 - 计划系统测试开始日期）*100%'
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
          dept: '测试部',
          projectRange: "特性项目+班车项目+emergency项目",
          instructions: ""
        }, {
          key: '3',
          dept: '平台测试部',
          projectRange: "特性项目",
          instructions: "执行概况中的测试负责人（zt_project.QD）是哪个测试部门的，该项目就算在哪个测试部门中"
        }, {
          key: '4',
          dept: '  收付报销测试部',
          projectRange: "特性项目",
          instructions: ""
        },
        {
          key: '5',
          dept: '财务项目测试部',
          projectRange: "特性项目",
          instructions: ""
        }, {
          key: '6',
          dept: '供应链测试',
          projectRange: "特性项目",
          instructions: ""
        }, {
          key: '7',
          dept: '管理会计测试',
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
              obj.props.rowSpan = 2;
            } else if (index === 2) {
              obj.props.rowSpan = 5;
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
              obj.props.rowSpan = 2;
            } else if (index === 2) {
              obj.props.rowSpan = 5;
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
    title: '实际灰度日期取值',
    child: ['任务类型为‘计划’，且任务名称包含"计划灰度"，且任务状态为‘已完成 或 已关闭’ ，取该任务的‘实际完成日期’（finishedDate）'],
  },
  {
    title: '计划灰度日期取值',
    child: ['取执行概况中的"计划灰度时间"'],
  },
  {
    title: '计划系统测试开始日期取值',
    child: ['任务类型为‘计划’，且任务名称包含"测试阶段计划"，且任务状态为‘已完成 或 已关闭’ ，取该任务的‘预计开始日期’（estStarted）']
  },
  {
    title: '',
    child: [
      '优先查新表zt_executionplan，没有数据再去查计划类任务单个项目的测试计划偏差率直接取新表zt_executionplan中该执行的‘测试阶段计划--基线偏差率’'],
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
