import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Tabs } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { getNewPageNumber, deleteReleaseItem } from './axiosRequest';

const { TabPane } = Tabs;

const Tab: React.FC<any> = () => {
  //Tab标签数据显示
  const { tabsData, setTabsData } = useModel('releaseProcess');
  const [showTabs, setShowTabs] = useState({
    // 页面tabPage当前展示页面
    shown: false,
    targetKey: '',
  });

  // const [tabContent, setTabContent] = useState({ // 页面tabPage展示
  //   activeKey: "", panes: []
  // });

  /* region tab 自身事件 */
  // Tabs页面切换
  const onTabsChange = async (activeKeys: any) => {
    setTabsData({
      ...tabsData,
      activeKey: activeKeys,
    });
  };

  // 新增tab
  const addTabs = async () => {
    // 获取新的pageNum
    const newNum = await getNewPageNumber();
    const newTabs = newNum.data?.ready_release_num;
    const { panes }: any = tabsData;
    panes.push({
      title: `${newTabs}灰度预发布`,
      content: '',
      key: newTabs,
    });
    setTabsData({ panes, activeKey: newTabs });
    // showNoneDataPage();
  };

  // 删除tab
  const removeTabs = (targetKeys: any) => {
    setShowTabs({
      shown: true,
      targetKey: targetKeys,
    });
  };

  // 新增、修改或删除tab页
  const onEdits = (targetKey: any, action: any) => {
    if (action === 'remove') {
      removeTabs(targetKey);
    } else if (action === 'add') {
      addTabs();
    }
  };

  /* endregion  */

  /* region tab 删除 */
  // 删除tab取消事件
  const delTabsCancel = () => {
    setShowTabs({
      ...showTabs,
      shown: false,
    });
  };

  // 确认删除tabs
  const delTabsInfo = async () => {
    const { targetKey } = showTabs;
    setShowTabs({
      ...showTabs,
      shown: false,
    });

    const { panes }: any = tabsData;
    const { activeKey }: any = tabsData;
    if (panes.length === 1) {
      message.error({
        content: '删除失败：页面需要至少保留一个预发布页面!',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }
    let newActiveKey = activeKey;
    let lastIndex = 0;
    panes.forEach((pane: any, i: number) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane: any) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }

    const deleteInfo = await deleteReleaseItem(targetKey);

    if (deleteInfo === '') {
      message.info({
        content: '删除成功！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      setTabsData({
        panes: newPanes,
        activeKey: newActiveKey,
      });
    } else {
      message.error({
        content: deleteInfo,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  };

  /* endregion */

  return (
    <div>
      {/* Tabs 标签,固定在上面 */}
      <div>
        <Tabs
          type="editable-card"
          activeKey={tabsData === undefined ? '' : tabsData.activeKey}
          onChange={onTabsChange}
          onEdit={(targetKey, action) => {
            onEdits(targetKey, action);
          }}
          style={{ marginTop: -20 }}
          // onDoubleClick={tabsChangeName}
        >
          {tabsData?.panes?.map((pane: any) => (
            <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
              {' '}
            </TabPane>
          ))}
        </Tabs>
      </div>

      {/* Tabs删除确认 */}
      <Modal
        title={'删除'}
        visible={showTabs.shown}
        onCancel={delTabsCancel}
        centered={true}
        footer={null}
        width={400}
        bodyStyle={{ height: 140 }}
      >
        <Form>
          <Form.Item>
            <label style={{ marginLeft: 25 }}>
              是否需要删除该批次发布过程，删除后下次发布需重新填写相关信息?
            </label>
          </Form.Item>

          <Form.Item>
            <Button
              style={{ borderRadius: 5, marginLeft: 20, float: 'right' }}
              onClick={delTabsCancel}
            >
              取消
            </Button>
            <Button
              type="primary"
              style={{
                color: '#46A0FC',
                backgroundColor: '#ECF5FF',
                borderRadius: 5,
                marginLeft: 100,
                float: 'right',
              }}
              onClick={delTabsInfo}
            >
              确定
            </Button>
          </Form.Item>

          <Form.Item
            name="groupId"
            style={{ display: 'none', width: '32px', marginTop: '-55px', marginLeft: '270px' }}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tab;
