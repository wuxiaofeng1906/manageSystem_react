import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import moment from 'moment';
import {Button, message, Form, DatePicker, Select, Modal, Input, Row, Col} from 'antd';
import {FolderAddTwoTone, EditTwoTone, DeleteTwoTone} from '@ant-design/icons';
import {getRecentMonth} from '@/publicMethods/timeMethods';
import axios from 'axios';
import {Link} from 'umi';
import {history} from 'umi';

const {RangePicker} = DatePicker;
const {Option} = Select;

// 默认条件：近一个月；未关闭的
const queryCondition: any = {
  projectName: "",
  projectType: [],
  dateRange: getRecentMonth(),
  projectStatus: ['wait', 'doing', 'suspended'],
};

let orgPrjname = "";
let delCounts = 0;

const testTiaozhaun = () => {
  console.log("222");
  history.push(`/sprint/sprintListDetails`);
};

// 定义列名
const colums = () => {

  const component = new Array();
  component.push(
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 50,
      'pinned': 'left'
    },
    {
      headerName: '序号',
      maxWidth: 80,
      filter: false,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '项目名称',
      field: 'name',
      minWidth: 200,
      cellRenderer: (params: any) => {
        return ` <button onClick={testTiaozhaun}>${params.value}</button>`;
        // return `<a style="color:blue;text-decoration: underline" onclick= {history.push("/sprint/sprintListDetails")} >${params.value}</a>`;
        // return `<div><Link to="/sprint/sprintListDetails">${params.value}</Link></div>`;
        // return `<a target="_blank" style="color:blue;text-decoration: underline" href='/sprint/sprintListDetails'>${params.value}</a>`;
        // return `<a href="/sprint/sprintListDetails" style="color:blue;text-decoration: underline" >${params.value}</a>`;
      },
    },
    {
      headerName: '来源类型',
      field: 'type',
      cellRenderer: (params: any) => {
        if (params.value === "AUTO") {
          return "自动创建";
        }
        return "人工创建";
      },
    }, {
      headerName: '开始时间',
      field: 'startAt',
    },
    {
      headerName: '提测截止日期',
      field: 'testEnd',
    }, {
      headerName: '测试完成日期',
      field: 'testFinish',
    }, {
      headerName: '计划灰度日期',
      field: 'expStage',
    }, {
      headerName: '计划上线日期',
      field: 'expOnline',
    }, {
      headerName: '创建日期',
      field: 'createAt',
    }, {
      headerName: '创建人',
      field: 'creator',
    }, {
      headerName: '项目状态',
      field: 'status',
      cellRenderer: (params: any) => {
        let returnValue = "";
        switch (params.value) {
          case  "closed":
            returnValue = "已关闭";
            break;
          case  "wait":
            returnValue = "未开始";
            break;
          case "doing":
            returnValue = "进行中";
            break;

          case "suspended":
            returnValue = "已挂起";
            break;
          default:
            returnValue = params.value;
            break;
        }

        return returnValue;
      },
    }, {
      headerName: '访问禅道',
      field: 'ztId',
      cellRenderer: (params: any) => {
        return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://172.31.1.219:8384/zentao/project-task-${params.value}.html'>去禅道</a>`;
      }
    },
  );

  return component;
};


// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {

  const range = `{start:"${params.dateRange.start}", end:"${params.dateRange.end}"}`;
  const {data} = await client.query(`
      {
         project(name:"${params.projectName}",category:[${params.projectType}], range:${range},status:[${params.projectStatus}]){
          id
          name
          type
          startAt
          testEnd
          testFinish
          expStage
          expOnline
          creator
          status
          createAt
          ztId
        }
      }
  `);
  return data?.project;
};

// 查询是否有重复数据
const queryRepeats = async (client: GqlClient<object>, prjName: string) => {

  const {data} = await client.query(`
      {
        proExist(name:"${prjName}"){
          ok
          data{
            id
            name
            type
            startAt
            testEnd
            testFinish
            expStage
            expOnline
            creator
            status
            createAt
            ztId
          }
          code
          message
        }
      }
  `);

  console.log("data", data);
  return data?.proExist;
};

