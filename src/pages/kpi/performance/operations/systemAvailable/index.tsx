import React, { useEffect } from 'react';
import IStaticPerformance, { ConditionHeader, IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Collapse } from 'antd';
import SystemAvailable from '@/pages/kpi/performance/operations/systemAvailable/SystemAvailable';

import { useLocation } from 'umi';
import { QuestionCircleTwoTone } from '@ant-design/icons';
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
const tabs = {
  ability: '系统可用性',
  avgusable: '系统平均可用时间',
  avgrepair: '系统平均修复时间',
};
const Layout: React.FC<any> = () => {
  const query = useLocation()?.query;

  useEffect(() => {}, []);
  const getDetail = async () => {
    const res = await StatisticServices.operationsAvgAvailable({});
  };

  return (
    <PageContainer>
      <div style={{ background: 'white' }}>
        <ConditionHeader initFilter={[]} onChange={} />
        <Button
          type="text"
          style={{ color: '#1890FF', float: 'right' }}
          icon={<QuestionCircleTwoTone />}
          size={'large'}
          // onClick={() => setVisible(true)}
        >
          计算规则
        </Button>
      </div>
      <Collapse defaultActiveKey={Object.keys(tabs)}>
        {Object.entries(tabs).map(([k, v]) => {
          return (
            <Collapse.Panel header={v} key={k}>
              <p>sda</p>
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </PageContainer>
  );
};

export default Layout;
