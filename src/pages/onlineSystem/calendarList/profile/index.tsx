import React, { Fragment, useEffect, useRef } from 'react';
import { Tabs, Button } from 'antd';
import { useLocation, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import styles from '../../common/common.less';
import ProcessList from './ProcessList';
import ZentaoDetail from './ZentaoDetail';

const Profile = () => {
  const refreshRef = useRef() as React.MutableRefObject<{ onRefresh: Function }>;
  const query = useLocation()?.query;

  useEffect(() => {
    let init = query.key;
    updateKey(init);
  }, []);

  const updateKey = (key?: string) =>
    history.replace({ pathname: history.location.pathname, query: { key: key ?? 'profile' } });

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
              <Button onClick={() => refreshRef.current?.onRefresh()}>刷新</Button>
            ) : (
              <Fragment />
            )
          }
        >
          <Tabs.TabPane key={'profile'} tab={'禅道概况'}>
            <ZentaoDetail ref={refreshRef} />
          </Tabs.TabPane>
          <Tabs.TabPane key={'process'} tab={'发布过程单'}>
            <ProcessList />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </PageContainer>
  );
};
export default Profile;
