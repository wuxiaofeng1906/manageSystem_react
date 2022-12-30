import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周、按月、按季、按年统计'],
  },
  {
    title: '计算公式',
    child: [
      '测试-累计千行bug率收敛 = 测试-累计线上千行bug率 / 开发-累计千行bug率（不含线上）',
      '计算时分子分母取对应周期的值，测试部门/开发部门（到部门级，不到具体人员）',
    ],
  },
];
const ConvergenceBugRate: React.FC<any> = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.convergenceBugRate}
      unit={'%'}
      len={2}
    />
  );
};

export default ConvergenceBugRate;
