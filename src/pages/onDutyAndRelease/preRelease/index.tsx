import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './style.css';
import {Button, Form, Input, message, Modal, Select, Tabs, Row, Col, DatePicker} from 'antd';
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


const PreRelease: React.FC<any> = () => {

  /* region 表格相关定义和事件 */
  const operateRenderer = (params: any) => {
    const paramData = JSON.stringify(params.data);
    return `
        <div style="margin-top: -5px">
            <Button  style="border: none; background-color: transparent; " onclick='showParams(${paramData})'>
              <img src="../add_1.png" width="15" height="15" alt="新增" title="新增">
            </Button>
             <Button  style="border: none; background-color: transparent;  margin-left: -10px; " onclick='showParams(${paramData})'>
              <img src="../edit.png" width="15" height="15" alt="修改" title="修改">
            </Button>
            <Button  style="border: none; background-color: transparent; margin-left: -10px ; " onclick='showParams(${paramData})'>
              <img src="../delete_2.png" width="15" height="15" alt="删除" title="删除">
            </Button>
        </div>
           `;

  };

  /* region 升级服务 一 */
  const firstUpSerGridApi = useRef<GridApi>();
  const firstUpSerColumn = [
    {
      headerName: '上线环境',
      field: 'onlineDev'
    },
    {
      headerName: '发布项',
      field: 'pulishItem',
    },
    {
      headerName: '应用',
      field: 'app',
    },
    {
      headerName: '是否支持热更新',
      field: 'hotUpdate',
    },
    {
      headerName: '是否涉及接口与数据库升级',
      field: 'upgrade',
    },
    {
      headerName: '分支和环境',
      field: 'branchAndDev',
    },
    {
      headerName: '编辑人',
      field: 'editor',
    },
    {
      headerName: '编辑时间',
      field: 'editeTime',
    },
    {
      headerName: '说明',
      field: 'desc',
    },
    {
      headerName: '备注',
      field: 'remark',
    },
    {
      headerName: '操作',
      cellRenderer: operateRenderer
    }];

  const onFirstGridReady = (params: GridReadyEvent) => {
    firstUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangeFirstGridReady = (params: GridReadyEvent) => {
    firstUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion  */

  /* region 升级服务 二  */
  const secondUpSerColumn = [
    {
      headerName: '上线环境',
      field: 'onlineDev',
    },
    {
      headerName: '升级接口',
      field: 'upgradeInte',
    },
    {
      headerName: '接口服务',
      field: 'intService',
    },
    {
      headerName: '是否支持热更新',
      field: 'hotUpdate',
    },
    {
      headerName: '接口Method',
      field: 'intMethod',
    },
    {
      headerName: '接口URL',
      field: 'intURL',
    },
    {
      headerName: '编辑人',
      field: 'editor',
    },
    {
      headerName: '编辑时间',
      field: 'editeTime',
    },
    {
      headerName: '涉及租户',
      field: 'tenant',
    },
    {
      headerName: '备注',
      field: 'remark',
    },
    {
      headerName: '操作',
      cellRenderer: operateRenderer
    }];
  const secondUpSerGridApi = useRef<GridApi>();
  const onSecondGridReady = (params: GridReadyEvent) => {
    secondUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangeSecondGridReady = (params: GridReadyEvent) => {
    secondUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion   */

  /* region 升级服务 三  */

  const ChangRowColor = (params: any) => {
    if (params.data?.onlineDev === "集群1") {

      // 上下设置颜色
      return {'background-color': '#FFF6F6'};

    }
    return {'background-color': 'transparent'};
  };

  const thirdUpSerColumn = [
    {
      headerName: '前端值班',
      field: 'onlineDev',
    },
    {
      headerName: '服务确认完成',
      // checkboxSelection: true,
      minWidth: 110,
      field: 'upgradeInte',
      // cellRenderer: () => {
      //   return ` <input style="color: red;margin-top: -10px;" type="checkbox" value="" />`;
      // }
    },
    {
      headerName: '确认时间',
      field: 'intService',
    },
    {
      headerName: '后端值班',
      field: 'hotUpdate',
    },
    {
      headerName: '服务确认完成',
      field: 'intMethod',
    },
    {
      headerName: '确认时间',
      field: 'intURL',
    },
    {
      headerName: '流程确认',
      field: 'editor',
    },
    {
      headerName: '服务确认完成',
      field: 'editeTime',
    },
    {
      headerName: '确认时间',
      field: 'tenant',
    },
    {
      headerName: '测试值班',
      field: '服务确认完成',
    },
    {
      headerName: '确认时间',
      field: 'confirmTime',
    }];
  const thirdUpSerGridApi = useRef<GridApi>();
  const onthirdGridReady = (params: GridReadyEvent) => {
    thirdUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangeThirdGridReady = (params: GridReadyEvent) => {
    thirdUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion   */

  /*  region 数据修复 Review 一 */

  const firstDataReviewColumn = [
    {
      headerName: '序号',
      field: 'onlineDev',
    },
    {
      headerName: '把数据修复内容',
      field: 'upgradeInte',
    },
    {
      headerName: '涉及租户',
      field: 'intService',
    },
    {
      headerName: '类型',
      field: 'hotUpdate',
    },
    {
      headerName: '修复提交人',
      field: 'intMethod',
    },
    {
      headerName: '分支',
      field: 'intURL',
    },
    {
      headerName: '编辑人',
      field: 'editor',
    },
    {
      headerName: '编辑时间',
      field: 'editeTime',
    },
    {
      headerName: '评审结果',
      field: 'tenant',
    },
    {
      headerName: '是否可重复执行',
      field: '服务确认完成',
    },
    {
      headerName: '操作',
      cellRenderer: operateRenderer
    }];
  const firstDataReviewGridApi = useRef<GridApi>();
  const onfirstDataReviewGridReady = (params: GridReadyEvent) => {
    firstDataReviewGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangefirstDataReviewGridReady = (params: GridReadyEvent) => {
    firstDataReviewGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion */

  /*  region 数据修复 Review 二 */

  const secondDataReviewColumn = [
    {
      headerName: '后端值班',
      field: 'hotUpdate',
    },
    {
      headerName: '服务确认完成',
      field: 'intMethod',
    },
    {
      headerName: '确认时间',
      field: 'intURL',
    }];
  const secondDataReviewGridApi = useRef<GridApi>();
  const onsecondDataReviewGridReady = (params: GridReadyEvent) => {
    secondDataReviewGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangesecondDataReviewGridReady = (params: GridReadyEvent) => {
    secondDataReviewGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion */

  /*  region 上线分支 */

  // 渲染单元测试运行是否通过字段
  const rendererUnitTest = (params: any) => {

    const values = params.value;
    console.log(values);
    let resultDiv = ``;

    resultDiv = `
    <div style="margin-top: -10px">
        <div style=" margin-top: 20px;font-size: 10px">
            <div>前端： <label style="color: red"> 否</label> &nbsp;09:58:12~09:59:12</div>
            <div style="margin-top: -20px"> 后端： <label style="color: forestgreen"> 是</label> &nbsp;09:58:12~09:59:12</div>
        </div>

    </div>
    `;
    return resultDiv;
  };

  // 渲染上线前版本检查是否通过
  const beforeOnlineVersionCheck = () => {
    let resultDiv = ``;

    resultDiv = `
    <div style="margin-top: -10px">
        <div style="text-align: right" >

            <Button  style="margin-left: -10px; border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick=''>
              <img src="../excute.png" width="14" height="14" alt="执行参数" title="执行参数">
            </Button>
            <Button  style="margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick=''>
              <img src="../url.png" width="14" height="14" alt="执行参数" title="执行参数">
            </Button>
        </div>

        <div style=" margin-top: -20px;font-size: 10px">
            <div>前端： <label style="color: red"> 否</label> &nbsp;09:58:12~09:59:12</div>
            <div style="margin-top: -20px"> 后端： <label style="color: forestgreen"> 是</label> &nbsp;09:58:12~09:59:12</div>
        </div>

    </div>
    `;
    return resultDiv;

  };


  const firstOnlineBranchColumn: any = [
    {
      headerName: '序号',
      field: 'No',
      maxWidth: 80,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '分支名称',
      field: 'branchName',
      maxWidth: 115,
    },
    {
      headerName: '技术侧',
      field: 'module',
      maxWidth: 100,
    },
    {
      headerName: '单元测试运行是否通过',
      field: 'passUnitTest',
      cellRenderer: rendererUnitTest,
      minWidth: 190,
    },
    {
      headerName: '上线前版本检查是否通过',
      field: 'passVersionCheck',
      cellRenderer: beforeOnlineVersionCheck,
      minWidth: 190,
    },
    {
      headerName: '上线前数据库环境检查是否通过',
      field: 'passDBCheck',
    },
    {
      headerName: '上线前自动化检查是否通过',
      field: 'passAutoCheckbf',
    },
    {
      headerName: '升级后自动化检查是否通过',
      field: 'passAutoCheckaf',
    },
    {
      headerName: '封板状态',
      field: 'sealStatus',
    },
    {
      headerName: '操作',
      cellRenderer: operateRenderer
    }];
  const firstOnlineBranchGridApi = useRef<GridApi>();
  const onfirstOnlineBranchGridReady = (params: GridReadyEvent) => {
    firstOnlineBranchGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangefirstOnlineBranchGridReady = (params: GridReadyEvent) => {
    firstOnlineBranchGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion */

  /*  region 对应工单 */

  const firstListColumn = [
    {
      headerName: '序号',
      field: 'hotUpdate',
    },
    {
      headerName: '工单类型',
      field: 'intMethod',
    },
    {
      headerName: '工单编号',
      field: 'intURL',
    },
    {
      headerName: '审批名称',
      field: 'intURL',
    },
    {
      headerName: '审批说明',
      field: 'intURL',
    },
    {
      headerName: '申请人',
      field: 'intURL',
    },
    {
      headerName: '创建时间',
      field: 'intURL',
    },
    {
      headerName: '更新时间',
      field: 'intURL',
    },
    {
      headerName: '工单状态',
      field: 'intURL',
    },
    {
      headerName: '上步已审批人',
      field: 'intURL',
    }, {
      headerName: '当前待审批人',
      field: 'intURL',
    }];
  const firstListGridApi = useRef<GridApi>();
  const onfirstListGridReady = (params: GridReadyEvent) => {
    firstListGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangefirstListGridReady = (params: GridReadyEvent) => {
    firstListGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion */

  /* endregion */

  /* region  预发布项目 */
  const [formForDutyNameModify] = Form.useForm();

  const projectsArray = useRequest(() => loadPrjNameSelect()).data;

  // 保存预发布项目
  const saveProjects = () => {
    const datas = formForDutyNameModify.getFieldsValue();
    savePrePulishProjects(datas);
  };

  /* endregion */

  /* region Tabs 标签页事件 */

  const initialPanes = [
    {
      title: `${currentDate}灰度预发布1`,
      content: "",
      key: '1',
      closable: false
    },
    {
      title: `${currentDate}灰度预发布2`,
      content: "",
      key: '2',
      closable: false
    }];
  const [tabContent, setTabContent] = useState({
    activeKey: initialPanes[0].key,
    panes: initialPanes
  });

  // 新增tab
  const add = () => {
    const {panes} = tabContent;
    const tabCount = panes.length;
    const activeKey = `index_${tabCount + 1}`;
    panes.push({
      title: `${currentDate}灰度预发布${tabCount + 1}`,
      content: "",
      key: activeKey,
      closable: true
    });
    setTabContent({panes, activeKey});
    firstUpSerGridApi.current?.setRowData([{
      onlineDev: "集群2",
      pulishItem: "前端",
      app: "web",
      hotUpdate: "是",
      upgrade: "否",
      branchAndDev: "emergency_nx-hotfix",
      desc: "",
      remark: ""
    }]);
    secondUpSerGridApi.current?.setRowData([{
      onlineDev: "集群2",
      upgradeInte: "前端接口",
      intService: "basebi",
      hotUpdate: "是",
      intMethod: "get",
      intURL: "/basebi/Evaluate/......",
      tenant: "全量用户",
      remark: ""
    }]);
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


    firstUpSerGridApi.current?.setRowData([{
      onlineDev: "集群4444",
      pulishItem: "前端",
      app: "web",
      hotUpdate: "是",
      upgrade: "否",
      branchAndDev: "emergency_nx-hotfix",
      desc: "",
      remark: ""
    }]);
    secondUpSerGridApi.current?.setRowData([{
      onlineDev: "集群44444",
      upgradeInte: "前端接口",
      intService: "basebi",
      hotUpdate: "是",
      intMethod: "get",
      intURL: "/basebi/Evaluate/......",
      tenant: "全量用户",
      remark: ""
    }]);

  };

  /* endregion */

  const {data} = useRequest(() => loadPrjNameSelect());

  const showProject = () => {
    firstUpSerGridApi.current?.setRowData([{
      onlineDev: "集群1",
      pulishItem: "前端",
      app: "web",
      hotUpdate: "是",
      upgrade: "否",
      branchAndDev: "emergency_nx-hotfix",
      desc: "",
      remark: ""
    }]);
    secondUpSerGridApi.current?.setRowData([{
      onlineDev: "集群1",
      upgradeInte: "前端接口",
      intService: "basebi",
      hotUpdate: "是",
      intMethod: "get",
      intURL: "/basebi/Evaluate/......",
      tenant: "全量用户",
      remark: ""
    }]);
    thirdUpSerGridApi.current?.setRowData([{
      onlineDev: "集群1",

      intService: "basebi",
      hotUpdate: "是",
      intMethod: "get",
      intURL: "/basebi/Evaluate/......",
      tenant: "全量用户",
      remark: ""
    }]);

    firstOnlineBranchGridApi.current?.setRowData([{
      branchName: "release",
      module: "前后端",
      passUnitTest: {"前端": "是", "后端": "否"},
      passVersionCheck: {"前端": "是", "后端": "否"},
      passDBCheck: "否",
      passAutoCheckbf: "未开始",
      passAutoCheckaf: "未开始",
      sealStatus: {"前端": "已封版", "后端": "未封板"},
    }])
    // 先显示第一个界面的数据
    formForDutyNameModify.setFieldsValue({
      projectsName: "测试"
    });
  };


  useEffect(() => {
    showProject();

  }, [data]);

  return (
    <PageContainer style={{marginTop: -30}}>

      {/* Tabs 标签,固定在上面 */}
      <div>
        <Tabs
          type="editable-card"
          activeKey={tabContent.activeKey}
          onChange={onChange}
          onEdit={(targetKey, action) => {
            onEdits(targetKey, action)
          }}
          style={{marginTop: -20}}
        >
          {tabContent.panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key} closable={pane.closable}> </TabPane>
          ))}
        </Tabs>
      </div>

      {/* 其他控件 */}
      <div style={{marginTop: -10, backgroundColor: "white"}}>
        {/* 用于占位 */}
        <div style={{height: 5}}></div>

        {/* 检查总览 */}
        <div style={{marginLeft: 5}}>

          <label style={{fontWeight: "bold"}}>检查总览：</label>
          <label>
            <button style={{height: 13, width: 13, border: "none", backgroundColor: "#2BF541"}}></button>
            &nbsp;预发布项目已填写完成
          </label>

          <label style={{marginLeft: 15}}>
            <button style={{height: 13, width: 13, border: "none", backgroundColor: "#2BF541"}}></button>
            &nbsp;升级服务已确认完成
          </label>

          <label style={{marginLeft: 15}}>
            <button style={{height: 13, width: 13, border: "none", backgroundColor: "#2BF541"}}></button>
            &nbsp;数据Review确认完成
          </label>

          <label style={{marginLeft: 15}}>
            <button style={{height: 13, width: 13, border: "none", backgroundColor: "Gainsboro"}}></button>
            &nbsp;上线前检查已完成
          </label>

          <label style={{marginLeft: 15}}>
            <label style={{fontWeight: "bold"}}>发布状态总览：</label>
            未完成
          </label>

          <label style={{marginLeft: 15}}>
            <label style={{fontWeight: "bold"}}>发布结果：</label>
            <Select size={"small"} style={{width: 100}}>
              <Option value="">空</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
          </label>

        </div>

        {/* 预发布项目 */}
        <div>
          <fieldset className={"fieldStyle"}>
            <legend className={"legendStyle"}>Step1 预发布项目</legend>

            <div style={{marginBottom: -20, marginTop: -5}}>


              <div style={{float: "right"}}>
                <Button type="primary"
                        style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5, marginLeft: 10}}
                        onClick={saveProjects}>点击保存 </Button>
              </div>

              <div>
                <Form form={formForDutyNameModify}>
                  <Row>
                    <Col span={9}>

                      {/* 项目名称 */}
                      <Form.Item label="项目名称:" name="projectsName">
                        <Select showSearch mode="multiple">
                          {projectsArray}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={5}>

                      {/* 发布类型 */}
                      <Form.Item label="发布类型:" name="pulishType" style={{marginLeft: 5}}>
                        <Select>

                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={5}>

                      {/* 发布方式 */}
                      <Form.Item label="发布方式:" name="pulishMethod" style={{marginLeft: 5}}>
                        <Select>

                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={5}>
                      {/* 发布时间 */}
                      <Form.Item label="发布时间:" name="pulishTime" style={{marginLeft: 5}}>
                        <DatePicker style={{width: "100%"}}/>
                      </Form.Item>
                    </Col>

                  </Row>

                </Form>
              </div>
            </div>

            {/* 编辑人信息 */}
            <div style={{marginTop: 5}}>
              <label> 编辑人：罗天刚</label>
              <label style={{marginLeft: 20}}> 编辑时间：2021-12-08 16：10：40</label>
            </div>

          </fieldset>
        </div>

        {/* 升级服务 */}
        <div>
          <fieldset className={"fieldStyle"}>
            <legend className={"legendStyle"}>Step2 升级服务</legend>

            <div>

              <div>

                <div style={{height: 35, marginTop: -15, overflow: "hidden"}}>
                  <Row>
                    <Col span={9}>

                      {/* 测试环境 */}
                      <Form.Item label="测试环境:" name="projectsName">
                        <Select showSearch mode="multiple" size={"small"} style={{width: '100%'}}>

                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>

                      {/* 一键部署ID */}
                      <Form.Item label="一键部署ID:" name="pulishType" style={{marginLeft: 10}}>
                        <Select mode="multiple" size={"small"} style={{width: '100%'}} showSearch>

                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={7}>

                      <Button size={"small"} type="primary"
                              style={{
                                color: '#46A0FC',
                                backgroundColor: "#ECF5FF",
                                borderRadius: 5,
                                marginLeft: 10,
                                marginTop: 3
                              }}>点击查询</Button>
                    </Col>

                  </Row>


                </div>

                <div>

                  <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>
                    <AgGridReact

                      columnDefs={firstUpSerColumn} // 定义列
                      // rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                      }}
                      headerHeight={25}
                      rowHeight={25}
                      onGridReady={onFirstGridReady}
                      onGridSizeChanged={onChangeFirstGridReady}
                      onColumnEverythingChanged={onChangeFirstGridReady}
                    >
                    </AgGridReact>
                  </div>

                  <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>

                    <AgGridReact
                      columnDefs={secondUpSerColumn} // 定义列
                      // rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                      }}
                      getRowStyle={ChangRowColor}
                      headerHeight={25}
                      rowHeight={25}
                      onGridReady={onSecondGridReady}
                      onGridSizeChanged={onChangeSecondGridReady}
                      onColumnEverythingChanged={onChangeSecondGridReady}
                    >
                    </AgGridReact>

                  </div>

                </div>

              </div>

              <div>
                <div style={{fontWeight: "bold"}}> 服务确认完成</div>

                <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>

                  <AgGridReact
                    columnDefs={thirdUpSerColumn} // 定义列
                    // rowData={[]} // 数据绑定
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      suppressMenu: true,
                      cellStyle: {"line-height": "25px"},
                    }}
                    headerHeight={25}
                    rowHeight={25}
                    onGridReady={onthirdGridReady}
                    onGridSizeChanged={onChangeThirdGridReady}
                    onColumnEverythingChanged={onChangeThirdGridReady}
                  >
                  </AgGridReact>

                </div>
              </div>

              {/*  提示标签 */}
              <div style={{fontSize: "smaller", marginTop: 10}}>
                1、先选择【构建环境】，在选择【一键部署ID】，点击查询按钮，自动获取并展示发布的应用集合；
                <br/>
                2、发布项为前端、后端、流程时，分支和环境提供上线分支/测试环境，说明填写更新服务；
                <br/>
                3、发布项为前端镜像、后端镜像、流程镜像时，分支和环境提供镜像版本号，说明填写提供镜像/版本名称；
                <br/>
                4、发布项为接口时，分支和环境处提供具体接口，说明填写method：接口升级，租户升级说明。
              </div>

            </div>


          </fieldset>
        </div>

        {/* 数据修复Review */}
        <div>
          <fieldset className={"fieldStyle"}>
            <legend className={"legendStyle"}>Step3 数据修复Review</legend>

            <div>

              <div>
                {/* ag-grid 表格 */}
                <div>
                  <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>
                    <AgGridReact

                      columnDefs={firstDataReviewColumn} // 定义列
                      // rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                      }}
                      headerHeight={25}
                      rowHeight={25}
                      onGridReady={onfirstDataReviewGridReady}
                      onGridSizeChanged={onChangefirstDataReviewGridReady}
                      onColumnEverythingChanged={onChangefirstDataReviewGridReady}
                    >
                    </AgGridReact>
                  </div>
                </div>
              </div>

              <div>
                <div style={{fontWeight: "bold"}}> Review确认完成</div>

                <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>

                  <AgGridReact
                    columnDefs={secondDataReviewColumn} // 定义列
                    // rowData={[]} // 数据绑定
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      suppressMenu: true,
                      cellStyle: {"line-height": "25px"},
                    }}
                    headerHeight={25}
                    rowHeight={25}
                    onGridReady={onsecondDataReviewGridReady}
                    onGridSizeChanged={onChangesecondDataReviewGridReady}
                    onColumnEverythingChanged={onChangesecondDataReviewGridReady}
                  >
                  </AgGridReact>

                </div>
              </div>

            </div>
          </fieldset>
        </div>

        {/* 上线分支 */}
        <div>
          <fieldset className={"fieldStyle"}>
            <legend className={"legendStyle"}>Step4 上线分支</legend>

            <div>
              {/* ag-grid 表格 */}
              <div>
                <div className="ag-theme-alpine" style={{height: 150, width: '100%'}}>
                  <AgGridReact

                    columnDefs={firstOnlineBranchColumn} // 定义列
                    // rowData={[]} // 数据绑定
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      suppressMenu: true,
                      autoHeight: true,
                    }}
                    headerHeight={25}
                    onGridReady={onfirstOnlineBranchGridReady}
                    onGridSizeChanged={onChangefirstOnlineBranchGridReady}
                    onColumnEverythingChanged={onChangefirstOnlineBranchGridReady}
                  >
                  </AgGridReact>
                </div>
              </div>
              <div style={{fontSize: "smaller", marginTop: 10}}>
                1、版本检查、环境一致性检查、自动化检查，默认开启自动检查，每个小时检查1次，可关闭自动检查，在需要的时间节点，点击手动触发按钮，进行按需检查；
                <br/>
                2、检查状态分为：是、否、检查中、未开始、忽略等5种状态；
                <br/>
                3、点击检查日志链接，可以进入检查的详情页面。
              </div>
            </div>

          </fieldset>
        </div>

        {/* 对应工单 */}
        <div>
          <fieldset className={"fieldStyle"}>
            <legend className={"legendStyle"}>Step5 对应工单</legend>
            <div>
              <div>
                {/* ag-grid 表格 */}
                <div>
                  <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>
                    <AgGridReact

                      columnDefs={firstListColumn} // 定义列
                      // rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                      }}
                      headerHeight={25}
                      rowHeight={25}
                      onGridReady={onfirstListGridReady}
                      onGridSizeChanged={onChangefirstListGridReady}
                      onColumnEverythingChanged={onChangefirstListGridReady}
                    >
                    </AgGridReact>
                  </div>
                </div>
              </div>
            </div>
            <div style={{fontSize: "smaller", marginTop: 10}}>
              注：根据预发布批次号每隔2分钟定时从运维平台同步一次相关工单信息
            </div>
          </fieldset>
        </div>

      </div>
    </PageContainer>
  );
};

export default PreRelease;
