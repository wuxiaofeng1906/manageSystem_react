import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { useLocation, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import PreReleaseList from '@/pages/onDutyAndRelease/preRelease/releaseProcess/PreReleaseList';
import VisualView from '@/pages/onDutyAndRelease/preRelease/releaseProcess/VisualView';
import HistoryList from '@/pages/onDutyAndRelease/preRelease/releaseProcess/HistoryList';
import styles from './index.less';
const Index = () => {
  const query = useLocation()?.query;

  useEffect(() => {
    updateKey(query.key);
  }, []);

  const updateKey = (key?: string) =>
    history.replace({ pathname: history.location.pathname, query: { key: key ?? 'pre' } });

  return (
    <PageContainer>
      <div className={styles.processTabs}>
        <Tabs defaultActiveKey={query.key} onChange={updateKey} animated={false}>
          <Tabs.TabPane tab={'预发布列表'} key={'pre'}>
            <PreReleaseList />
          </Tabs.TabPane>
          <Tabs.TabPane tab={'发布历史'} key={'history'}>
            <HistoryList />
          </Tabs.TabPane>
          <Tabs.TabPane tab={'发布一览图'} key={'visual'}>
            <VisualView />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </PageContainer>
  );
};
export default Index;
