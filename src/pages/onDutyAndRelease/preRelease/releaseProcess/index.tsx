import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { BarsOutlined, HistoryOutlined, FundViewOutlined } from '@ant-design/icons';
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
      <div className={styles.releaseProcessContainer}>
        <Tabs defaultActiveKey={query.key} onChange={updateKey} animated={false}>
          <Tabs.TabPane
            key={'pre'}
            tab={
              <div>
                <BarsOutlined />
                预发布列表
              </div>
            }
          >
            <PreReleaseList />
          </Tabs.TabPane>
          <Tabs.TabPane
            key={'history'}
            tab={
              <div>
                <HistoryOutlined />
                发布历史
              </div>
            }
          >
            <HistoryList />
          </Tabs.TabPane>
          <Tabs.TabPane
            key={'view'}
            tab={
              <div>
                <FundViewOutlined />
                发布视图
              </div>
            }
          >
            <VisualView />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </PageContainer>
  );
};
export default Index;
