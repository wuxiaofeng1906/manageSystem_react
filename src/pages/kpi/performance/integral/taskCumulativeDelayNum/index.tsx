import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: [
      '产品为‘1.0产品经理’',
      '任务状态为‘未开始’或‘进行中’，且任务截止日期<当天，取任务的指派给',
      '或状态为‘已完成’或‘已关闭’，取任务的‘由谁完成’或‘由谁关闭’；',
    ],
  },
  {
    title: '计算公式',
    child: [
      '单项任务的累计延期次数 = 该任务延期的工作日天数 + 该任务的历史记录‘截止日期’的累计修改延期次数（取把日期改大的，改小的不算）',
    ],
  },
  {
    title: '按截止日期统计周期',
    child: [],
  },
];
const TaskCumulativeDelayNum: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.taskCumulativeDelayNum}
      unit={'次'}
      len={2}
    />
  );
};

export default TaskCumulativeDelayNum;
