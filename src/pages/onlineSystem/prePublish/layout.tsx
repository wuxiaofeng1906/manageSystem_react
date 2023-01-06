import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, Button, Space } from 'antd';
import ProcessDetail from './ProcessDetail';
import Check from './Check';
import SheetInfo from './SheetInfo';
import { useLocation, history, useParams, useModel } from 'umi';
import { BarsOutlined, SyncOutlined } from '@ant-design/icons';
import styles from '../config/common.less';
import { OnlineSystemServices } from '@/services/onlineSystem';
import { Step } from '@/pages/onlineSystem/config/constant';
import usePermission from '@/hooks/permission';

const tabs = [
  { name: '项目与服务详情', comp: ProcessDetail, key: 'server' },
  { name: '检查', comp: Check, key: 'check' },
  { name: '工单信息', comp: SheetInfo, key: 'sheet' },
  // { name: '工单审批', comp: Approval, key: 'approval' },
  // { name: '发布', comp: Publish, key: 'publish' },
];
const Layout = () => {
  const { tab, subTab } = useLocation()?.query as { tab: string; subTab: string };
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);

  const { onlineSystemPermission } = usePermission();
  const { release_num } = useParams() as { release_num: string };
  const [draft, globalState, setGlobalState] = useModel('onlineSystem', (online) => [
    online.draft,
    online.globalState,
    online.setGlobalState,
  ]);

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
    onPushCheckFailMsg: Function;
  }>;

  useEffect(() => {
    if (!release_num) return;
    const status = ['success', 'failure'];
    let step = 0;
    OnlineSystemServices.getReleaseStatus({ release_num }).then((res) => {
      step = status.includes(res?.release_result) || res?.release_sealing == 'yes' ? 2 : 0;
      setGlobalState({
        ...globalState,
        step,
        locked: res?.release_sealing == 'yes',
        finished: status.includes(res?.release_result),
      });
      updateHref(Step[step]);
    });
  }, [release_num]);

  const updateHref = (key?: string) =>
    history.replace({
      pathname: history.location.pathname,
      query: { tab: tab ?? 'process', subTab: key ?? 'server' },
    });

  const onExtra = async (fn: Function) => {
    if (checkStatus || touched) return;
    setTouched(true);
    try {
      await fn?.();
      setTouched(false);
    } catch (e) {
      setTouched(false);
    }
  };

  const checkStatus = useMemo(() => {
    if (tab !== 'process') return true;
    return globalState.locked || globalState.finished;
  }, [globalState, touched, tab, subTab]);

  const renderTabContent = useMemo(() => {
    const hasPermission = onlineSystemPermission();
    if (subTab == 'server')
      return (
        <Space size={10}>
          <Button
            type={'text'}
            title={'需求列表'}
            disabled={touched || checkStatus}
            hidden={!hasPermission.storyList}
            icon={<BarsOutlined />}
            style={{ border: 'none', background: 'initial' }}
            onClick={() => ref.current?.onShow?.()}
          />
          <Button
            size={'small'}
            hidden={!hasPermission.cancelPublish}
            disabled={touched || globalState.finished}
            onClick={() => ref.current?.onCancelPublish?.()}
          >
            取消发布
          </Button>
          <Button
            title={'刷新'}
            type={'text'}
            hidden={!hasPermission.refreshOnline}
            disabled={touched || checkStatus}
            icon={<SyncOutlined />}
            style={{ border: 'none', background: 'initial' }}
            onClick={() => onExtra(ref.current?.onRefresh)}
          />
        </Space>
      );
    else if (subTab == 'check')
      return (
        <Space size={10}>
          <Button
            size={'small'}
            disabled={checkStatus || touched}
            onClick={() => onExtra(ref.current?.onSetting)}
            hidden={!hasPermission.paramSetting}
          >
            检查参数设置
          </Button>
          <Button
            size={'small'}
            onClick={() => onExtra(ref.current?.onCheck)}
            disabled={checkStatus || touched}
            hidden={!hasPermission.multiCheck}
          >
            一键执行检查
          </Button>
          <Button
            size={'small'}
            disabled={checkStatus || touched}
            hidden={!hasPermission.pushMessage}
            onClick={() => onExtra(ref.current?.onPushCheckFailMsg)}
          >
            一键推送检查失败信息
          </Button>
          <Button
            size={'small'}
            disabled={globalState.finished || touched}
            hidden={!hasPermission.preLock}
            onClick={async () => {
              setTouched(true);
              try {
                await ref.current?.onLock();
                setTouched(false);
              } catch (e) {
                setTouched(false);
              }
            }}
          >
            {checkStatus ? '取消封版锁定' : '封版锁定'}
          </Button>
          <Button
            title={'刷新'}
            type={'text'}
            hidden={!hasPermission.refreshCheck}
            disabled={touched || checkStatus}
            icon={<SyncOutlined />}
            style={{ border: 'none', background: 'initial' }}
            onClick={() => onExtra(ref.current?.onRefreshCheck)}
          />
        </Space>
      );
    else if (subTab == 'sheet')
      return (
        <div>
          {draft && <strong style={{ color: '#fe7b00cf', marginRight: 16 }}>状态：草稿态</strong>}
          <Button
            hidden={!hasPermission.orderSave}
            size={'small'}
            disabled={globalState.finished || touched}
            style={{ width: 100, background: '#46a0fc', color: 'white' }}
            onClick={async () => {
              setTouched(true);
              try {
                await ref.current?.onSave?.();
                setTouched(false);
              } catch (e) {
                setTouched(false);
              }
            }}
          >
            保存
          </Button>
        </div>
      );
    return <Fragment />;
  }, [release_num, tab, subTab, globalState, touched, draft, user?.group]);

  return (
    <div className={styles.prePublish}>
      <Tabs
        activeKey={subTab}
        onChange={updateHref}
        animated={false}
        className={styles.subTabs}
        tabBarExtraContent={renderTabContent}
      >
        {tabs?.map((it, index) => {
          return (
            <Tabs.TabPane
              key={it.key}
              tab={it.name}
              disabled={(globalState.step || 1) < index || touched}
            >
              <it.comp ref={ref} />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};
export default Layout;
