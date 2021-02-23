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
import {history} from 'umi';

const {Option} = Select;
const unlisten = history.listen((location, action) => {
  console.log(location.pathname);
});

const queryCondition: any = {
  projectName: "",
  projectType: [],
  dateRange: [],
  projectStatus: [],
};

// 测试数据
const datasTest = [
  {
    id: 1,
    prjname: "emergency20201220",
    sourceType: "人工创建",
    starttime: "2021-01-01",
    end1: "2021-01-01",
    end2: "2021-01-01",
    plan1: "2021-01-01",
    plan2: "2021-01-01",
    create1: "2021-01-01",
    creater: "陈诺",
    status: "进行中",
    chandao: "禅道1"
  }, {
    id: 2,
    prjname: "emergency20201221",
    sourceType: "自动创建",
    starttime: "2021-01-02",
    end1: "2021-01-02",
    end2: "2021-01-02",
    plan1: "2021-01-02",
    plan2: "2021-01-02",
    create1: "2021-01-02",
    creater: "王丽萍",
    status: "未开始",
    chandao: "禅道2"
  }, {
    id: 3,
    prjname: "emergency20201222",
    sourceType: "人工创建",
    starttime: "2021-01-03",
    end1: "2021-01-03",
    end2: "2021-01-03",
    plan1: "2021-01-03",
    plan2: "2021-01-03",
    create1: "2021-01-03",
    creater: "陈欢",
    status: "进行中",
    chandao: "禅道3"
  }, {
    id: 4,
    prjname: "emergency20201223",
    sourceType: "自动创建",
    starttime: "2021-01-04",
    end1: "2021-01-04",
    end2: "2021-01-04",
    plan1: "2021-01-04",
    plan2: "2021-01-04",
    create1: "2021-01-04",
    creater: "吴晓凤",
    status: "已完成",
    chandao: "禅道4"
  }];

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
    }, {
      headerName: '序号',
      field: 'id',
      maxWidth: 50,
      filter: false
    }, {
      headerName: '当前阶段',
      field: 'prjname',
    }, {
      headerName: '测试负责人填写',
      children: [
        {
          headerName: '对应测试',
          field: 'athlete'
        }, {
          headerName: '禅道类型',
          field: 'athlete'
        }, {
          headerName: '禅道编号',
          field: 'athlete'
        },
      ]
    }, {
      headerName: '禅道自动实时获取',
      children: [
        {
          headerName: '标题内容',
          field: 'athlete'
        }, {
          headerName: '严重程度',
          field: 'athlete'
        }, {
          headerName: '优先级',
          field: 'athlete'
        }, {
          headerName: '所属模块',
          field: 'athlete'
        }, {
          headerName: '禅道状态',
          field: 'athlete'
        }, {
          headerName: '所处阶段',
          field: 'athlete'
        }, {
          headerName: '指派给',
          field: 'athlete'
        }, {
          headerName: '由谁解决',
          field: 'athlete'
        }, {
          headerName: '由谁关闭',
          field: 'athlete'
        },
      ]
    }, {
      headerName: '开发经理填写',
      children: [{
        headerName: '是否支持热更新',
        field: 'athlete'
      }, {
        headerName: '是否有数据升级',
        field: 'athlete'
      }, {
        headerName: '是否有接口升级',
        field: 'athlete'
      }, {
        headerName: '是否需要测试验证',
        field: 'athlete'
      }, {
        headerName: '验证范围建议',
        field: 'athlete'
      }, {
        headerName: '发布环境',
        field: 'athlete'
      },
      ]
    }, {
      headerName: 'UED填写',
      children: [{
        headerName: '对应UED',
        field: 'athlete'
      }, {
        headerName: 'UED测试环境验证',
        field: 'athlete'
      }, {
        headerName: 'UED线上验证',
        field: 'athlete'
      },
      ]
    }, {
      headerName: '测试/UED填写',
      children: [
        {
          headerName: '备注',
          field: 'athlete'
        }, {
          headerName: '来源',
          field: 'athlete'
        },
      ]
    }, {
      headerName: '自动生成',
      children: [{
        headerName: '反馈人',
        field: 'athlete'
      }]
    }, {
      headerName: '操作',
      field: 'athlete'
    }
  );

  return component;
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  // console.log(params.projectName, params.projectType, params.dateRange, params.projectStatus);
  console.log(client, params);
  return [];
};

