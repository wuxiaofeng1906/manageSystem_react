import React from 'react';
import IStaticAgTable, {IRuleData} from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';

const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: [
      '需求规模：zt_story.scale != 0',
      '统计在该周期完成的规模（任务由开发完成/关闭，取任务的完成/关闭日期落在该周期的）',
      <p style={{textIndent: '3em', margin: '5px 0'}}>
        任务范围：任务状态为已完成/已关闭且是由开发完成/关闭的，任务状态为未开始/进行中且当前指派给为开发的；
      </p>,
      <p style={{textIndent: '3em', margin: '5px 0'}}>
        任务规模 = 该开发人员在该周期完成的任务总工时/该周期开发总工时*该开发在该周期投入所有项目的规模之和*
        （该周期开发总工时/截止目前项目开发总工时）；
      </p>,
    ],
  },
  {
    title: '部门统计',
    child: [
      '按部门：开发-生产规模 = SUM（该部门开发人员完成任务规模）',
      '按中心：开发-生产规模 = SUM（中心所有开发人员完成任务规模）',
    ],
  },
];
const ProductionScale: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.productScale}
      identity={'DEVELOPER'}
      unit={'FP'}
      len={2}
    />
  );
};

export default ProductionScale;