// 组件初始化
const SprintList: React.FC<any> = () => {


    /* 整个模块都需要用到的 */
    const [formForAddAnaMod] = Form.useForm();
    const [formForDel] = Form.useForm();

    /* region  表格相关事件 */
    const gridApi = useRef<GridApi>();   // 绑定ag-grid 组件
    const gqlClient = useGqlClient();
    const {data, loading} = useRequest(() =>
      queryDevelopViews(gqlClient, queryCondition),
    );

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    if (gridApi.current) {
      if (loading) gridApi.current.showLoadingOverlay();
      else gridApi.current.hideOverlay();
    }

    /* endregion */

    /* region 条件查询功能 */

    const updateGrid = async () => {
      const datas: any = await queryDevelopViews(gqlClient, queryCondition);
      gridApi.current?.setRowData(datas);
    };

    // 项目名称输入事件
    const projectChanged = async (params: any) => {

      // console.log("projectName", params.nativeEvent.data);  // 为当时输入的值
      // console.log("finally",params.target.value);  // 为输入框的值

      queryCondition.projectName = params.target.value;
      updateGrid();
      // const datas: any = await queryDevelopViews(gqlClient, queryCondition);
      // gridApi.current?.setRowData(datas);
    };


    // 项目类型选择事件
    const prjTypeChanged = async (value: any, params: any) => {
      console.log(value, params);
      queryCondition.projectType = value;
      updateGrid();
      // const datas: any = await queryDevelopViews(gqlClient, queryCondition);
      // gridApi.current?.setRowData(datas);

    };

    // 时间选择事件
    const onTimeSelected = async (params: any) => {

      queryCondition.dateRange = {
        start: moment(params[0]).format('YYYY-MM-DD'),
        end: `${moment(params[1]).format('YYYY-MM-DD')} 23:59:59`
      };
      updateGrid();
      // const datas: any = await queryDevelopViews(gqlClient, queryCondition);
      // gridApi.current?.setRowData(datas);
    };

    // 选择项目状态
    const prjStatusChanged = async (value: any, params: any) => {
      console.log(value, params);
      queryCondition.projectStatus = value;
      updateGrid();
      // const datas: any = await queryDevelopViews(gqlClient, queryCondition);
      // gridApi.current?.setRowData(datas);
    };

    /* endregion */

    /* region 显示默认数据  */

    const showDefalultValue = async () => {

      const defalutCondition: any = {
        projectName: "",
        projectType: [],
        dateRange: getRecentMonth(),
        projectStatus: ["wait", "doing", "suspended"],
      };
      const datas: any = await queryDevelopViews(gqlClient, defalutCondition);
      gridApi.current?.setRowData(datas);
    };

    /* endregion */

    /* region 新增功能 */

    // 添加项目
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [modal, setmodal] = useState({title: "新增项目"});
    const addProject = () => {
      const currentDate = moment(new Date()).add('year', 0);
      formForAddAnaMod.setFieldsValue({
        prjNames: null,
        prjDate: moment(currentDate, "YYYY-MM-DD"),
        starttime: moment(currentDate, "YYYY-MM-DD"),
        testCutoff: moment(currentDate, "YYYY-MM-DD"),
        testFinnished: moment(currentDate, "YYYY-MM-DD"),
        planOnline: moment(currentDate, "YYYY-MM-DD"),
        planHuidu: moment(currentDate, "YYYY-MM-DD"),
        prjStatus: null
      });

      setmodal({"title": "新增项目"});
      // 赋值给控件
      setIsAddModalVisible(true);

    };

    // 时间选择后，检查数据库有无，有的话需要禁用某些控件
    const [isAble, setisAble] = useState({shown: false});

    const formTimeSelected = async () => {
      const values = formForAddAnaMod.getFieldsValue();
      const prjName = `${values.prjNames}${values.prjDate.format("YYYYMMDD")}`;
      const datas: any = await queryRepeats(gqlClient, prjName);
      // 时间选择后禁用某些控件
      if (datas.ok === true) {   // 可以新增项目
        setisAble({"shown": false});
        formForAddAnaMod.setFieldsValue({
          prjLable: "",
        });
      } else {
        setisAble({"shown": true});
        formForAddAnaMod.setFieldsValue({
          prjLable: "重复项目",
          // prjStatus: data.data.status  // data 可能没有数据
        });
      }
    };

    /* endregion */

    /* region 修改功能  */
    // 修改项目
    const modifyProject = () => {
      const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      // 没有选中则提醒
      if (selRows.length === 0) {
        message.error({
          content: '请选中需要修改的数据!',
          className: 'modifyNone',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      // 一次只能修改一条数据
      if (selRows.length > 1) {
        message.error({
          content: '一次只能修改一条数据!',
          className: 'modifyMore',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      const detailsInfo = selRows[0];
      console.log("detailsInfo", detailsInfo);
      const prjNames = detailsInfo.name.toString();
      orgPrjname = prjNames;
      let projectType = "";
      let prjTime = "";
      if (prjNames.indexOf('sprint') !== -1) {
        projectType = "sprint";
      } else if (prjNames.indexOf('emergency') !== -1) {
        projectType = "emergency";
      } else if (prjNames.indexOf('hotfix') !== -1) {
        projectType = "hotfix";
      }
      prjTime = prjNames.replace(projectType, "").trim();

      formForAddAnaMod.setFieldsValue({
        prjNames: projectType,
        prjDate: moment(prjTime, "YYYY-MM-DD"),
        starttime: moment(detailsInfo.startAt, "YYYY-MM-DD"),
        testCutoff: moment(detailsInfo.testEnd, "YYYY-MM-DD"),
        testFinnished: moment(detailsInfo.testFinish, "YYYY-MM-DD"),
        planHuidu: moment(detailsInfo.expStage, "YYYY-MM-DD"),
        planOnline: moment(detailsInfo.expOnline, "YYYY-MM-DD"),
        prjStatus: detailsInfo.status,
        prjId: detailsInfo.id
      });

      setmodal({"title": "修改项目"});
      setIsAddModalVisible(true);

    };

    /* endregion */

    /* region 修改和新增公用的commit方法 */

    // 新增和修改弹出层取消按钮事件
    const handleCancel = () => {
      setIsAddModalVisible(false);
    };


    // sprint 项目保存
    const commitSprint = async () => {
      const values = formForAddAnaMod.getFieldsValue();
      const prjtype = values.prjNames;
      if (prjtype === null) {
        message.error({
          content: '项目类型不能为空!',
          className: 'AddNone',
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      if (values.prjStatus === null) {
        message.error({
          content: '项目状态不能为空!',
          className: 'AddNone',
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      const prjdate = values.prjDate.format("YYYYMMDD");
      const datas = {
        "name": `${prjtype}${prjdate}`,
        "type": "MANUAL",
        "startAt": values.starttime.format("YYYY-MM-DD"),
        "endAt": values.testCutoff.format("YYYY-MM-DD"),
        "finishAt": values.testFinnished.format("YYYY-MM-DD"),
        "stageAt": values.planHuidu.format("YYYY-MM-DD"),
        "onlineAt": values.planOnline.format("YYYY-MM-DD"),
        "status": values.prjStatus,
        "creator": "admin"
      };

      //  判断是修改还是新增
      if (modal.title === "新增项目") {
        axios.post('/api/sprint/project', datas).then(function (res) {

          if (res.data.ok === true) {
            setIsAddModalVisible(false);
            updateGrid();
            message.info({
              content: res.data.message,
              className: 'AddSuccess',
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}${res.data.zt.message.end[0]}`,
              className: 'AddNone',
              style: {
                marginTop: '50vh',
              },
            });
          }
        }).catch(function (error) {
          // console.log("error", error);
          message.error({
            content: error.toString(),
            className: 'AddError',
            style: {
              marginTop: '50vh',
            },
          });
        });

      } else {

        datas["id"] = values.prjId;
        if (orgPrjname === datas["name"]) {
          datas["name"] = "";
        }
        axios.put('/api/sprint/project', datas).then(function (res) {
          if (res.data.ok === true) {
            setIsAddModalVisible(false);

            message.info({
              content: res.data.message,
              className: 'ModSuccess',
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}${res.data.zt.message.end[0]}`,
              className: 'ModNone',
              style: {
                marginTop: '50vh',
              },
            });
          }
        }).catch(function (error) {
          message.error({
            content: error.toString(),
            className: 'ModError',
            style: {
              marginTop: '50vh',
            },
          });
        });
      }
    };


    /* endregion */

    /* region 删除功能 */
    // 删除sprint列表
    const [isdelModalVisible, setIsDelModalVisible] = useState(false);
    // 删除按钮点击
    const deleteSprintList = () => {
      // 判断是否选中数据
      const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行

      if (selRows.length === 0) {
        message.error({
          content: '请选中需要删除的数据!',
          className: 'delNone',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      if (selRows.length > 1) {
        message.error({
          content: '一次只能删除一条数据!',
          className: 'delMore',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      const detailsInfo = selRows[0];
      const prjNames = detailsInfo.name;
      // 首先查询这个里面有多少条数据，根并进行具体提示。
      delCounts = 1;
      console.log("prjNames", prjNames);
      setIsDelModalVisible(true);
      // Modal.confirm({
      //   title: '删除项目',
      //   // icon: <ExclamationCircleOutlined/>,
      //   content: `此项目包含【${delCounts}】条数据，请确认是否删除？`,
      //   okText: '确认',
      //   cancelText: '取消',
      //   centered: true,
      //   onOk: () => {
      //     console.log("确认删除！");
      //
      //   }
      // });
    };

    const delSprintList = () => {
      const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      const prjNames = selRows[0].name;

      console.log("删除项目：", prjNames);
    };

    const DelCancel = () => {
      setIsDelModalVisible(false);
    };
    /* endregion */


    const rightStyle = {marginLeft: "30px"};
    const leftStyle = {marginLeft: "120px"};
    const widths = {width: "150px"};


    // 返回渲染的组件
    return (
      <PageContainer>


        {/* 查询条件 */}
        <div style={{width: "100%", overflow: "auto", whiteSpace: "nowrap"}}>
          {/*<button onClick={testTiaozhaun}>跳转测试</button>*/}

          {/*<div><Link to="/sprint/sprintListDetails">跳转测试</Link></div>*/}
          <Form.Item name="prjName">
            <label style={{marginLeft: "10px"}}>项目名称：</label>
            <Input placeholder="请输入" style={{"width": "18%"}} allowClear={true} onChange={projectChanged}/>
            {/* <Select placeholder="请选择" mode="tags" style={{width: '18%'}} onChange={prjTypeHandleChange} */}
            {/*        tokenSeparators={[',']}> {[ */}
            {/*  <Option key={"emergency20201223"} value={"emergency20201223"}>emergency20201223 </Option> */}
            {/* ]} */}
            {/* </Select> */}

            <label style={{marginLeft: "10px"}}>项目类型：</label>
            <Select placeholder="请选择" mode="tags" style={{width: '18%'}} onChange={prjTypeChanged}> {
              [
                <Option key={"sprint"} value={"sprint"}>sprint </Option>,
                <Option key={"hotfix"} value={"hotfix"}>hotfix </Option>,
                <Option key={"emergency"} value={"emergency"}>emergency </Option>,
              ]
            }
            </Select>

            <label style={{marginLeft: "10px"}}>时间：</label>
            <RangePicker className={"times"} style={{width: '18%'}}
                         defaultValue={[moment(getRecentMonth().start), moment()]} onChange={onTimeSelected}/>

            <label style={{marginLeft: "10px"}}>项目状态：</label>
            <Select placeholder="请选择" mode="tags" style={{width: '18%'}} onChange={prjStatusChanged}
                    defaultValue={['doing', 'suspended', 'wait']}>{
              [
                <Option key={"closed"} value={"closed"}>已关闭 </Option>,
                <Option key={"doing"} value={"doing"}>进行中 </Option>,
                <Option key={"suspended"} value={"suspended"}>已挂起 </Option>,
                <Option key={"wait"} value={"wait"}>未开始 </Option>
              ]
            }
            </Select>
          </Form.Item>
        </div>

        {/* 新增、修改、删除按钮栏 */}
        <div style={{"background": "white"}}> {/* 使用一个图标就要导入一个图标 */}
          <Button type="text" style={{"color": "black"}} size={"large"} onClick={showDefalultValue}> 默认：</Button>
          <label style={{"color": "black"}}> 近1月未关闭的</label>
          {/* <Button type="text" style={{"color": "black"}} disabled={true} size={"large"}> 近1月未关闭的 </Button> */}

          <Button type="text" style={{"color": "black", float: "right"}} icon={<FolderAddTwoTone/>}
                  size={"large"} onClick={deleteSprintList}>删除 </Button>

          <Button type="text" style={{"color": "black", float: "right"}} icon={<EditTwoTone/>}
                  size={"large"} onClick={modifyProject}> 修改 </Button>

          <Button type="text" style={{"color": "black", float: "right"}} icon={<DeleteTwoTone/>}
                  size={"large"} onClick={addProject}> 新增 </Button>
        </div>

        {/* ag-grid 表格定义 */}
        <div className="ag-theme-alpine" style={{height: 1000, width: '100%'}}>

          <AgGridReact
            columnDefs={colums()} // 定义列
            rowData={data} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              // floatingFilter: true,
              filter: true,
              flex: 1,
              minWidth: 100,
            }}
            autoGroupColumnDef={{
              minWidth: 100,
            }}
            groupDefaultExpanded={9} // 展开分组
            // suppressDragLeaveHidesColumns // 取消分组时，例如单击删除区域中某一列上的“ x” ，该列将不可见
            // suppressMakeColumnVisibleAfterUnGroup // 如果用户在移动列时不小心将列移出了网格，但并不打算将其隐藏，那么这就很方便。
            // rowGroupPanelShow="always"
            onGridReady={onGridReady}
          >
          </AgGridReact>
        </div>

        {/* 弹出层定义 */}
        <Modal
          title={modal.title}
          visible={isAddModalVisible} onCancel={handleCancel}
          centered={true} footer={null} width={700}>

          <Form form={formForAddAnaMod}>

            <Row gutter={16} style={{marginBottom: "-20px"}}>
              <Col className="gutter-row">
                <div style={rightStyle}>
                  <Form.Item label="项目名称：">
                    <Input.Group compact>
                      <Form.Item name="prjNames">
                        <Select id={"prjNames"} placeholder="请选择类型" style={{width: '150px'}}> {
                          [
                            <Option key={"sprint"} value={"sprint"}>sprint </Option>,
                            <Option key={"hotfix"} value={"hotfix"}>hotfix </Option>,
                            <Option key={"emergency"} value={"emergency"}>emergency </Option>,
                          ]
                        }
                        </Select>
                      </Form.Item>

                      <Form.Item name="prjDate">
                        <DatePicker onChange={formTimeSelected}/>
                      </Form.Item>
                      <Form.Item name="prjLable">
                        <input style={{marginLeft: '10px', color: "red", border: "none", backgroundColor: "transparent"}}
                               disabled={true}/>
                      </Form.Item>
                      <Form.Item name="prjId">
                        <label style={{display: "none"}}></label>
                      </Form.Item>

                    </Input.Group>
                  </Form.Item>

                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={rightStyle}>

                  <Form.Item name="starttime" label="开始时间">
                    <DatePicker style={widths} allowClear={false}/>
                  </Form.Item>

                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="testCutoff" label="提测截止">
                    <DatePicker style={widths} allowClear={false}/>
                  </Form.Item>

                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={rightStyle}>

                  <Form.Item name="testFinnished" label="测试完成：">
                    <DatePicker style={widths} allowClear={false}/>
                  </Form.Item>

                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="planHuidu" label="计划灰度：">
                    <DatePicker style={widths} allowClear={false}/>
                  </Form.Item>

                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={rightStyle}>

                  <Form.Item name="planOnline" label="计划上线：">
                    <DatePicker style={widths} allowClear={false}/>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="prjStatus" label="项目状态:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}>已关闭 </Option>,
                        <Option key={"doing"} value={"doing"}>进行中 </Option>,
                        <Option key={"suspended"} value={"suspended"}>已挂起 </Option>,
                        <Option key={"wait"} value={"wait"}>未开始 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
            </Row>

            <Form.Item style={{marginTop: "50px"}}>
              <Button type="primary" style={{marginLeft: "250px"}} disabled={isAble.shown}
                      onClick={commitSprint}>确定</Button>
              <Button type="primary" style={{marginLeft: "20px"}} onClick={handleCancel}>取消</Button>
            </Form.Item>
          </Form>

        </Modal>


        <Modal title={"删除项目"} visible={isdelModalVisible} onCancel={DelCancel} centered={true} footer={null} width={500}>

          <Form form={formForDel}>
            <Form.Item>
              <label style={{marginLeft: "20px"}}>
                此项目包含【{delCounts}】条数据，请确认是否删除？
              </label>
            </Form.Item>

            <Form.Item>
              <Button type="primary" style={{marginLeft: "150px"}} disabled={isAble.shown}
                      onClick={delSprintList}>确定</Button>
              <Button type="primary" style={{marginLeft: "20px"}} onClick={DelCancel}>取消</Button>
            </Form.Item>
          </Form>

        </Modal>


      </PageContainer>
    );

  }
;

export default SprintList;
