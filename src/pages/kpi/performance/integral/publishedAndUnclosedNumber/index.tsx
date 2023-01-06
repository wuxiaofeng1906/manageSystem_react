import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: ['产品为’1.0产品经理‘和’顾问反馈‘，需求阶段‘已发布’，且需求未删除'],
  },
  {
    title: '计算规则',
    child: ['该周期该部门已发布未关闭需求数 = SUM(该部门所有已发布需求)'],
  },
];
const PublishedAndUnclosedNumber: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.publishedAndUnclosedNumber}
      unit={'个'}
    />
  );
};

export default PublishedAndUnclosedNumber;
