import React from 'react';
import IStaticAgTable, {IRuleData} from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
// 累计线上千行bug率 -p0p1占比
const ruleData: IRuleData[] = [
  {
    title: 'bug统计范围',
    child: ['分别参照3个测试-线上千行bug率 和 3个测试-累计千行bug率的bug范围'],
  },
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
const CumulativeTestLineBugRate: React.FC<any> = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.roundsP0P1TestRate}
      identity={'TEST'}
      period={'uptoperiod'}
      len={2}
      unit={'%'}
    />
  );
};

export default CumulativeTestLineBugRate;
