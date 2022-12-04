import React, { Fragment, useEffect, useRef } from 'react';
import { Tabs } from 'antd';
import { useLocation, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import styles from '../../config/common.less';
import ProcessList from './ProcessList';
import ZentaoDetail from './ZentaoDetail';
import { SyncOutlined } from '@ant-design/icons';

const Profile = () => {
  const refreshRef = useRef() as React.MutableRefObject<{ onRefresh: Function }>;
  const query = useLocation()?.query;

  useEffect(() => {
    let init = query.key;
    updateKey(init);
  }, []);

  const updateKey = (key?: string) =>
    history.replace({ pathname: history.location.pathname, query: { key: key ?? 'process' } });

  return (
    <PageContainer title={query.key == 'profile' ? '禅道概况' : '发布过程单'}>
      <div className={styles.profileAndProcess}>
        <Tabs
          activeKey={query.key}
          onChange={updateKey}
          animated={false}
          className={styles.onlineTab}
          tabBarExtraContent={
            query.key == 'profile' ? (
              <SyncOutlined
                onClick={() => refreshRef.current?.onRefresh()}
                title={'刷新'}
                style={{ color: '#0079ff', fontSize: 16 }}
              />
            ) : (
              <Fragment />
            )
          }
        >
          <Tabs.TabPane key={'process'} tab={'发布过程单'}>
            <ProcessList />
          </Tabs.TabPane>
          <Tabs.TabPane key={'profile'} tab={'禅道概况'}>
            <ZentaoDetail ref={refreshRef} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </PageContainer>
  );
};
export default Profile;
