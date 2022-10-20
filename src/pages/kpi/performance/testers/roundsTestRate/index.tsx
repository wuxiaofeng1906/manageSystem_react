import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: 'bug统计范围',
    child: [
      '产品为1.0产品经理',
      '执行类型为‘新增功能模块特性项目’或‘功能增强型特性项目’',
      'bug的影响版本包含’执行名称第一轮测试’或‘执行名称第二轮测试’或‘执行名称冒烟测试’或‘执行名称’或‘主干’（‘执行名称’或‘主干’仅取创建人为测试的，算到冒烟测试轮中）',
    ],
  },
  {
    title: '计算规则',
    child: [
      '部门P0+P1占比得分 = AVERAGE(该部门参与所有项目的P0+P1占比得分)',
      '单个项目P0+P1占比得分 = AVERAGE(一轮得分+二轮得分+冒烟得分) - 冒烟P0+P1占比/3',
      '一轮得分 = 一轮P0+P1占比',
      '二轮得分 = 100 -  二轮P0+P1占比',
      '冒烟得分 = 100 - 冒烟P0+P1占比',
      '特殊情况：一轮、二轮、冒烟轮都是0，得100分',
    ],
  },
];
const RoundsTestRate: React.FC<any> = () => {
  return <IStaticPerformance ruleData={ruleData} request={StatisticServices.roundsTestRate} />;
};

export default RoundsTestRate;
