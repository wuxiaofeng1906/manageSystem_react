import React from 'react';
import type { IRuleData } from '@/components/IStaticPerformance';
import IStaticPerformance from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '需求统计范围',
    child: [
      '需求创建日期在上周四到本周三',
      '且需求所属执行为‘stage-patch’（执行类型为stagepatch）',
      '不包含同时关联了emergency的需求和项目遗留bug转的需求（需求是bug转换的，且bug的线上bug类型为‘项目遗留’）',
    ],
  },
  {
    title: 'bug统计范围',
    child: [
      'bug创建日期在上周四到本周三',
      '且bug所属执行为‘stage-patch’（执行类型为stagepatch）',
      '且bug关联了stage-patch执行中的需求',
    ],
  },
  {
    title: '代码统计范围',
    child: ['代码量 = 最新stage分支代码量 - 最新matser分支代码量'],
  },
  {
    title: '计算规则',
    child: [
      '灰度千行bug率 = SUM（stage-patch需求加权数+stage-patch加权bug数）/  代码量',
      <p style={{ textIndent: '3em', margin: '5px 0' }}>stage-patch需求加权数;</p>,
      <p style={{ textIndent: '4em', margin: '5px 0' }}>
        新需求：stage-patch需求加权数 = 优先级1*5+优先级2*2+优先级3*1+优先级4*0.1
      </p>,
      <p style={{ textIndent: '4em', margin: '5px 0' }}>
        bug转需求：stage-patch需求加权数 = 取bug的P0*5+P1*2+P2*1+P3*0.1;
      </p>,
      <p style={{ textIndent: '3em', margin: '5px 0' }}>
        stage-patch加权bug数 = P0*5+P1*2+P2*1+P3*0.1;
      </p>,
    ],
  },
];
const GrayScaleBugRate: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.shuttleDelay}
      identity={'DEVELOPER'}
    />
  );
};

export default GrayScaleBugRate;
