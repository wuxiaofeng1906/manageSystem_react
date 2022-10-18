import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
// 累计千行bug率（不含线上）
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
        <a href={'https://shimo.im/docs/XKq4MJdn7RfmpBkN#anchor-y5bB'} target={'_blank'}>
          《研发过程数据统计2022年》
        </a>
      </p>,
      '代码统计范围累计到该周期的stage代码量',
    ],
  },
  {
    title: '计算规则',
    child: [
      '累计线上千行bug率 = SUM(累计到该周期的bug加权数) / SUM(累计到该周期的stage代码量）* 1000',
    ],
  },
];
const CumulativeLineBugRateExcludeOnline: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.bugThousPeriodDept}
      identity={'EXCLUDE_ONLINE'}
      len={5}
    />
  );
};

export default CumulativeLineBugRateExcludeOnline;
