import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: [
      '班车工作台项目详情中出现未关联需求的bug数（bug关联班车执行30分钟内尚未关联需求或转为需求），且bug未删除',
    ],
  },
  {
    title: '计算规则',
    child: ['该周期该部门超范围bug数 = SUM(该部门所有超范围bug数)'],
  },
];
const SprintOverRangeBug: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.sprintOverRangeBug}
      unit={'个'}
    />
  );
};

export default SprintOverRangeBug;
