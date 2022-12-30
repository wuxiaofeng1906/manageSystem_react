import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
// 效能偏差率
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周月季年统计，执行关闭日期落在哪个周期'],
  },
  {
    title: '统计范围',
    child: [
      '项目计划总工时 = SUM(该项目各任务的预计工时*该任务完成人的职级能力系数）',
      '项目实际总工时 = SUM(该项目各任务消耗工时*该任务的完成人的职级能力系数）',
    ],
  },
  {
    title: '计算公式',
    child: ['开发-效能偏差率 = （1-项目计划总工时/项目实际总工时）*100'],
  },
];
const EfficiencyRate: React.FC<any> = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.patch}
      identity={'DEVELOPER'}
      unit={'%'}
    />
  );
};

export default EfficiencyRate;
