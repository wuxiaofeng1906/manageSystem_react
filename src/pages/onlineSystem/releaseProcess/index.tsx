import React, { useEffect, useState } from 'react';
import { Tabs, Result } from 'antd';
import { BarsOutlined, HistoryOutlined } from '@ant-design/icons';
import { useLocation, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import PreReleaseList from '@/pages/onlineSystem/releaseProcess/PreReleaseList';
import HistoryList from '@/pages/onlineSystem/releaseProcess/HistoryList';
import styles from './index.less';
import usePermission from '@/hooks/permission';

const Index = () => {
  const query = useLocation()?.query;

  const { prePermission } = usePermission();
  const [height, setHeight] = useState(window.innerHeight - 250);
  const hasPermission = prePermission();

  useEffect(() => {
    let init = query.key;
    if (!hasPermission?.preList && hasPermission?.historyList) init = 'history';
    updateKey(init);
    window.onresize = function () {
      setHeight(window.innerHeight - 250);
    };
    return () => {
      window.onresize = null;
    };
  }, []);

  const updateKey = (key?: string) =>
    history.replace({ pathname: history.location.pathname, query: { key: key ?? 'pre' } });

  return (
    <PageContainer>
      <div className={styles.releaseProcessContainer}>
        {hasPermission?.preList || hasPermission?.historyList ? (
          <Tabs activeKey={query.key} onChange={updateKey} animated={false}>
            {hasPermission?.preList ? (
              <Tabs.TabPane
                key={'pre'}
                tab={
                  <div>
                    <BarsOutlined />
                    预发布列表
                  </div>
                }
              >
                <PreReleaseList disabled={!hasPermission?.add} height={height} />
              </Tabs.TabPane>
            ) : (
              <div />
            )}
            {hasPermission?.historyList ? (
              <Tabs.TabPane
                key={'history'}
                tab={
                  <div>
                    <HistoryOutlined />
                    发布历史
                  </div>
                }
              >
                <HistoryList height={height} />
              </Tabs.TabPane>
            ) : (
              <div />
            )}
          </Tabs>
        ) : (
          <Result status={'403'} title="您没有此页面的访问权限，如需访问请联系管理员。" />
        )}
      </div>
    </PageContainer>
  );
};
export default Index;
