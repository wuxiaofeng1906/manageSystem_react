import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: [
      '需求规模：zt_story.scale != 0',
      '统计在该周期完成的需求规模（需求关联的任务由开发完成/关闭，取任务的完成/关闭日期落在该周期的）',
      '任务范围：关联需求的任务状态为已完成/已关闭且是由测试完成/关闭的，关联需求的任务状态为未开始/进行中且当前指派给为测试的',
      '任务规模 = 该开发人员在该周期完成的任务总工时/该周期开发总工时*该开发在该周期投入所有项目的规模之和*（该周期开发总工时/截止目前项目开发总工时）',
    ],
  },
  {
    title: '部门统计',
    child: [
      '按部门：测试-生产规模 = SUM（该部门测试人员完成任务规模）',
      '按中心：测试-生产规模 = SUM（中心所有测试人员完成任务规模）',
    ],
  },
];
const ProductionScale: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.productScale}
      identity={'TESTER'}
      unit={'FP'}
      len={2}
    />
  );
};

export default ProductionScale;
