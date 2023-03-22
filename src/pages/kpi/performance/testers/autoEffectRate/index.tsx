import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
// 自动化提效比
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: [
      '按周月季年统计，执行关闭日期落在哪个周期（按部门和按人员显示自动化测试人员所在部门和自动化测试人员',
    ],
  },
  {
    title: '统计范围',
    child: [
      '只统计有自动化测试人员参加的项目（自动化测试人员在执行中有任务指派给他或由他完成或关闭、有提bug、有执行用例）',
      'bug创建人是测试，分子是该项目bug来源为‘测试环境自动化发现’的有效bug(有效bug：解决方案为“空”“已解决”“延期处理”“后续版本”“合并代码”‘“转需求”的)',
      '单个项目的测试-自动化提效比 = 测试环境自动化发现有效加权bug / 项目所有测试发现有效加权bug * 100',
    ],
  },
  {
    title: '计算公式',
    child: ['测试-自动化提效比 = AVG(所有单个项目的自动化提效比)'],
  },
];
const AutoEffectRate: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.autoEffectRate}
      unit={'%'}
      len={2}
    />
  );
};

export default AutoEffectRate;
