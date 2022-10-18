import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
// 累计线上千行bug率（含测试）
const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: ['按周、按月、按季、按年'],
  },
  {
    title: '统计范围',
    child: [
      <p>
        bug统计范围详见
        <a href={'https://shimo.im/docs/XKq4MJdn7RfmpBkN#anchor-kVTZ'} target={'_blank'}>
          《研发过程数据统计2022年》
        </a>
      </p>,
      '代码统计范围累计到该周期的master代码量',
    ],
  },
  {
    title: '计算规则',
    child: [
      '累计线上千行bug率 = SUM(累计到该周期的线上bug加权数) / SUM(累计到该周期的master代码量）* 1000',
    ],
  },
];
const CumulativeLineBugRateContainTests: React.FC<any> = () => {
  return (
    <IStaticPerformance ruleData={ruleData} request={StatisticServices.patch} identity={'TESTER'} />
  );
};

export default CumulativeLineBugRateContainTests;
