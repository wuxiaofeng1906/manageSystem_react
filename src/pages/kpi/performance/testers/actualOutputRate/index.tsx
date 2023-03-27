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
      '由测试完成或关闭的（没有完成人的取关闭人）'
    ],
  },
  {
    title: '计算公式',
    child: [
      '测试-实际产出率 = AVG(该周期该测试所有执行的测试-实际产出率）',
      '单个执行的测试-实际产出率 = SUM(该测试所有任务的标准工时) / SUM(该测试所有任务的实际消耗工时) *100',
      '该测试所有任务的标准工时 = (该测试在该执行所有任务的预计工时 / 该执行的总预计工时) * 该执行的总标准工时，注意：取预计工时时，先检查 "预计工时/消耗工时" >1 或 当执行类型为sprint、hotfix、emergency和stage-patch时，检查‘消耗工时/预计工时’>1.5，则预计工时取 实际消耗,且计算执行预计总工时的时候也要取实际消耗工时;当消耗工时为0的，预计工时则为0;当预计工时为0，且消耗工时>0的，预计工时取消耗工时；',
      '该执行的总标准工时 = 规模*该执行对应的标准人天*8 ，注意：进行中的执行，且反算规模小于架构估算规模的，规模则取自动反算规模，否则规模取zt_project.scale',
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
        {
          type: '自动化平台项目下的执行',
          days: '27'
        }

      ],
    },
  },
];
const ActualOutputRate: React.FC<any> = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.devTestActualOutputRate}
      identity={'TESTER'}
      unit={'%'}
      len={2}
      valueShowEmpty={true}
    />
  );
};

export default ActualOutputRate;
