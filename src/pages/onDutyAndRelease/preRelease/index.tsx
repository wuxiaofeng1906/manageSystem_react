import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './style.css';

import {Button, Form, Input, message, Modal, Select, Tabs} from 'antd';

import dayjs from "dayjs";
import {AgGridReact} from "ag-grid-react";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {getAllProject} from "@/publicMethods/verifyAxios";
import {useRequest} from "ahooks";
import {savePrePulishProjects} from "./axiosApi";

const {TabPane} = Tabs;
const {Option} = Select;

const currentDate = dayjs().format("YYYYMMDD");

const loadPrjNameSelect = async () => {
  const prjNames = await getAllProject();
  const prjData: any = [];

  if (prjNames.message !== "") {
    message.error({
      content: prjNames.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (prjNames.data) {
    const datas = prjNames.data;
    datas.forEach((project: any) => {
      prjData.push(
        <Option key={project.project_id} value={`${project.project_id}`}>{project.project_name}</Option>);
    });
  }

  return prjData;

};

const Content: React.FC<any> = (props) => {
  const gridApi = useRef<GridApi>();

  debugger;
  const formForDutyNameModify = props.form;

  /* region  预发布项目 */
  const projectsArray = useRequest(() => loadPrjNameSelect()).data;

  // 保存预发布项目
  const saveProjects = () => {
    const datas = formForDutyNameModify.getFieldsValue();
    savePrePulishProjects(datas);
  };

  /* endregion */

  /* region 升级服务 */
  const table1Column = [{
    headerName: '上线环境',
    field: '',
  }, {
    headerName: '发布项',
    field: '',
  }, {
    headerName: '应用',
    field: '',
  }, {
    headerName: '是否支持热更新',
    field: '',
  }, {
    headerName: '是否涉及接口与数据库升级',
    field: '',
  }, {
    headerName: '分支和环境',
    field: '',
  }, {
    headerName: '说明',
    field: '',
  }, {
    headerName: '备注',
    field: '',
  }, {
    headerName: '操作',
  }];

  const table2Column = [{
    headerName: '上线环境',
    field: '',
  }, {
    headerName: '升级接口',
    field: '',
  }, {
    headerName: '接口服务',
    field: '',
  }, {
    headerName: '是否支持热更新',
    field: '',
  }, {
    headerName: '接口Method',
    field: '',
  }, {
    headerName: '接口URL',
    field: '',
  }, {
    headerName: '涉及租户',
    field: '',
  }, {
    headerName: '备注',
    field: '',
  }, {
    headerName: '操作',
  }];

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangeGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };


  /* endregion */

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
              <Form.Item label="项目名称:" name="projectsName">
                <Select showSearch mode="multiple">
                  {projectsArray}
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
          {/* 保存按钮 */}
          <div style={{float: "right"}}>
            <Button type="primary"
                    style={{
                      height: "200px",
                      color: '#46A0FC',
                      backgroundColor: "#ECF5FF",
                      borderRadius: 5,
                      marginTop: 34,
                      marginLeft: 10
                    }}
            >点 <br></br>击 <br></br>保 <br></br>存 </Button>
          </div>

          {/* 条件查询   */}
          <div style={{height: 35, marginTop: -15, overflow: "hidden"}}>

            <label> 测试环境： </label>
            <Select size={"small"} style={{minWidth: 140, width: '10%'}}>

            </Select>

            <label style={{marginLeft: 10}}> 一键部署ID： </label>
            <Select size={"small"} style={{minWidth: 90, width: '10%'}} showSearch>

            </Select>

            <Button size={"small"} style={{marginLeft: 10, borderRadius: 5}}>查询</Button>

          </div>

          {/* ag-grid 表格 */}
          <div>

            <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>
              <AgGridReact

                columnDefs={table1Column} // 定义列
                rowData={[]} // 数据绑定
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                  suppressMenu: true,
                }}
                headerHeight={25}
                rowHeight={25}
                onGridReady={onGridReady}
                onGridSizeChanged={onChangeGridReady}
                onColumnEverythingChanged={onChangeGridReady}
              >
              </AgGridReact>
            </div>

            <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>

              <AgGridReact
                columnDefs={table2Column} // 定义列
                rowData={[]} // 数据绑定
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                  suppressMenu: true,
                }}
                headerHeight={25}
                rowHeight={25}
                onGridReady={onGridReady}
                onGridSizeChanged={onChangeGridReady}
                onColumnEverythingChanged={onChangeGridReady}
              >
              </AgGridReact>

            </div>

          </div>

          {/*  提示标签 */}
          <div>
            这里显示操作的提示信息
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
  const [formForDutyNameModify] = Form.useForm();


  /* region 动态增删tab */

  const initialPanes = [{
    title: `${currentDate}灰度预发布1`,
    content: <Content form={formForDutyNameModify}/>,
    key: '1',
    closable: false
  }, {
    title: `${currentDate}灰度预发布2`,
    content: <Content form={formForDutyNameModify}/>,
    key: '2',
    closable: false
  }];
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
    panes.push({
      title: `${currentDate}灰度预发布${tabCount + 1}`,
      content: <Content form={formForDutyNameModify}/>,
      key: activeKey,
      closable: true
    });
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

    // 在切换时显示第二个界面的数据
    formForDutyNameModify.setFieldsValue({
      projectsName: "测试666"
    });
  };

  /* endregion */


  useEffect(() => {

    // 先显示第一个界面的数据
    formForDutyNameModify.setFieldsValue({
      projectsName: "测试"
    },);
  }, []);
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
