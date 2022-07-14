import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '取值范围',
    child: ['从班车延期需求/bug中取满足如下规则'],
    table: {
      column: [
        { dataIndex: 'stage', title: '所处阶段' },
        { dataIndex: 'rule', title: '其他规则' },
        { dataIndex: 'postpone', title: '是否标识延期' },
        { dataIndex: 'deferredBy', title: '延期归属方' },
        {
          dataIndex: 'mark',
          title: '延期归属对象',
          render: (v) => <div style={{ whiteSpace: 'pre-wrap' }}>{v}</div>,
        },
      ],
      dataSource: [
        {
          stage: '开发完',
          rule: '1. 是否需要测试验证的值为 "是"，且该需求没有关联bug的情况;\n2.或该数据是该执行中的超范围bug（没关联该班车的任何需求）',
          postpone: '是',
          deferredBy: '测试',
          mark: '1.且该条需求/bug的阶段扭转为’开发完毕‘的时间<当周周三9:30（需求阶段扭转为’开发完毕‘，即该需求最后1个开发类型的任务的完成时间；bug是打解决扭转为’开发完‘）;\n2.若该延期项为需求，该延期算给该需求关联任务指派给的测试人员，有多个测试人员，都需要算延期；\n3.若该延期项为超范围bug，该延期项算给该bug的创建人为测试的',
        },
      ],
    },
  },
];
const ShuttleDelay: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.humanEffect}
      identity={'TESTER'}
    />
  );
};

export default ShuttleDelay;
