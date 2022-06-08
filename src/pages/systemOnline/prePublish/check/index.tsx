import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { history, useModel } from 'umi';
import Release from './Release';
import Detail from './Detail';
import Approve from './Approve';
import styles from './index.less';
const Check = () => {
  const [activeKey, setActiveKey] = useState('');
  const [release_project] = useModel('systemOnline', (system) => [system.proInfo?.release_project]);

  useEffect(() => {
    const query = history.location.query as { active: string } | undefined;
    setActiveKey(query?.active || 'release');
  }, [history.location.query]);

  return (
    <div className={styles.check}>
      <Tabs
        type="card"
        activeKey={activeKey}
        onChange={(v) => {
          history.push({
            pathname: history.location.pathname,
            query: { ...history.location.query, active: v },
          });
        }}
      >
        <Tabs.TabPane tab={release_project?.release_env || '(空)'} key="release">
          <Release />
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
