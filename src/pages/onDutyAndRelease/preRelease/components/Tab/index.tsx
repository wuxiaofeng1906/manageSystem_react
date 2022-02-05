import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Tabs } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { getNewPageNumber, deleteReleaseItem, modifyTabsName } from './axiosRequest';
import { alalysisInitData } from '../../datas/dataAnalyze';

const { TabPane } = Tabs;

const Tab: React.FC<any> = () => {
  const { tabsData, setTabsData } = useModel('releaseProcess');

  /* region tab 自身事件 */
  const [showTabs, setShowTabs] = useState({ shown: false, targetKey: '' });

  // Tabs页面切换
  const onTabsChange = async (activeKeys: any) => {
    setTabsData(activeKeys, tabsData.panes);
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
    setTabsData(newTabs, panes);
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
      setTabsData(newActiveKey, newPanes);
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

  /* region  修改tab */
  const [tabNameSetForm] = Form.useForm(); // tab 名修改
  const [tabNameModal, setTabNameModal] = useState(false);
  // 修改tab的名字
  const tabsChangeName = (params: any) => {
    const currentName = params.target.innerText;
    setTabNameModal(true);
    tabNameSetForm.setFieldsValue({
      oldTabName: currentName,
      newTabName: '',
    });
  };

  // 取消修改
  const cancleNameSet = () => {
    setTabNameModal(false);
  };

  // 保存tab名
  const saveModifyName = async () => {
    const formData = tabNameSetForm.getFieldsValue();
    // 被修改的一定是当前activekey中的数据
    const result = await modifyTabsName(tabsData.activeKey, formData.newTabName);
    if (result === '') {
      message.info({
        content: '修改成功',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      setTabNameModal(false);
      //   重置tab名
      const { tabPageInfo } = await alalysisInitData('tabPageInfo', '');
      if (tabPageInfo) {
        setTabsData(tabsData.activeKey, tabPageInfo.panes);
      }
    } else {
      message.error({
        content: result,
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
      <div style={{ marginTop: -40 }}>
        <Tabs
          type="editable-card"
          activeKey={tabsData === undefined ? '' : tabsData.activeKey}
          onChange={onTabsChange}
          onEdit={(targetKey, action) => {
            onEdits(targetKey, action);
          }}
          style={{ marginTop: -20 }}
          onDoubleClick={tabsChangeName}
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

      <Modal
        title={'发布过程名修改'}
        visible={tabNameModal}
        onCancel={cancleNameSet}
        centered={true}
        footer={null}
        width={400}
        bodyStyle={{ height: 145 }}
      >
        <Form form={tabNameSetForm} autoComplete="off">
          <Form.Item name="oldTabName" label="原发布名:" style={{ marginTop: -15 }}>
            <Input disabled style={{ color: 'black' }} />
          </Form.Item>

          <Form.Item name="newTabName" label="新发布名:" style={{ marginTop: -15 }}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              style={{
                color: '#46A0FC',
                backgroundColor: '#ECF5FF',
                borderRadius: 5,
                float: 'right',
              }}
              onClick={saveModifyName}
            >
              保存{' '}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tab;