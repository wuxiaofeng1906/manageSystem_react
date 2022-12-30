import React from 'react';
import type { IRuleData } from '@/components/IStaticAgTable';
import IStaticAgTable from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: [
      'bug状态不等于‘激活’',
      '且bug未删除',
      '且bug严重程度为P0/P1',
      '且bug的类型为‘环境部署问题’',
      '或 （bug类型为‘代码-预置数据问题’ 且 解决方案为‘已解决’的）',
      '或bug解决方案为‘环境问题’',
      '或bug解决方案为‘代码未合并’',
      '且bug的解决者是开发的（多次解决的情况，取最后一个打解决的开发）',
    ],
  },
  {
    title: '计算规则',
    child: [
      '开发-阻塞测试工作量 = SUM ( 单个bug阻塞时长 * 单个bug阻塞测试人数)',
      <p style={{ textIndent: '3em', margin: '5px 0' }}>
        单个bug阻塞时长 = bug最后一次开发解决的时间 - bug创建时间;
      </p>,
      <p style={{ textIndent: '3em', margin: '5px 0' }}>
        单个bug阻塞测试人数 = 该bug填的zt_bug.blocktest ;
      </p>,
    ],
  },
  {
    title: '指标显示',
    child: [
      '按部门： SUM ( 该部门开发解决的单个bug阻塞时长 * 该bug阻塞测试人数)',
      '按中心：SUM(所有开发解决的单个bug阻塞时长*该bug阻塞测试人数）',
      '满足开发的P0+P1阻塞条件的，需要校验必填',
    ],
  },
];
const BlockingTestWorkload: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.blockingTestWorkload}
      unit={'人天'}
      len={2}
    />
  );
};

export default BlockingTestWorkload;
