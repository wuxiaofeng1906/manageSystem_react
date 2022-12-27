import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
// 项目实际产出率
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周月季年统计，执行关闭日期落在哪个周期'],
  },
  {
    title: '统计范围',
    child: ['各阶段规模标准预置'],
    table: {
      dataSource: [
        {
          scale: '规模取执行概况中的‘规模’值',
          standard: 5,
          stage: '需求',
          time: '规模*规模标准*8H',
        },
        { scale: '', standard: 5, stage: '概设', time: '5*10*8' },
        { scale: '', standard: 2, stage: '详设', time: '2*10*8' },
        { scale: '', standard: 10, stage: '开发', time: '10*10*8' },
        { scale: '', standard: 12, stage: '测试', time: '12*10*8' },
      ],
      column: [
        {
          dataIndex: 'scale',
          title: '规模',
          render: (v: string) => ({ children: v, props: { rowSpan: v ? 5 : 0 } }),
        },
        { dataIndex: 'standard', title: '规模标准' },
        { dataIndex: 'stage', title: '阶段' },
        { dataIndex: 'time', title: '阶段规模标准工时(H)' },
      ],
    },
  },
  {
    title: '',
    child: ['各阶段计划工时 = SUM(该阶段各任务的预计工时*该任务完成人的职级能力系数）'],
  },
  {
    title: '计算公式',
    child: [
      '项目计划产出率 = SUM(项目总规模标准工时) / SUM(项目总预计工时) *100',
      '各阶段计划产出率 = SUM(各阶段规模标准工时) / SUM(各阶段预计工时) *100',
    ],
  },
];
const PlannedOutputRate: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.patch}
      identity={'DEVELOPER'}
      unit={'%'}
    />
  );
};

export default PlannedOutputRate;
