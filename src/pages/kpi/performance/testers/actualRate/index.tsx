import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周月季年统计（任务完成日期或关闭日期落在该周期）'],
  },
  {
    title: '统计范围',
    child: [
      '统计zt.project.scale>0',
      '统计完成或关闭任务',
      '由测试完成或关闭的（没有完成人的取关闭人）',
      '特殊：由测试完成的任务，任务类型不规范不知道算在哪个阶段的，都统一按‘测试阶段’来算',
    ],
  },
  {
    title: '计算公式',
    child: [
      '测试-实际产出率 = SUM(该测试所有任务的标准工时) / SUM(该测试所有任务的实际工时) *100',
      '单个任务的标准工时 = (该任务的预计工时 / 该任务所在执行对应阶段的总预计工时) * 该任务所在阶段的总标准工时',
      '单个任务的实际工时 = 该任务消耗工时*该任务的完成人的职级能力系数',
    ],
  },
];
const ActualRate: React.FC<any> = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.patch}
      identity={'TESTER'}
      unit={'%'}
    />
  );
};

export default ActualRate;
