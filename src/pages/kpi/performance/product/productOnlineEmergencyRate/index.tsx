import React from 'react';
import type { IRuleData } from '@/components/IStaticPerformance';
import IStaticPerformance from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '发布日期统计',
    child: [
      '从发布过程获取正式发布的发布日期，排除掉只涉及emergency或stage-patch的项目（如果是sprint+特性项目+stage-patch，不要排除）',
    ],
  },
  {
    title: '分子统计范围（上线后2个工作日客服顾问反馈问题）',
    child: [
      '需求创建日期在发布日期后2个工作日内(若发布当天为工作日，要含发布当天），举例：发布日期为2022-08-11，则取需求创建日期为2022-08-11至2022-08-12的',
      '且需求所属执行类型为emergency的',
      '且(需求创建人为顾问/客服 或 bug转需求的查bug的创建人是顾问/客服）',
    ],
  },
  {
    title: '分母统计范围（上线前1个月客服顾问反馈问题）',
    child: ['从客户服务记录表获取数据customer_service', 'SUM(发布日期前1个月的数据)'],
  },
  {
    title: '计算规则',
    child: [
      '产品上线后emergency占比 = 上线后2个工作日客服顾问反馈问题 / 上线前1个月客服顾问反馈问题',
    ],
  },
];
const ProductOnlineEmergencyRate: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.productScale}
      identity={'DEVELOPER'}
    />
  );
};

export default ProductOnlineEmergencyRate;
