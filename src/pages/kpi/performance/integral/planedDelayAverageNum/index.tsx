import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: [
      '产品为‘1.0产品经理’',
      '执行计划页面的项目计划 zt_executionplan表',
      '计划状态为‘草稿’或‘激活’或‘已变更’，且计划结束时间<当天，取计划的指派给',
      '或计划状态为‘已完成’，取计划的指派给；',
    ],
  },
  {
    title: '计算公式',
    child: [
      '单项计划的累计延期次数 = 该计划延期的工作日天数 + 该计划的历史记录‘计划结束’的累计修改延期次数（取把日期改大的，改小的不算）',
    ],
  },
  {
    title: '按计划结束统计周期',
    child: [],
  },
];
const PlanedDelayAverageNum: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.planedDelayAverageNum}
      unit={'次'}
      len={2}
    />
  );
};

export default PlanedDelayAverageNum;
