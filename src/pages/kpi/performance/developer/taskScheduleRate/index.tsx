import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
// 任务计划偏差率
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周月季年统计（任务截止日期落在该周期）'],
  },
  {
    title: '统计范围',
    child: ['任务完成人为开发；或任务没有完成直接关闭的，关闭人是开发的'],
  },
  {
    title: '计算公式',
    child: [
      '单项任务计划偏差率 = (实际完成或实际关闭时间 - 计划截止 - 法定节假日）/ (计划截止 - 计划开始 + 1 - 法定节假日) *100',
      '按人员：计划偏差率 = AVG(该周期该开发人员所有单项任务计划偏差率)',
      '按部门：计划偏差率 = AVG(该周期该部门所有开发人员所有单项任务计划偏差率)',
      '按中心：计划偏差率 = AVG(该周期该中心所有开发人员所有单项任务计划偏差率)',
    ],
  },
];
const TaskScheduleRate: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.taskScheduleRate}
      identity={'DEVELOPER'}
      unit={'%'}
      len={2}
    />
  );
};

export default TaskScheduleRate;
