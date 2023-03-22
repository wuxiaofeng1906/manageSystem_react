import React from 'react';
import IStaticAgTable, {IRuleData} from '@/components/IStaticAgTable';
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
      '由开发完成或关闭的（没有完成人的取关闭人）由开发完成或关闭的（没有完成人的取关闭人）'
    ],
  },
  {
    title: '计算公式',
    child: [
      '开发-实际产出率 = AVG(该周期该开发所有执行的"开发-实际产出率"）',
      '单个执行的"开发-实际产出率" = SUM(该开发所有任务的标准工时) / SUM(该开发所有任务的实际消耗工时) *100',
      '该开发所有任务的标准工时 = (该开发在该执行所有任务的预计工时 / 该执行的总预计工时) * 该执行的总标准工时.(注意：班车和emergency、stagepatch等任务消耗工时<=0.1的不计入)',
      '该执行的总标准工时 = 规模*该执行对应的标准人天*8',
      '该执行对应的标准人天：'
    ],
    table: {
      column: [
        {dataIndex: 'type', title: '类型'},
        {dataIndex: 'days', title: '该执行对应的标准人天'},
      ],
      dataSource: [
        {
          type: '规模估算方式为架构估算的执行',
          days: '34',
        },
        {
          type: '规模估算方式为’自动反算’且执行类型为"功能增强轻量型项目"的',
          days: '34',
        },
        {
          type: 'sprint/hotfix/emergency/stage-patch/stage-emergency',
          days: '22',
        },

      ],
    },
  },
];
const ActualOutputRate: React.FC<any> = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.devTestActualOutputRate}
      identity={'DEVELOPER'}
      unit={'%'}
      len={2}
      valueShowEmpty={true}
    />
  );
};

export default ActualOutputRate;
