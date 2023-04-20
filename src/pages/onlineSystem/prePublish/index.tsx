import React, {useEffect, useRef} from 'react';
import {Tabs} from 'antd';
import {useLocation, history, Link} from 'umi';
import {PageContainer} from '@ant-design/pro-layout';
import styles from '../config/common.less';
import ZentaoDetail from './ZentaoDetail';
import {SyncOutlined} from '@ant-design/icons';
import ProcessLayout from './layout';
import {ProcessTabs} from "../components/ProcessTabs";
import {useModel} from "@@/plugin-model/useModel";

const PrePublish = () => {
  const refreshRef = useRef() as React.MutableRefObject<{ onRefresh: Function }>;
  const query = useLocation()?.query;
  const {globalState} = useModel('onlineSystem');

  useEffect(() => {
    let init = query.tab;
    updateHref(init);
  }, []);

  const updateHref = (key?: string) =>
    history.replace({
      pathname: history.location.pathname,
      query: {tab: key ?? 'process', subTab: query?.subTab},
    });

  return (
    // <PageContainer title={query.tab == 'profile' ? '禅道概况' : '发布过程单'}>
    <PageContainer title={<ProcessTabs finished={globalState.finished}/>}>

      <div className={styles.profileAndProcess}>

        <Tabs
          activeKey={query.tab}
          onChange={updateHref}
          animated={false}
          className={styles.onlineTab}
          tabBarExtraContent={
            query.tab == 'profile' ? (
              <SyncOutlined
                onClick={() => refreshRef.current?.onRefresh()}
                title={'刷新'}
                style={{color: '#0079ff', fontSize: 16}}
              />
            ) : (
              <span></span>
            )
          }
        >
          <Tabs.TabPane key={'process'} tab={'发布过程单'}>
            <ProcessLayout/>
          </Tabs.TabPane>
          <Tabs.TabPane key={'profile'} tab={'禅道概况'}>
            <ZentaoDetail ref={refreshRef}/>
          </Tabs.TabPane>

        </Tabs>

      </div>
    </PageContainer>
  );
};
export default PrePublish;
