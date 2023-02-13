import React from 'react';
import IStaticAgTable, {IRuleData} from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
// 任务计划偏差率
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周月季年统计（任务截止日期落在该周期）'],
  },
  {
    title: '统计范围',
    child: ['研发中心统计特性项目+班车项目+emergency项目，其他部门统计特性项目（执行概况中的项目负责人是哪个研发部门的，该项目就算在哪个研发部门中）'],
  },
  {
    title: '计算公式',
    child: [
      '提测计划偏差率 =Average（各项目的提测计划偏差率）',
      '单个项目的提测计划偏差率 = (实际提测完成日期 - 计划提测截止日期)/(计划提测截止日期 - 开发阶段计划开始日期）*100%'
    ],
  },
];
const PlanDeviationRate: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.planDeviationRate}
      identity={'DEVELOPER'}
      unit={'%'}
      len={2}
    />
  );
};

export default PlanDeviationRate;
