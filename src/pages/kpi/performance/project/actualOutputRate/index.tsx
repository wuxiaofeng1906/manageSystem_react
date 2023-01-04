import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
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
    child: [
      <div style={{ marginTop: 10 }}>
        各阶段自然消耗工时
        <a href={'https://shimo.im/docs/B1Aw1eVreRfZvXqm#anchor-dhHB'}>取值规则</a>
      </div>,
    ],
  },
  {
    title: '',
    child: [
      <div style={{ marginBottom: 10 }}>
        各阶段实际工时
        <a href={'https://shimo.im/sheets/1d3aVdBVEmS6mrqg/MODOC'}>取值规则</a>
      </div>,
    ],
    table: {
      dataSource: [
        { title: 'T1', factor: '0.6' },
        { title: 'T2', factor: '0.8' },
        { title: 'T3', factor: '1.0' },
        { title: 'T4', factor: '1.2' },
        { title: 'T5', factor: '1.4' },
        { title: 'T6', factor: '1.6' },
        { title: 'T7', factor: '1.8' },
        { title: 'T8以上', factor: '2.0' },
      ],
      column: [
        { dataIndex: 'title', title: '职级' },
        { dataIndex: 'factor', title: '能力系数' },
      ],
    },
  },
  {
    title: '计算公式',
    child: [
      '项目实际产出率 = SUM(项目总规模标准工时) / SUM(项目总实际工时) *100',
      '各阶段实际产出率 = SUM(各阶段规模标准工时) / SUM(各阶段实际工时) *100',
      '单个任务的实际工时 = 该任务消耗工时*该任务的完成人的职级能力系数',
      '单个bug的实际工时 = 该bug该人的消耗工时*该解决或关闭人的职级能力系数',
    ],
  },
];

const ActualOutputRate: React.FC<any> = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.actualRate}
      onClick={(p) => {
        console.log(p);
      }}
      normalQuarter={true}
      unit={'%'}
      len={2}
    />
  );
};

export default ActualOutputRate;
