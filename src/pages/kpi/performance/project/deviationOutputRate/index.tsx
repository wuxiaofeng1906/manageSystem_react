import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
// 产出计划偏差率
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周月季年统计，执行关闭日期落在哪个周期'],
  },
  {
    title: '统计范围',
    child: [
      '项目计划总工时 = SUM(该项目各任务的预计工时*该任务完成人的职级能力系数）',
      '项目自然消耗总工时 = SUM(该项目各任务的实际消耗工时）',
    ],
  },
  {
    title: '计算公式',
    child: ['开发-产出计划偏差率 = （1-项目计划总工时/项目自然消耗总工时）*100'],
  },
];
const DeviationOutputRate: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.patch}
      identity={'DEVELOPER'}
      unit={'%'}
    />
  );
};

export default DeviationOutputRate;
