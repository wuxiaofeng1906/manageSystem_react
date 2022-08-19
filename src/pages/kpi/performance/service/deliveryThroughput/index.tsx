import React from 'react';
import type { IRuleData } from '@/components/IStaticPerformance';
import IStaticPerformance from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: ['按周、按月、按季、按半年、按年'],
  },
  {
    title: '统计范围',
    child: [
      '需求阶段‘已发布’，取关联发布日期落在该周期的',
      '需求阶段‘已关闭’',
      <p style={{ textIndent: '3em', margin: '5px 0' }}>
        若只有关闭日期没有发布日期则取关闭日期，且关闭原因为‘已完成’的;
      </p>,
      <p style={{ textIndent: '3em', margin: '5px 0' }}>
        且关联发布的日期小于关闭日期，则取发布的日期;
      </p>,
      <p style={{ textIndent: '4em', margin: '5px 0' }}>若在关闭前有关联发布的记录;</p>,
      <p style={{ textIndent: '4em', margin: '5px 0' }}>若关闭日期小于发布日期，则取关闭日期;</p>,
    ],
  },
  {
    title: '计算规则',
    child: ['取已上线需求规模字段求和', '交付吞吐量 = SUM(已上线需求规模)  '],
  },
];
const DeliveryThroughput: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.shuttleDelay}
      identity={'DEVELOPER'}
    />
  );
};

export default DeliveryThroughput;
