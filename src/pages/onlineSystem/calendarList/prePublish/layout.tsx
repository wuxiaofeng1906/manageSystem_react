import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, Button, Space } from 'antd';
import ProcessDetail from './ProcessDetail';
import Check from './Check';
import SheetInfo from './SheetInfo';
import { useLocation, history, useParams, useModel } from 'umi';
import { BarsOutlined, SyncOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import styles from '../../config/common.less';

const tabs = [
  { name: '项目与服务详情', comp: ProcessDetail, key: 'server' },
  { name: '检查', comp: Check, key: 'check' },
  { name: '工单信息', comp: SheetInfo, key: 'sheet' },
  // { name: '工单审批', comp: Approval, key: 'approval' },
  // { name: '发布', comp: Publish, key: 'publish' },
];
const Layout = () => {
  const query = useLocation()?.query;
  const { release_num } = useParams() as { release_num: string };
  const [globalState] = useModel('onlineSystem', (online) => [online.globalState]);
  const [touched, setTouched] = useState(false);
  const ref = useRef() as React.MutableRefObject<{
    onRefresh: Function;
    onRefreshCheck: Function;
    onCancelPublish: Function;
    onShow: Function;
    onSetting: Function;
    onCheck: Function;
    onLock: Function;
    onSave: Function;
  }>;
  useEffect(() => {
    let init = query.key;
    updateKey(init);
  }, []);

  const updateKey = (key?: string) =>
    history.replace({ pathname: history.location.pathname, query: { key: key ?? 'server' } });

  const onExtra = async (fn: Function) => {
    if (checkStatus.flag || touched) return;
    setTouched(true);
    try {
      await fn();
      setTouched(false);
    } catch (e) {
      setTouched(false);
    }
  };

  const checkStatus = useMemo(() => {
    const flag = globalState.locked || globalState.finished;
    return {
      disableStyle: flag
        ? { filter: 'grayscale(1)', cursor: 'not-allowed' }
        : { cursor: touched ? 'not-allowed' : 'pointer' },
      flag,
    };
  }, [globalState, touched]);

  const renderTabContent = useMemo(() => {
    if (query.key == 'server')
      return (
        <Space size={10}>
          <BarsOutlined
            onClick={() => {
              if (checkStatus.flag || touched) return;
              ref.current?.onShow();
            }}
            title={'需求列表'}
            style={{ color: '#0079ff', fontSize: 16, ...checkStatus.disableStyle }}
          />
          <Button size={'small'} disabled={touched} onClick={() => ref.current?.onCancelPublish()}>
            取消发布
          </Button>
          <SyncOutlined
            title={'刷新'}
            spin={touched}
            onClick={() => onExtra(ref.current?.onRefresh)}
            style={{ color: '#0079ff', fontSize: 16, ...checkStatus.disableStyle }}
          />
        </Space>
      );
    else if (query.key == 'check')
      return (
        <Space size={10}>
          <Button size={'small'} disabled={touched} onClick={() => onExtra(ref.current?.onSetting)}>
            检查参数设置
          </Button>
          <Button
            size={'small'}
            onClick={() => onExtra(ref.current?.onCheck)}
            disabled={checkStatus.flag || touched}
          >
            一键执行检查
          </Button>
          <Button
            size={'small'}
            disabled={globalState.finished || touched}
            onClick={() => onExtra(ref.current?.onLock)}
          >
            {checkStatus.flag ? '取消封板锁定' : '封板锁定'}
          </Button>
          <SyncOutlined
            title={'刷新'}
            style={{ color: '#0079ff', fontSize: 16, ...checkStatus.disableStyle }}
            onClick={() => onExtra(ref.current?.onRefreshCheck)}
          />
        </Space>
      );
    else
      return (
        <div>
          <Button size={'small'} onClick={() => ref.current?.onSave()}>
            保存
          </Button>
        </div>
      );
  }, [release_num, query.key, globalState, touched]);

  return (
    <PageContainer title={'预发布工单'}>
      <div className={styles.prePublish}>
        <Tabs
          activeKey={query.key}
          onChange={updateKey}
          animated={false}
          className={styles.onlineTab}
          tabBarExtraContent={renderTabContent}
        >
          {tabs?.map((it, index) => {
            return (
              <Tabs.TabPane
                key={it.key}
                tab={it.name}
                disabled={globalState.step < index || touched}
              >
                <it.comp ref={ref} />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
    </PageContainer>
  );
};
export default Layout;
