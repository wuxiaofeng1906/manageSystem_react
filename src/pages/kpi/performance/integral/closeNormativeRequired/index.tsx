import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: ['先关闭需求，后关联发布，且关闭需求前没有关联过发布'],
  },
  {
    title: '计算规则',
    child: ['该周期该部门需求关闭不规范数 = SUM(该部门所有关闭不规范的需求)'],
  },
];
const CloseNormativeRequired: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.closeNormativeRequired}
      unit={'个'}
    />
  );
};

export default CloseNormativeRequired;
