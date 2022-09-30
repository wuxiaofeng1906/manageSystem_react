import React from 'react';
import type { IRuleData } from '@/components/IStaticPerformance';
import IStaticPerformance from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: [
      'bug状态不等于‘激活’',
      '且bug未删除',
      '且bug严重程度为P0/P1',
      '且bug的类型为‘环境部署问题’',
      '或 （bug类型为‘代码-预置数据问题’ 且 解决方案为‘已解决’的）',
      '或bug解决方案为‘环境问题’',
      '或bug解决方案为‘代码未合并’',
      '且bug的解决者是开发的（多次解决的情况，取最后一个打解决的开发）',
    ],
  },
  {
    title: '计算规则',
    child: [
      '按部门：SUM(该周期内该部门开发解决bug数）',
      '按中心：SUM(该周期内所有开发解决的bug数)',
    ],
  },
];
const BlockingTimes: React.FC<any> = () => {
  return <IStaticPerformance ruleData={ruleData} request={StatisticServices.blockingTimes} />;
};

export default BlockingTimes;
