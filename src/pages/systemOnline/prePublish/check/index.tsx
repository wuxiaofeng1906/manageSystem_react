import React from 'react';
import { Tabs } from 'antd';
import Release from './Release';
import Detail from './Detail';
import Approve from './Approve';
import styles from './index.less';

const Check = () => {
  return (
    <div className={styles.check}>
      <Tabs type="card">
        <Tabs.TabPane tab="release" key="release">
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
