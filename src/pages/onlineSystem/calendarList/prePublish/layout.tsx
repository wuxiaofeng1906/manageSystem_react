import React, { useEffect, useMemo, useRef } from 'react';
import { Tabs, Button, Space } from 'antd';
import ProcessDetail from './ProcessDetail';
import Check from './Check';
import SheetInfo from './SheetInfo';
// import Approval from './Approval';
// import Publish from './Publish';
import { useLocation, history, useParams } from 'umi';
import { BarsOutlined, SyncOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import styles from '../../common/common.less';

const tabs = [
  { name: '项目与服务详情', comp: ProcessDetail, key: 'server' },
  { name: '检查', comp: Check, key: 'check' },
  { name: '工单信息', comp: SheetInfo, key: 'sheet' },
  // { name: '工单审批', comp: Approval, key: 'approval' },
  // { name: '发布', comp: Publish, key: 'publish' },
];
const Layout = () => {
  const query = useLocation()?.query;
  const { id } = useParams() as { id: string };
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

  const renderTabContent = useMemo(() => {
    if (query.key == 'server')
      return (
        <Space size={10}>
          <BarsOutlined
            onClick={() => ref.current?.onShow()}
            title={'需求列表'}
            style={{ color: '#0079ff', fontSize: 16 }}
          />
          <Button size={'small'} onClick={() => ref.current?.onCancelPublish()}>
            取消发布
          </Button>
          <SyncOutlined
            onClick={() => ref.current?.onRefresh()}
            title={'刷新'}
            style={{ color: '#0079ff', fontSize: 16 }}
          />
        </Space>
      );
    else if (query.key == 'check')
      return (
        <Space size={10}>
          <Button size={'small'} onClick={() => ref.current?.onSetting()}>
            检查参数设置
          </Button>
          <Button size={'small'} onClick={() => ref.current?.onCheck()}>
            一键执行检查
          </Button>
          <Button size={'small'} onClick={() => ref.current?.onLock()}>
            封板锁定
          </Button>
          <SyncOutlined
            onClick={() => ref.current?.onRefreshCheck()}
            title={'刷新'}
            style={{ color: '#0079ff', fontSize: 16 }}
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
  }, [id, query.key]);

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
          {tabs?.map((it) => {
            return (
              <Tabs.TabPane key={it.key} tab={it.name}>
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
