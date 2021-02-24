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
import {FolderAddTwoTone, SnippetsTwoTone, DeleteTwoTone, EditTwoTone} from '@ant-design/icons';
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
          headerName: '指派给',
          field: 'athlete'
        }, {
          headerName: '由谁解决/完成',
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
        headerName: '是否有预置数据修改',
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

      children: [{
        headerName: '取消',
        field: 'athlete',
        'pinned': 'right',
        cellRenderer: (params: any) => {
          return "";
        }
      }, {
        headerName: '开发已revert',
        field: 'athlete',
        'pinned': 'right'
      }, {
        headerName: '测试已验revert',
        field: 'athlete',
        'pinned': 'right'
      }, {
        headerName: '灰度已验证',
        field: 'athlete',
        'pinned': 'right'
      }, {
        headerName: '线上已验证',
        field: 'athlete',
        'pinned': 'right'
      }]
    }
  );

  return component;
};


// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  console.log(client, params);
  const {data} = await client.query(`
      {
         project(name:"${params.projectName}",category:[${params.projectType}], range:${params},status:[${params.projectStatus}]){
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
  return [];
};

// 组件初始化
const SprintList: React.FC<any> = () => {
    unlisten();
    /* 整个模块都需要用到的 */
    const [formForAdminToAddAnaMod] = Form.useForm();
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

    /* region 新增功能 */

    // 添加项目
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [modal, setmodal] = useState({title: "新增明细"});
    const addProject = () => {
      const currentDate = moment(new Date()).add('year', 0);
      formForAdminToAddAnaMod.setFieldsValue({
        prjNames: null,
        prjDate: moment(currentDate, "YYYY-MM-DD"),
        starttime: moment(currentDate, "YYYY-MM-DD"),
        testCutoff: moment(currentDate, "YYYY-MM-DD"),
        testFinnished: moment(currentDate, "YYYY-MM-DD"),
        planOnline: moment(currentDate, "YYYY-MM-DD"),
        planHuidu: moment(currentDate, "YYYY-MM-DD"),
        prjStatus: null
      });

      setmodal({"title": "新增明细"});
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

      formForAdminToAddAnaMod.setFieldsValue({
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
    const commitSprintDetails = () => {
      const datatest = formForAdminToAddAnaMod.getFieldsValue();
      console.log("datatest", datatest);

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


    const rightStyle = {marginLeft: "20px"};
    const leftStyle = {marginLeft: "20px"};
    const widths = {width: "200px"};


    // 返回渲染的组件
    return (
      <PageContainer>

        {/* 新增、修改、删除按钮栏 */}
        <div style={{"background": "white"}}> {/* 使用一个图标就要导入一个图标 */}

          <Button type="text" style={{"color": "black"}} icon={<FolderAddTwoTone/>}
                  size={"large"} onClick={addProject}> 新增 </Button>
          <Button type="text" style={{"color": "black"}} icon={<EditTwoTone/>}
                  size={"large"} onClick={modifyProject}> 修改 </Button>
          <Button type="text" style={{"color": "black"}} icon={<DeleteTwoTone/>}
                  size={"large"} onClick={deleteSprintList}>删除 </Button>
          <Button type="text" style={{"color": "black"}} icon={<SnippetsTwoTone/>}
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
          title={modal.title}
          visible={isAddModalVisible} onCancel={handleCancel}
          centered={true} footer={null} width={1000}>

          {/* admin 权限组新增和修改的界面 */}
          <Form form={formForAdminToAddAnaMod}>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminCurStage" label="当前阶段:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}>未开始 </Option>,
                        <Option key={"doing"} value={"doing"}>开发中 </Option>,
                        <Option key={"suspended"} value={"suspended"}>已提测 </Option>,
                        <Option key={"wait"} value={"wait"}>测试中 </Option>,
                        <Option key={"wait"} value={"wait"}>TE测试环境已验过 </Option>,
                        <Option key={"wait"} value={"wait"}>UED测试环境已验过 </Option>,
                        <Option key={"wait"} value={"wait"}>已取消 </Option>,
                        <Option key={"wait"} value={"wait"}>开发已revert </Option>,
                        <Option key={"wait"} value={"wait"}>测试已验证revert </Option>,
                        <Option key={"wait"} value={"wait"}>灰度已验过 </Option>,
                        <Option key={"wait"} value={"wait"}>线上已验过 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddTester" label="对应测试:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}>tester1 </Option>,
                        <Option key={"wait"} value={"wait"}>tester2 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminChandaoType" label="禅道类型：">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}>bug </Option>,
                        <Option key={"doing"} value={"doing"}>需求 </Option>,
                        <Option key={"wait"} value={"wait"}>task </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminChandaoId" label="禅道编号:">
                    <Input placeholder="请输入" style={widths}/>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddChandaoTitle" label="标题内容:">
                    <Input style={{width: "510px"}}/>

                  </Form.Item>

                </div>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSeverity" label="严重程度:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}> </Option>,
                        <Option key={"closed2"} value={"closed2"}>P0 </Option>,
                        <Option key={"doing"} value={"doing"}>P1 </Option>,
                        <Option key={"suspended"} value={"suspended"}>P2 </Option>,
                        <Option key={"wait"} value={"wait"}>P3 </Option>,
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddPriority" label="优先级：">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}>1 </Option>,
                        <Option key={"doing"} value={"doing"}>2 </Option>,
                        <Option key={"wait"} value={"wait"}>3 </Option>,
                        <Option key={"wait"} value={"wait"}>4 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddModule" label="所属模块:">
                    <Input style={{width:"218px"}}/>
                  </Form.Item>
                </div>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddChandaoStatus" label="禅道状态:">
                    <Input style={widths}/>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddAssignTo" label="指派给:">
                    <Input style={widths}/>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSolvedBy" label="由谁解决/完成:">
                    <Input style={{width:"185px"}}/>
                  </Form.Item>
                </div>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddClosedBy" label="由谁关闭:">
                    <Input style={widths}/>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddHotUpdate" label="是否支持热更新:">
                    <Select placeholder="请选择" style={{width:"150px"}}>{
                      [
                        <Option key={"closed"} value={"closed"}>是 </Option>,
                        <Option key={"doing"} value={"doing"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddDataUpgrade" label="是否有数据升级:">
                    <Select placeholder="请选择" style={{width:"170px"}}>{
                      [
                        <Option key={"closed"} value={"closed"}>是 </Option>,
                        <Option key={"wait"} value={"wait"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddInteUpgrade" label="是否有接口升级：">
                    <Select placeholder="请选择" style={{width:"160px"}}>{
                      [
                        <Option key={"closed"} value={"closed"}>是 </Option>,
                        <Option key={"wait"} value={"wait"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddPreData" label="是否有预置数据:">
                    <Select placeholder="请选择" style={{width:"150px"}}>{
                      [
                        <Option key={"closed"} value={"closed"}>是 </Option>,
                        <Option key={"doing"} value={"doing"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddtesterVerifi" label="是否需要测试验证：">
                    <Select placeholder="请选择" style={{width:"155px"}}>{
                      [
                        <Option key={"closed"} value={"closed"}>是 </Option>,
                        <Option key={"wait"} value={"wait"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

            </Row>

            <Row gutter={16}>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSuggestion" label="验证范围建议:">
                    <Input style={{width: "790px"}}/>
                  </Form.Item>
                </div>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddEnvironment" label="发布环境:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}>集群1</Option>,
                        <Option key={"closed2"} value={"closed2"}>集群2 </Option>,
                        <Option key={"doing"} value={"doing"}>集群3 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddForUED" label="对应UED：">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}>UED1 </Option>,
                        <Option key={"doing"} value={"doing"}>UED2 </Option>,
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddForUedVerify" label="UED测试环境验证：">
                    <Select placeholder="请选择" style={{width: "158px"}}>{
                      [
                        <Option key={"closed"} value={"closed"}>验证通过 </Option>,
                        <Option key={"doing"} value={"doing"}>未通过 </Option>,
                        <Option key={"doin"} value={"doin"}>无需验证 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAdminUedOnline" label="UED线上验证:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}>验证通过 </Option>,
                        <Option key={"doing"} value={"doing"}>未通过 </Option>,
                        <Option key={"suspended"} value={"suspended"}>无需验证 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSource" label="来源:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}>产品hotfix申请 </Option>,
                        <Option key={"wait"} value={"wait"}>UED-hotfix申请 </Option>,
                        <Option key={"wait"} value={"wait"}>开发hotfix申请 </Option>,
                        <Option key={"wait"} value={"wait"}>emergency申请 </Option>,
                        <Option key={"wait"} value={"wait"}>开发热更新申请 </Option>,
                        <Option key={"wait"} value={"wait"}>禅道自动写入 </Option>,
                        <Option key={"wait"} value={"wait"}>手工录入 </Option>,
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddFeedbacker" label="反馈人:">
                    <Input style={{width:"230px"}}/>
                  </Form.Item>
                </div>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddRemark" label="备注:">
                    <Input style={{width: "860px"}}/>
                  </Form.Item>
                </div>
              </Col>

            </Row>

            <Form.Item style={{marginTop: "50px"}}>
              <Button type="primary" style={{marginLeft: "400px"}} disabled={isAble.shown}
                      onClick={commitSprintDetails}>确定</Button>
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
