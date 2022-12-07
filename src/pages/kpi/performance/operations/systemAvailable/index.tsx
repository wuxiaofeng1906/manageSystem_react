import React, { useEffect } from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import SystemAvailable from '@/pages/kpi/performance/operations/systemAvailable/SystemAvailable';

import { useLocation } from 'umi';
// 累计线上千行bug率 -p0p1占比
const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: ['按周月季年统计，按事件开始日期归属周期（zt_feedback.realStarted)'],
  },
  {
    title: '统计范围',
    child: ['故障持续时间取值zt_feedback.Duration'],
  },
  {
    title: '计算公式',
    child: ['运维-系统平均可用时间 = 1-(SUM(故障持续时间) / (24*60*统计周期自然日))*100'],
  },
];
const Layout: React.FC<any> = () => {
  const query = useLocation()?.query;

  useEffect(() => {}, []);

  return (
    <PageContainer>
      <Tabs activeKey={query.key ?? 'ability'}>
        {['ability', 'avgusable', 'avgrepair'].map((key) => {
          return (
            <Tabs.TabPane key={key}>
              <SystemAvailable />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </PageContainer>
  );
};

export default Layout;
