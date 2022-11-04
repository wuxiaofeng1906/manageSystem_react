import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import ProcessDetail from './ProcessDetail';
import Check from './Check';
import SheetInfo from './SheetInfo';
import Approval from './Approval';
import Publish from './Publish';
import { useLocation, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import styles from '../../common/common.less';

const tabs = [
  { name: '项目与服务详情', comp: ProcessDetail, key: 'server' },
  { name: '检查', comp: Check, key: 'check' },
  { name: '工单信息', comp: SheetInfo, key: 'sheet' },
  { name: '工单审批', comp: Approval, key: 'approval' },
  { name: '发布', comp: Publish, key: 'publish' },
];
const Layout = () => {
  const query = useLocation()?.query;

  useEffect(() => {
    let init = query.key;
    updateKey(init);
  }, []);

  const updateKey = (key?: string) =>
    history.replace({ pathname: history.location.pathname, query: { key: key ?? 'server' } });

  return (
    <PageContainer title={'预发布工单'}>
      <div className={styles.prePublish}>
        <Tabs activeKey={query.key} onChange={updateKey} animated={false}>
          {tabs?.map((it) => {
            return (
              <Tabs.TabPane key={it.key} tab={it.name}>
                <it.comp />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
    </PageContainer>
  );
};
export default Layout;
