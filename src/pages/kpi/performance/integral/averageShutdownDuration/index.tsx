import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: [
      '产品为’1.0产品经理‘和’顾问反馈‘，需求状态‘已关闭’，且需求关闭前阶段为’已发布‘，且需求未删除',
    ],
  },
  {
    title: '计算规则',
    child: [
      '单个需求关闭时长 = 需求最后一次关闭时间 - 关闭前最新的发布时间',
      '该周期该部门已发布需求平均关闭时长 = AVG(该部门所有已关闭需求时长)',
    ],
  },
];
const AverageShutdownDuration: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.averageShutdownDuration}
      unit={'天'}
      len={2}
    />
  );
};

export default AverageShutdownDuration;
