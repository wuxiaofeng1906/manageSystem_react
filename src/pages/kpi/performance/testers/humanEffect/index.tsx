import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: ['任务完成/关闭/指派给为测试', '按周期统计该周期工作日天数'],
  },
  {
    title: '计算公式',
    child: [
      '按个人：该周期个人生产规模/该周期工作日天数',
      <p style={{ textIndent: '3em', margin: '5px 0' }}>
        若该员工在该周期中途入职，工作日天数从入职当天开始算，在该周期的实际工作日天数；（如果员工在该周期离职，工作日仅算到离职日期截止）;
      </p>,
      '按部门：SUM(该周期研发部门生产规模) / SUM（该研发部门该周期的开发人员*该周期工作日天数）',
      <p style={{ textIndent: '3em', margin: '5px 0' }}>分子按部门取该周期‘测试-生产规模‘数据;</p>,
      <p style={{ textIndent: '3em', margin: '5px 0' }}>
        分母举例：（分母计算=1*22+1*15+1*18=45人天）;
      </p>,
      '按中心：SUM（该周期该中心生产规模）/ SUM（该中心该周期的开发人员*该周期工作日天数）',
      <p style={{ textIndent: '3em', margin: '5px 0' }}>分母计算参见按部门;</p>,
    ],
  },
];
const HumanEffect: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.humanEffect}
      identity={'TESTER'}
      showDenominator={true}
      len={3}
      unit={'FP/人天'}
    />
  );
};

export default HumanEffect;
