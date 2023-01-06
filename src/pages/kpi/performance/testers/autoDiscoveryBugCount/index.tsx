import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
// 自动化发现bug数
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周月季年统计（bug创建日期在该周期）'],
  },
  {
    title: '统计范围',
    child: [
      '创建人是自动化平台的，有效bug（解决方案为“空”“已解决”“延期处理”“后续版本”“合并代码”‘“转需求”的)，bug加权（加权bug数 = P0*5+P1*2+P2*1+P3*0.1）',
    ],
  },
  {
    title: '计算公式',
    child: [
      '个人：SUM（该人员在该周期创建的有效加权bug数）',
      '部门：SUM（该部门所有人员在该周期创建的有效加权bug数）',
      '中心：同部门',
    ],
  },
];
const AutoDiscoveryBugCount: React.FC<any> = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.autoDiscoveryBugCount}
      unit={'个'}
    />
  );
};

export default AutoDiscoveryBugCount;
