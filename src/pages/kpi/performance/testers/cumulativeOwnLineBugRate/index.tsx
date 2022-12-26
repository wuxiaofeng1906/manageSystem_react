import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
// 累计线上千行bug率（含测试）-p0p1占比
const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: ['按周、按月、按季、按年'],
  },
  {
    title: '计算公式',
    child: [
      '按中心：同一级测试部门',
      '按部门：测试-线上P0P1占比 = 该周期该部门所有P0P1的bug数 / 该周期该部门所有线上bug数*100',
      '按人员：测试-线上P0P1占比 = 该周期该人员所有P0P1的bug数 / 该周期该人员所有线上bug数*100',
    ],
  },
];
const CumulativeOwnLineBugRate: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.roundsP0P1TestRate}
      identity={'OWN'}
      period={'period'}
      len={2}
      unit={'%'}
    />
  );
};

export default CumulativeOwnLineBugRate;
