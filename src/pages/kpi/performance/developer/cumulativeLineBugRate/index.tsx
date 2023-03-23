import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
// 累计线上千行bug率
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
        <a href={'https://shimo.im/docs/XKq4MJdn7RfmpBkN#anchor-MjWH'} target={'_blank'}>
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
const CumulativeLineBugRate: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.bugThousPeriodDept}
      identity={'ALL'}
      unit={'个/Kloc'}
      len={2}
    />
  );
};

export default CumulativeLineBugRate;
