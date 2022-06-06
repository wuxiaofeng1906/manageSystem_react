import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { history } from 'umi';
import Release from './Release';
import Detail from './Detail';
import Approve from './Approve';
import styles from './index.less';
const Check = () => {
  const [tabName, setTabName] = useState<string>('');
  const [activeKey, setActiveKey] = useState('');

  useEffect(() => {
    const state = history.location.state as { key: string } | undefined;
    setActiveKey(state?.key || 'release');
  }, [history.location.state]);
  return (
    <div className={styles.check}>
      <Tabs
        type="card"
        activeKey={activeKey}
        onChange={(v) => {
          history.push({
            pathname: history.location.pathname,
            query: { ...history.location.query },
            state: { key: v },
          });
        }}
      >
        <Tabs.TabPane tab={tabName} key="release">
          <Release onTab={(v: string) => setTabName(v)} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="检查详情" key="detail">
          <Detail />
        </Tabs.TabPane>
        <Tabs.TabPane tab="审批" key="approve">
          <Approve />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
export default Check;