// 组件初始化
const SprintList: React.FC<any> = () => {
    unlisten();
    /* 整个模块都需要用到的 */
    const [formForAddAnaMod] = Form.useForm();
    const [formForDel] = Form.useForm();

    /* region  表格相关事件 */
    const gridApi = useRef<GridApi>();   // 绑定ag-grid 组件
    const gqlClient = useGqlClient();
    const {data, loading} = useRequest(() =>
      queryDevelopViews(gqlClient, queryCondition),
    );
    console.log(data);
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    if (gridApi.current) {
      if (loading) gridApi.current.showLoadingOverlay();
      else gridApi.current.hideOverlay();
    }

    /* endregion */


    /* region 显示默认数据  */

    // 显示默认数据（近一个月未关闭数据）
    const showDefalultValue = () => {
      console.log("11");
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
    const formTimeSelected = (params: any) => {
      console.log("params", params);
      // debugger;
      // starttime = moment(params[0]).format('YYYY-MM-DD');
      // 时间选择后禁用某些控件
      setisAble({"shown": true});
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
      const prjNames = detailsInfo.prjname.toString();
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
        starttime: moment(detailsInfo.starttime, "YYYY-MM-DD"),
        testCutoff: moment(detailsInfo.end1, "YYYY-MM-DD"),
        testFinnished: moment(detailsInfo.end2, "YYYY-MM-DD"),
        planHuidu: moment(detailsInfo.plan1, "YYYY-MM-DD"),
        planOnline: moment(detailsInfo.plan2, "YYYY-MM-DD"),
        prjStatus: detailsInfo.status
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
    const commitSprint = () => {
      const datatest = formForAddAnaMod.getFieldsValue();
      console.log("datatest", datatest);
      console.log("保存项目！");
    };

    /* endregion */

    /* region 删除功能 */
    // 删除sprint列表
    const [isdelModalVisible, setIsDelModalVisible] = useState(false);
    // 删除按钮点击
    const deleteSprintList = () => {
      // 判断是否选中数据
      const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      // 没有选中则提醒
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

      // 一次只能修改一条数据
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
      const prjNames = detailsInfo.prjname.toString();
      // 首先查询这个里面有多少条数据，根并进行具体提示。

      console.log("prjNames", prjNames);

      // const delCounts = 0;
      setIsDelModalVisible(true);
      // Modal.confirm({
      //   title: '删除项目',
      //   icon: <ExclamationCircleOutlined/>,
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
      console.log("test");
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

        {/* 新增、修改、删除按钮栏 */}
        <div style={{"background": "white"}}> {/* 使用一个图标就要导入一个图标 */}

          <Button type="text" style={{"color": "black"}} icon={<DeleteTwoTone/>}
                  size={"large"} onClick={addProject}> 新增 </Button>
          <Button type="text" style={{"color": "black"}} icon={<FolderAddTwoTone/>}
                  size={"large"} onClick={deleteSprintList}>删除 </Button>
          <Button type="text" style={{"color": "black"}} icon={<EditTwoTone/>}
                  size={"large"} onClick={modifyProject}> 移动 </Button>
        </div>

        {/* ag-grid 表格定义 */}
        <div className="ag-theme-alpine" style={{height: 1000, width: '100%'}}>

          <AgGridReact
            columnDefs={colums()} // 定义列
            rowData={datasTest} // 数据绑定
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
          // title={[<div style={{
          //   height: "50px",
          //   marginTop: "-17px",
          //   marginRight: "-24px",
          //   marginBottom: "-17px",
          //   marginLeft: "-24px",
          //   backgroundColor: "lightskyblue"
          // }}>新增项目</div>]}
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
                        <Option key={"suspended"} value={"suspended"}>已暂停 </Option>,
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
                此项目包含【{0}】条数据，请确认是否删除？
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
