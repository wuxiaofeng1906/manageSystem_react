import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, Button, Space } from 'antd';
import ProcessDetail from './ProcessDetail';
import Check from './Check';
import SheetInfo from './SheetInfo';
import { useLocation, history, useParams, useModel } from 'umi';
import { BarsOutlined, SyncOutlined } from '@ant-design/icons';
import styles from '../config/common.less';
import { OnlineSystemServices } from '@/services/onlineSystem';
import { Step } from '@/pages/onlineSystem/config/constant';

const tabs = [
  { name: '项目与服务详情', comp: ProcessDetail, key: 'server' },
  { name: '检查', comp: Check, key: 'check' },
  { name: '工单信息', comp: SheetInfo, key: 'sheet' },
  // { name: '工单审批', comp: Approval, key: 'approval' },
  // { name: '发布', comp: Publish, key: 'publish' },
];
const Layout = () => {
  const { tab, subTab } = useLocation()?.query as { tab: string; subTab: string };
  const { release_num } = useParams() as { release_num: string };
  const [globalState, setGlobalState] = useModel('onlineSystem', (online) => [
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
  }>;
  useEffect(() => {
    if (!release_num) return;
    const checkStatus = ['success', 'failure'];
    let step = 0;
    OnlineSystemServices.getReleaseStatus({ release_num }).then((res) => {
      step = checkStatus.includes(res?.release_result) || res?.release_sealing == 'yes' ? 2 : 0;
      setGlobalState({
        ...globalState,
        step,
        locked: res?.release_sealing == 'yes',
        finished: checkStatus.includes(res?.release_result),
      });
      console.log(globalState);
      updateHref(Step[step]);
    });
  }, [release_num]);

  const updateHref = (key?: string) =>
    history.replace({
      pathname: history.location.pathname,
      query: { tab: tab ?? 'process', subTab: key ?? 'server' },
    });

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
    if (tab !== 'process') return {};
    const flag = globalState.locked || globalState.finished;
    return {
      disableStyle: flag
        ? { filter: 'grayscale(1)', cursor: 'not-allowed' }
        : { cursor: touched ? 'not-allowed' : 'pointer' },
      flag,
    };
  }, [globalState, touched, tab, subTab]);

  const renderTabContent = useMemo(() => {
    if (subTab == 'server')
      return (
        <Space size={10}>
          <BarsOutlined
            onClick={() => {
              if (checkStatus.flag || touched) return;
              ref.current?.onShow?.();
            }}
            title={'需求列表'}
            style={{ color: '#0079ff', fontSize: 16, ...checkStatus?.disableStyle }}
          />
          <Button
            size={'small'}
            disabled={touched || globalState.finished}
            onClick={() => ref.current?.onCancelPublish?.()}
          >
            取消发布
          </Button>
          <SyncOutlined
            title={'刷新'}
            spin={touched}
            onClick={() => onExtra(ref.current?.onRefresh)}
            style={{ color: '#0079ff', fontSize: 16, ...checkStatus?.disableStyle }}
          />
        </Space>
      );
    else if (subTab == 'check')
      return (
        <Space size={10}>
          <Button
            size={'small'}
            disabled={checkStatus?.flag || touched}
            onClick={() => onExtra(ref.current?.onSetting)}
          >
            检查参数设置
          </Button>
          <Button
            size={'small'}
            onClick={() => onExtra(ref.current?.onCheck)}
            disabled={checkStatus?.flag || touched}
          >
            一键执行检查
          </Button>
          <Button
            size={'small'}
            disabled={globalState.finished || touched}
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
            {checkStatus?.flag ? '取消封版锁定' : '封版锁定'}
          </Button>
          <SyncOutlined
            title={'刷新'}
            style={{ color: '#0079ff', fontSize: 16, ...checkStatus?.disableStyle }}
            onClick={() => onExtra(ref.current?.onRefreshCheck)}
          />
        </Space>
      );
    else
      return (
        <div>
          {globalState.draft && (
            <strong style={{ color: '#fe7b00cf', marginRight: 16 }}>状态：草稿态</strong>
          )}
          <Button
            size={'small'}
            onClick={() => ref.current?.onSave()}
            disabled={globalState.finished}
            style={{ width: 100, background: '#46a0fc', color: 'white' }}
          >
            保存
          </Button>
        </div>
      );
  }, [release_num, tab, subTab, globalState, touched]);
  return (
    <div className={styles.prePublish}>
      <Tabs
        activeKey={subTab}
        onChange={updateHref}
        animated={false}
        className={styles.onlineTab}
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
