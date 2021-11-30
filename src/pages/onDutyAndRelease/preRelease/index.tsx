import React, {useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './style.css';

import {Button, Form, Modal, Select, Tabs} from 'antd';

import dayjs from "dayjs";

const {TabPane} = Tabs;
const {Option} = Select;

const currentDate = dayjs().format("YYYYMMDD");
const Content: React.FC<any> = (props) => {
  const [formForDutyNameModify] = Form.useForm();
  const saveProjects = (params: any) => {
    debugger;

    const datas = formForDutyNameModify.getFieldsValue();
  };

  return (
    <div>

      {/* 预发布项目 */}
      <fieldset className={"fieldStyle"}>
        <legend className={"legendStyle"}>Step1 预发布项目 <label style={{color: "red"}}> 被锁定:XXX正在编辑,请稍等</label></legend>

        <div style={{marginBottom: -20, marginTop: -5}}>
          <div style={{float: "right"}}>
            <Button type="primary"
                    style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5, marginLeft: 10}}
                    onClick={saveProjects}>保存 </Button>
          </div>

          <div>
            <Form form={formForDutyNameModify}>
              <Form.Item label="项目名称:" name="projectName">
                <Select showSearch>
                  <Option key={""} value={`""&免`}>免</Option>
                </Select>
              </Form.Item>
            </Form>
          </div>
        </div>

      </fieldset>

      {/* 升级服务 */}
      <fieldset className={"fieldStyle"}>
        <legend className={"legendStyle"}>Step2 升级服务</legend>

        <div>
          <div style={{float: "right"}}>
            <Button type="primary"
                    style={{height: "200px", color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5}}

            >点 <br></br>击 <br></br>保 <br></br>存 </Button>
          </div>
        </div>
      </fieldset>

      {/* 升级分支 */}
      <fieldset className={"fieldStyle"}>
        <legend className={"legendStyle"}>Step3 升级分支</legend>

        <div>
          <div style={{float: "right"}}>
            <Button type="primary"
                    style={{height: "200px", color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5,}}
            >点 <br></br>击 <br></br>保 <br></br>存 </Button>
          </div>
        </div>
      </fieldset>

      {/* 对应工单 */}
      <fieldset className={"fieldStyle"}>
        <legend className={"legendStyle"}>Step4 对应工单</legend>
        <div>
          <div style={{float: "right"}}>
            <Button type="primary"
                    style={{height: "200px", color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5,}}
            >点 <br></br>击 <br></br>保 <br></br>存 </Button>
          </div>
        </div>

      </fieldset>
    </div>
  );

};

const LogList: React.FC<any> = () => {


  /* region 动态增删tab */

  const initialPanes = [{title: `${currentDate}灰度预发布1`, content: <Content/>, key: '1', closable: false}];
  const [tabContent, setTabContent] = useState({
      activeKey: initialPanes[0].key,
      panes: initialPanes
    }
  );

  // 新增tab
  const add = () => {
    const {panes} = tabContent;
    const tabCount = panes.length;
    const activeKey = `index_${tabCount + 1}`;
    panes.push({title: `${currentDate}灰度预发布${tabCount + 1}`, content: <Content/>, key: activeKey, closable: true});
    setTabContent({panes, activeKey});
  };

  // 删除tab
  const remove = (targetKey: any) => {
    const {panes, activeKey} = tabContent;
    let newActiveKey = activeKey;
    let lastIndex = 0;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setTabContent({
      panes: newPanes,
      activeKey: newActiveKey,
    });
  };

  // 新增、修改或删除tab页
  const onEdits = (targetKey: any, action: any) => {
    if (action === 'remove') {
      remove(targetKey)
    } else if (action === 'add') {
      add();
    }
  };


  // 切换tab页面
  const onChange = (activeKeys: any) => {
    setTabContent({
      ...tabContent,
      activeKey: activeKeys
    });
  };

  /* endregion */

  // 返回渲染的组件
  return (
    <PageContainer style={{marginTop: -30}}>
      <Tabs
        type="editable-card"
        activeKey={tabContent.activeKey}
        onChange={onChange}
        onEdit={(targetKey, action) => {
          onEdits(targetKey, action)
        }}
        style={{backgroundColor: "white", marginTop: -20}}
      >
        {tabContent.panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    </PageContainer>
  );
};

export default LogList;
