import React, { useState } from 'react';
import { Tabs } from 'antd';
import Release from './Release';
import Detail from './Detail';
import Approve from './Approve';
import styles from './index.less';
const Check = () => {
  const [tabName, setTabName] = useState<string>('');
  return (
    <div className={styles.check}>
      <Tabs type="card">
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
