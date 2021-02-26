import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient, useQuery} from '@/hooks';
import {Button, message, Form, Select, Modal, Input, Row, Col} from 'antd';
import {
  FolderAddTwoTone,
  SnippetsTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  CloseSquareTwoTone,
  CheckSquareTwoTone
} from '@ant-design/icons';
import {history} from 'umi';
import {
  numberRenderToYesNo,
  numberRenderTopass,
  numberRenderToCurrentStage,
  numberRenderToZentaoType,
  numberRenderToZentaoSeverity,
  numberRenderToZentaoStatus,
  numberRenderToSource,
  linkToZentaoPage
} from '@/publicMethods/cellRenderer';
import axios from "axios";

const {Option} = Select;

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
      maxWidth: 80,
      filter: false,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    }, {
      headerName: '当前阶段',
      field: 'stage',
      cellRenderer: numberRenderToCurrentStage
    }, {
      headerName: '测试负责人填写',
      children: [
        {
          headerName: '对应测试',
          field: 'tester'
        }, {
          headerName: '禅道类型',
          field: 'category',
          cellRenderer: numberRenderToZentaoType
        }, {
          headerName: '禅道编号',
          field: 'ztNo',
          cellRenderer: linkToZentaoPage
        },
      ]
    }, {
      headerName: '禅道自动实时获取',
      children: [
        {
          headerName: '标题内容',
          field: 'title'
        }, {
          headerName: '严重程度',
          field: 'severity',
          cellRenderer: numberRenderToZentaoSeverity
        }, {
          headerName: '优先级',
          field: 'priority'
        }, {
          headerName: '所属模块',
          field: 'moduleName'
        }, {
          headerName: '禅道状态',
          field: 'ztStatus',
          cellRenderer: numberRenderToZentaoStatus
        }, {
          headerName: '相关需求数',
          field: '',
        }, {
          headerName: '相关任务数',
          field: '',
        }, {
          headerName: '相关bug数',
          field: '',
        }, {
          headerName: '指派给',
          field: 'assignedTo'
        }, {
          headerName: '由谁解决/完成',
          field: 'finishedBy'
        }, {
          headerName: '由谁关闭',
          field: 'closedBy'
        },
      ]
    }, {
      headerName: '开发经理填写',
      children: [{
        headerName: '是否支持热更新',
        field: 'hotUpdate',
        cellRenderer: numberRenderToYesNo
      }, {
        headerName: '是否有数据升级',
        field: 'dataUpdate',
        cellRenderer: numberRenderToYesNo
      }, {
        headerName: '是否有接口升级',
        field: 'interUpdate',
        cellRenderer: numberRenderToYesNo
      }, {
        headerName: '是否有预置数据修改',
        field: 'presetData',
        cellRenderer: numberRenderToYesNo
      }, {
        headerName: '是否需要测试验证',
        field: 'testCheck',
        cellRenderer: numberRenderToYesNo
      }, {
        headerName: '验证范围建议',
        field: 'scopeLimit'
      }, {
        headerName: '发布环境',
        field: 'publishEnv'
      },
      ]
    }, {
      headerName: 'UED填写',
      children: [{
        headerName: '对应UED',
        field: 'uedName'
      }, {
        headerName: 'UED测试环境验证',
        field: 'uedEnvCheck',
        cellRenderer: numberRenderTopass
      }, {
        headerName: 'UED线上验证',
        field: 'uedOnlineCheck',
        cellRenderer: numberRenderTopass
      },
      ]
    }, {
      headerName: '测试/UED填写',
      children: [
        {
          headerName: '备注',
          field: 'memo'
        }, {
          headerName: '来源',
          field: 'source',
          cellRenderer: numberRenderToSource

        },
      ]
    }, {
      headerName: '自动生成',
      children: [{
        headerName: '反馈人',
        field: 'feedback'
      }]
    }
  );

  return component;
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  const {data} = await client.query(`
      {
         proDetail(project:${params}){
            id
            stage
            tester
            category
            ztNo
            title
            severity
            priority
            moduleName
            ztStatus
            assignedTo
            finishedBy
            closedBy
            hotUpdate
            dataUpdate
            interUpdate
            presetData
            testCheck
            scopeLimit
            publishEnv
            uedName
            uedEnvCheck
            uedOnlineCheck
            memo
            source
            feedback
            expectTest
            submitTest
            activeDuration
            solveDuration
            verifyDuration
            closedDuration
            relatedBugs
            relatedTasks
            relatedStories
          }
      }
  `);
  return data?.proDetail;
};

// 组件初始化
const SprintList: React.FC<any> = () => {

    /* 获取网页的项目id */
    let prjId: string = "";
    const location = history.location.query;
    if (location !== undefined && location.projectid !== null) {
      prjId = location.projectid.toString();
    }

    /* 整个模块都需要用到的 */
    // admin 新增和修改from表单
    const [formForAdminToAddAnaMod] = Form.useForm();
    // 开发经理修改from表单
    const [formForManagerToMod] = Form.useForm();
    // 测试修改from表单
    const [formForTesterToMod] = Form.useForm();
    // UED修改from表单
    const [formForUEDToMod] = Form.useForm();
    // 删除提醒表单
    const [formForDel] = Form.useForm();

    /* region  表格相关事件 */
    const gridApi = useRef<GridApi>();   // 绑定ag-grid 组件
    const gqlClient = useGqlClient();
    const {data, loading} = useRequest(() =>
      queryDevelopViews(gqlClient, prjId),
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

    /* region 其他 */
    const updateGrid = async () => {
      const datas: any = await queryDevelopViews(gqlClient, prjId);
      gridApi.current?.setRowData(datas);
    };
    // 获取部门数据
    const GetDeptMemner = (params: any) => {
      const deptMan = [];

      const {data: {WxDeptUsers = []} = {}} = useQuery(`
          {
            WxDeptUsers(deptNames:["${params}"]){
               id
              userName
            }
          }
      `);
      for (let index = 0; index < WxDeptUsers.length; index += 1) {
        deptMan.push(
          <Option key={WxDeptUsers[index].id} value={WxDeptUsers[index].id}>{WxDeptUsers[index].userName} </Option>
        );
      }
      return deptMan;
    };

    /* endregion */

    /* region 新增功能 */

    // 隐藏
    //   const [isChandaoInfoEdit, setChandaoInfoEdit] = useState({isEdit: true});
    // setChandaoInfoEdit({isEdit: true});

    // 失去焦点后查询值
    const checkZentaoInfo = (params: any) => {
      const ztno = params.target.value;
      const addFormData = formForAdminToAddAnaMod.getFieldsValue();
      const chanDaoType = addFormData.adminChandaoType;
      if (chanDaoType === "") {
        message.error({
          content: `禅道类型不能为空！`,
          className: 'ModNone',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      if (ztno === "") {
        message.error({
          content: `禅道编号不能为空！`,
          className: 'ModNone',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      axios.get('/api/sprint/project/child', {
        params: {
          project: prjId,
          category: chanDaoType,
          ztNo: ztno
        }
      }).then(function (res) {
        if (res.data.ok === true) {
          const queryDatas = res.data.ztRecord;

          formForAdminToAddAnaMod.setFieldsValue({
            adminAddChandaoTitle: queryDatas.title,
            adminAddSeverity: numberRenderToZentaoSeverity({value: queryDatas.severity === null ? "" : queryDatas.severity.toString()}),
            adminAddPriority: queryDatas.priority,
            adminAddModule: queryDatas.module,
            adminAddChandaoStatus: queryDatas.ztStatus,
            adminAddAssignTo: queryDatas.assignedTo,
            adminAddSolvedBy: queryDatas.finishedBy,
            adminAddClosedBy: queryDatas.closedBy,
          });
        } else {
          if (res.data.code === "404") {
            message.error({
              content: `禅道不存在ID为${ztno}的${chanDaoType}`,
              className: 'ModNone',
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}`,
              className: 'ModNone',
              style: {
                marginTop: '50vh',
              },
            });
          }
          formForAdminToAddAnaMod.setFieldsValue({
            adminAddChandaoTitle: "",
            adminAddSeverity: "",
            adminAddPriority: "",
            adminAddModule: "",
            adminAddChandaoStatus: "",
            adminAddAssignTo: "",
            adminAddSolvedBy: "",
            adminAddClosedBy: "",
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

    };

    // 添加项目
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [modal, setmodal] = useState({title: "新增明细行"});
    const addProject = () => {
      formForAdminToAddAnaMod.setFieldsValue({
        adminCurStage: "",
        adminAddTester: "",
        adminChandaoType: "",
        adminChandaoId: "",
        adminAddChandaoTitle: "",
        adminAddSeverity: "",
        adminAddPriority: "",
        adminAddModule: "",
        adminAddChandaoStatus: "",
        adminAddAssignTo: "",
        adminAddSolvedBy: "",
        adminAddClosedBy: "",
        adminAddHotUpdate: "",
        adminAddDataUpgrade: "",
        adminAddInteUpgrade: "",
        adminAddPreData: "",
        adminAddtesterVerifi: "",
        adminAddSuggestion: "",
        adminAddEnvironment: "",
        adminAddForUED: "",
        adminAddForUedVerify: "",
        adminAdminUedOnline: "",
        // adminAddSource: "",
        adminAddFeedbacker: "",
        adminAddRemark: ""

      });

      setmodal({"title": "新增明细行"});
      // 赋值给控件
      setIsAddModalVisible(true);

    };

    /* endregion */

    /* region 修改功能  */

    const [isformForManagerToModVisible, setformForManagerToModVisible] = useState(false);
    const [isformForTesterToModVisible, setformForTesterToModVisible] = useState(false);
    const [isformForUEDToModVisible, setformForUEDToModVisible] = useState(false);

    /* admin 权限操作 */
    // 新增和修改弹出层取消按钮事件
    const handleCancel = () => {
      setIsAddModalVisible(false);
    };


    // sprint 项目保存

    const addCommitDetails = (datas: any) => {
      axios.post('/api/sprint/project/child', datas).then(function (res) {

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
            content: `${res.data.message}`,
            className: 'AddNone',
            style: {
              marginTop: '50vh',
            },
          });
        }
      }).catch(function (error) {
        message.error({
          content: error.toString(),
          className: 'AddError',
          style: {
            marginTop: '50vh',
          },
        });
      });
    };

    const modCommitDetails = (datas: any) => {
      axios.put('/api/sprint/project/child', datas).then(function (res) {
        if (res.data.ok === true) {
          setIsAddModalVisible(false);
          updateGrid();
          message.info({
            content: res.data.message,
            className: 'ModSuccess',
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: `${res.data.message}`,
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

    };

    const commitSprintDetails = () => {
      const oradata = formForAdminToAddAnaMod.getFieldsValue();

      if (oradata.adminChandaoType === "" || oradata.adminChandaoId === "") {
        message.error({
          content: `禅道类型和禅道编号不能为空！`,
          className: 'MNone',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      const datas = {
        "tester": oradata.adminAddTester,
        "category": oradata.adminChandaoType,
        "ztNo": oradata.adminChandaoId,
        "hotUpdate": oradata.adminAddHotUpdate,
        "dataUpdate": oradata.adminAddDataUpgrade,
        "interUpdate": oradata.adminAddInteUpgrade,
        "presetData": oradata.adminAddPreData,
        "testCheck": oradata.adminAddtesterVerifi,
        "scopeLimit": oradata.adminAddSuggestion,
        "publish": oradata.adminAddEnvironment,
        "uedName": oradata.adminAddForUED,
        "uedEnvCheck": oradata.adminAddForUedVerify,
        "uedOnlineCheck": oradata.adminAdminUedOnline,
        "source": 7,
        "feedback": oradata.adminAddFeedbacker,
        "memo": oradata.adminAddRemark,
      };

      if (modal.title === "新增明细行") {
        // 新增使用的是project id
        datas["project"] = prjId;
        addCommitDetails(datas);
      } else {
        const curRow: any = gridApi.current?.getSelectedRows(); // 获取选中的行
        // 修改使用的是明细 id
        datas["id"] = curRow[0].id;
        modCommitDetails(datas);
      }
    };

    // admin 修改
    const adminModify = (datas: any) => {
      formForAdminToAddAnaMod.setFieldsValue({
        adminCurStage: numberRenderToCurrentStage({value: datas.stage === null ? "" : datas.stage.toString()}),
        adminAddTester: datas.tester,
        adminChandaoType: datas.category,
        adminChandaoId: datas.ztNo,
        adminAddChandaoTitle: datas.title,
        adminAddSeverity: datas.severity,
        adminAddPriority: datas.priority,
        adminAddModule: datas.moduleName,
        adminAddChandaoStatus: numberRenderToZentaoStatus({value: datas.ztStatus === null ? "" : datas.ztStatus.toString()}),
        adminAddAssignTo: datas.assignedTo,
        adminAddSolvedBy: datas.finishedBy,
        adminAddClosedBy: datas.closedBy,
        adminAddHotUpdate: datas.hotUpdate,
        adminAddDataUpgrade: datas.dataUpdate,
        adminAddInteUpgrade: datas.interUpdate,
        adminAddPreData: datas.presetData,
        adminAddtesterVerifi: datas.testCheck,
        adminAddSuggestion: datas.scopeLimit,
        adminAddEnvironment: datas.publishEnv,
        adminAddForUED: datas.uedName,
        adminAddForUedVerify: datas.uedEnvCheck,
        adminAdminUedOnline: datas.uedOnlineCheck,
        adminAddSource: datas.source,
        adminAddFeedbacker: datas.feedback,
        adminAddRemark: datas.memo

      });
      setmodal({"title": "修改明细行(admin)"});
      setIsAddModalVisible(true);
    };

    /* 开发经理 权限操作 */
    // 开发经理（开发）manager 修改
    const managerModify = () => {
      setformForManagerToModVisible(true);
    };

    // 开发经理弹出层取消
    const mangerHandleCancel = () => {
      setformForManagerToModVisible(false);

    };

    // 开发经理提交修改
    const commitManagerModify = () => {

    };

    /* 测试 权限操作 */
    // 测试 修改
    const testerModify = () => {
      setformForTesterToModVisible(true);
    };

    const testerHandleCancel = () => {
      setformForTesterToModVisible(false);
    };

    const commitTesterModify = () => {

    };


    /* UED 权限操作 */
    // UED 修改
    const uedModify = () => {
      setformForUEDToModVisible(true);
    };

    const UEDHandleCancel = () => {
      setformForUEDToModVisible(false);
    };


    const commitUedModify = () => {

    };

    // 修改按钮点击事件
    const btnModifyProject = () => {

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

      // 判断人员权限（admin，测试，开发经理（开发）,UED）
      let currentUser = "";
      currentUser = "admin";
      switch (currentUser) {
        case "admin":
          adminModify(detailsInfo);
          break;
        case "tester":
          testerModify();
          break;
        case "manager":
          managerModify();
          break;
        case "UED":
          uedModify();
          break;
        default:
          break;
      }
    };


    /* endregion */

    /* region 删除功能 */

    // 删除sprint列表
    const [isdelModalVisible, setIsDelModalVisible] = useState(false);
    // 删除按钮点击
    const deleteSprintDetails = () => {
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

    /* region 移动功能 */

    const moveProject = () => {
      console.log("项目移动");
    };
    /* endregion */

    /* region 操作流程 */
    // 流程-取消
    const flowForCancle = () => {

    };
    // 流程-开发已revert
    const flowForDevRevert = () => {

    };

    // 流程-测试已验revert
    const flowForTestRevert = () => {

    };
    // 流程-灰度已验
    const flowForHuiduChecked = () => {

    };
    // 流程-线上已验证
    const flowForOnlineChecked = () => {

    };
    /* endregion */

    const leftStyle = {marginLeft: "20px"};
    const widths = {width: "200px", color: "black"};

    return (
      <PageContainer>

        {/* 新增、修改、删除按钮栏 */}
        <div style={{"background": "white"}}> {/* 使用一个图标就要导入一个图标 */}

          {/* 明细操作按钮 */}
          <Button type="text" style={{"color": "black"}} icon={<FolderAddTwoTone/>}
                  size={"large"} onClick={addProject}> 新增 </Button>
          <Button type="text" style={{"color": "black"}} icon={<EditTwoTone/>}
                  size={"large"} onClick={btnModifyProject}> 修改 </Button>
          <Button type="text" style={{"color": "black"}} icon={<DeleteTwoTone/>}
                  size={"large"} onClick={deleteSprintDetails}>删除 </Button>
          <Button type="text" style={{"color": "black"}} icon={<SnippetsTwoTone/>}
                  size={"large"} onClick={moveProject}> 移动 </Button>

          {/* 操作流程按钮 */}

          <Button type="text" style={{"color": "black", float: "right"}} icon={<CheckSquareTwoTone/>}
                  size={"large"} onClick={flowForOnlineChecked}>线上已验证 </Button>
          <Button type="text" style={{"color": "black", float: "right"}} icon={<CheckSquareTwoTone/>}
                  size={"large"} onClick={flowForHuiduChecked}>灰度已验证 </Button>
          <Button type="text" style={{"color": "black", float: "right"}} icon={<CheckSquareTwoTone/>}
                  size={"large"} onClick={flowForTestRevert}>测试已验revert </Button>
          <Button type="text" style={{"color": "black", float: "right"}} icon={<CheckSquareTwoTone/>}
                  size={"large"} onClick={flowForDevRevert}> 开发已revert </Button>
          <Button type="text" style={{"color": "black", float: "right"}} icon={<CloseSquareTwoTone/>}
                  size={"large"} onClick={flowForCancle}> 取消 </Button>
          <label style={{marginTop: "10px", "color": "black", fontWeight: "bold", float: "right"}}> 操作流程:</label>

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
            rowSelection={"multiple"} // 设置多行选中
            groupDefaultExpanded={9} // 展开分组
            // suppressDragLeaveHidesColumns // 取消分组时，例如单击删除区域中某一列上的“ x” ，该列将不可见
            // suppressMakeColumnVisibleAfterUnGroup // 如果用户在移动列时不小心将列移出了网格，但并不打算将其隐藏，那么这就很方便。
            // rowGroupPanelShow="always"
            onGridReady={onGridReady}
          >
          </AgGridReact>
        </div>

        {/* admin新增和修改表单 */}
        <Modal title={modal.title} visible={isAddModalVisible} onCancel={handleCancel} centered={true} footer={null}
               width={1000}>

          {/* admin 权限组新增和修改的界面 */}
          <Form form={formForAdminToAddAnaMod}>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminCurStage" label="当前阶段:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"1"} value={"1"}>未开始 </Option>,
                        <Option key={"2"} value={"2"}>开发中 </Option>,
                        <Option key={"3"} value={"3"}>已提测 </Option>,
                        <Option key={"4"} value={"4"}>测试中 </Option>,
                        <Option key={"5"} value={"5"}>TE测试环境已验过 </Option>,
                        <Option key={"6"} value={"6"}>UED测试环境已验过 </Option>,
                        <Option key={"7"} value={"7"}>已取消 </Option>,
                        <Option key={"8"} value={"8"}>开发已revert </Option>,
                        <Option key={"9"} value={"9"}>测试已验证revert </Option>,
                        <Option key={"10"} value={"10"}>灰度已验过 </Option>,
                        <Option key={"11"} value={"11"}>线上已验过 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddTester" label="对应测试:">
                    <Select placeholder="请选择" style={widths}>{GetDeptMemner("测试")}
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminChandaoType" label="禅道类型：" rules={[{required: true}]}>
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"1"} value={"1"}>bug </Option>,
                        <Option key={"3"} value={"3"}>需求 </Option>,
                        <Option key={"2"} value={"2"}>task </Option>
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
                  <Form.Item name="adminChandaoId" label="禅道编号:" rules={[{required: true}]}>
                    <Input placeholder="请输入" style={widths} onBlur={checkZentaoInfo}/>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddChandaoTitle" label="标题内容:">
                    <Input disabled={true} style={{width: "510px", color: "black"}}/>

                  </Form.Item>

                </div>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSeverity" label="严重程度:">
                    <Select disabled={true} placeholder="请选择" style={widths}>{
                      [
                        <Option key={"1"} value={"1"}>P0 </Option>,
                        <Option key={"2"} value={"2"}>P1 </Option>,
                        <Option key={"3"} value={"3"}>P2 </Option>,
                        <Option key={"4"} value={"4"}>P3 </Option>,
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddPriority" label="优先级：">
                    <Select disabled={true} placeholder="请选择" style={widths}>{
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
                    <Input disabled={true} style={{width: "218px"}}/>
                  </Form.Item>
                </div>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddChandaoStatus" label="禅道状态:">
                    <Input disabled={true} style={widths}/>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddAssignTo" label="指派给:">
                    <Input disabled={true} style={widths}/>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSolvedBy" label="由谁解决/完成:">
                    <Input disabled={true} style={{width: "185px", color: "black"}}/>
                  </Form.Item>
                </div>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddClosedBy" label="由谁关闭:">
                    <Input disabled={true} style={widths}/>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddHotUpdate" label="是否支持热更新:">
                    <Select placeholder="请选择" style={{width: "150px"}}>{
                      [
                        <Option key={"1"} value={"1"}>是 </Option>,
                        <Option key={"0"} value={"0"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddDataUpgrade" label="是否有数据升级:">
                    <Select placeholder="请选择" style={{width: "170px"}}>{
                      [
                        <Option key={"1"} value={"1"}>是 </Option>,
                        <Option key={"0"} value={"0"}>否 </Option>
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
                    <Select placeholder="请选择" style={{width: "160px"}}>{
                      [
                        <Option key={"1"} value={"1"}>是 </Option>,
                        <Option key={"0"} value={"0"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddPreData" label="是否有预置数据:">
                    <Select placeholder="请选择" style={{width: "150px"}}>{
                      [
                        <Option key={"1"} value={"1"}>是 </Option>,
                        <Option key={"0"} value={"0"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddtesterVerifi" label="是否需要测试验证：">
                    <Select placeholder="请选择" style={{width: "155px"}}>{
                      [
                        <Option key={"1"} value={"1"}>是 </Option>,
                        <Option key={"0"} value={"0"}>否 </Option>
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
                        <Option key={"1"} value={"1"}>集群1</Option>,
                        <Option key={"2"} value={"2"}>集群2 </Option>,
                        <Option key={"3"} value={"3"}>集群3 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddForUED" label="对应UED：">

                    <Select placeholder="请选择" style={widths}>{GetDeptMemner("UED")}
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddForUedVerify" label="UED测试环境验证：">
                    <Select placeholder="请选择" style={{width: "158px"}}>{
                      [
                        <Option key={"1"} value={"1"}>验证通过 </Option>,
                        <Option key={"0"} value={"0"}>未通过 </Option>,
                        <Option key={"2"} value={"2"}>无需验证 </Option>
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
                        <Option key={"1"} value={"1"}>验证通过 </Option>,
                        <Option key={"0"} value={"0"}>未通过 </Option>,
                        <Option key={"2"} value={"2"}>无需验证 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSource" label="来源:">
                    <Select placeholder="请选择" defaultValue={["手工录入"]} disabled={true} style={widths}>{
                      [
                        <Option key={"6"} value={"6"}>禅道自动写入</Option>,
                        <Option key={"7"} value={"7"}>手工录入</Option>,
                        <Option key={"1"} value={"1"}>《产品hotfix申请》 </Option>,
                        <Option key={"2"} value={"2"}>《UED-hotfix申请》 </Option>,
                        <Option key={"3"} value={"3"}>《开发hotfix申请》 </Option>,
                        <Option key={"4"} value={"4"}>《emergency申请》 </Option>,
                        <Option key={"5"} value={"5"}>《开发热更新申请》 </Option>,
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddFeedbacker" label="反馈人:">
                    <Input style={{width: "230px"}}/>
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
              <Button type="primary" style={{marginLeft: "400px"}}
                      onClick={commitSprintDetails}>确定</Button>
              <Button type="primary" style={{marginLeft: "20px"}} onClick={handleCancel}>取消</Button>
            </Form.Item>

          </Form>
        </Modal>

        {/* 开发经理和开发修改表单 */}
        <Modal title="编辑明细行(开发)" visible={isformForManagerToModVisible} onCancel={mangerHandleCancel} centered={true}
               footer={null} width={750}>

          <Form form={formForManagerToMod}>
            <Row gutter={16}>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="managerChandaoType" label="禅道类型：">
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

              <Col className="gutter-row">
                <div style={{marginLeft: "50px"}}>
                  <Form.Item name="managerCHandaoID" label="禅道编号:">
                    <Input placeholder="请输入" style={widths}/>
                  </Form.Item>

                </div>
              </Col>

            </Row>
            <Row gutter={16}>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="managerTitle" label="标题内容:">
                    <Input disabled={true} style={{width: "540px", color: "black"}}/>

                  </Form.Item>

                </div>
              </Col>

            </Row>
            <Row gutter={16}>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="managerHotUpdate" label="是否支持热更新:">
                    <Select placeholder="请选择" style={{width: "150px"}}>{
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
                <div style={{marginLeft: "55px"}}>
                  <Form.Item name="managerDataUpgrade" label="是否有数据升级:">
                    <Select placeholder="请选择" style={{width: "170px"}}>{
                      [
                        <Option key={"1"} value={"1"}>是 </Option>,
                        <Option key={"0"} value={"0"}>否 </Option>
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
                  <Form.Item name="managerInteUpgrade" label="是否有接口升级：">
                    <Select placeholder="请选择" style={{width: "155px"}}>{
                      [
                        <Option key={"1"} value={"1"}>是 </Option>,
                        <Option key={"0"} value={"0"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: "50px"}}>
                  <Form.Item name="managerPreData" label="是否有预置数据:">
                    <Select placeholder="请选择" style={{width: "170px"}}>{
                      [
                        <Option key={"1"} value={"1"}>是 </Option>,
                        <Option key={"0"} value={"0"}>否 </Option>
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
                  <Form.Item name="managertesterVerifi" label="是否需要测试验证：">
                    <Select placeholder="请选择" style={{width: "150px"}}>{
                      [
                        <Option key={"1"} value={"1"}>是 </Option>,
                        <Option key={"0"} value={"0"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: "50px"}}>
                  <Form.Item name="managerEnvironment" label="发布环境:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"集群1"} value={"集群1"}>集群1</Option>,
                        <Option key={"集群2"} value={"集群2"}>集群2 </Option>,
                        <Option key={"集群3"} value={"集群3"}>集群3 </Option>
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
                  <Form.Item name="managerSuggestion" label="验证范围建议:">
                    <Input style={{width: "520px"}}/>
                  </Form.Item>
                </div>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="managerRevert" label="开发是否已Revert:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"closed"} value={"closed"}> </Option>,
                        <Option key={"closed2"} value={"closed2"}>是</Option>,
                        <Option key={"doing"} value={"doing"}>否 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

            </Row>

            <Form.Item style={{marginTop: "50px"}}>
              <Button type="primary" style={{marginLeft: "300px"}}
                      onClick={commitManagerModify}>确定</Button>
              <Button type="primary" style={{marginLeft: "20px"}} onClick={mangerHandleCancel}>取消</Button>
            </Form.Item>

          </Form>
        </Modal>

        {/* 测试修改表单 */}
        <Modal title="编辑明细行(测试)" visible={isformForTesterToModVisible} onCancel={testerHandleCancel} centered={true}
               footer={null} width={750}>

          <Form form={formForTesterToMod}>
            <Row gutter={16}>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="testerChandaoType" label="禅道类型：">
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

              <Col className="gutter-row">
                <div style={{marginLeft: "50px"}}>
                  <Form.Item name="testerCHandaoID" label="禅道编号:">
                    <Input placeholder="请输入" style={widths}/>
                  </Form.Item>

                </div>
              </Col>

            </Row>
            <Row gutter={16}>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="testerTitle" label="标题内容:">
                    <Input disabled={true} style={{width: "540px", color: "black"}}/>

                  </Form.Item>

                </div>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddChandaoStatus" label="禅道状态:">
                    <Input disabled={true} style={widths}/>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: "50px"}}>
                  <Form.Item name="testToTester" label="对应测试:">
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
                  <Form.Item name="testerRevert" label="revert后是否已验证：">
                    <Select placeholder="请选择" style={{width: "140px"}}>{
                      [
                        <Option key={"closed"} value={"closed"}> </Option>,
                        <Option key={"doing"} value={"doing"}>是 </Option>,
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
                  <Form.Item name="testerRemark" label="备 注:">
                    <Input style={{width: "570px"}}/>
                  </Form.Item>
                </div>
              </Col>

            </Row>

            <Form.Item style={{marginTop: "50px"}}>
              <Button type="primary" style={{marginLeft: "300px"}}
                      onClick={commitTesterModify}>确定</Button>
              <Button type="primary" style={{marginLeft: "20px"}} onClick={testerHandleCancel}>取消</Button>
            </Form.Item>

          </Form>
        </Modal>

        {/* UED修改表单 */}
        <Modal title="编辑明细行(UED)" visible={isformForUEDToModVisible} onCancel={UEDHandleCancel} centered={true}
               footer={null} width={750}>

          <Form form={formForUEDToMod}>
            <Row gutter={16}>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="uedChandaoType" label="禅道类型：">
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

              <Col className="gutter-row">
                <div style={{marginLeft: "50px"}}>
                  <Form.Item name="uedCHandaoID" label="禅道编号:">
                    <Input placeholder="请输入" style={widths}/>
                  </Form.Item>

                </div>
              </Col>

            </Row>
            <Row gutter={16}>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="uedTitle" label="标题内容:">
                    <Input disabled={true} style={{width: "540px", color: "black"}}/>
                  </Form.Item>

                </div>
              </Col>

            </Row>

            <Row gutter={16}>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="uedForUED" label="对应UED：">
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
                  <Form.Item name="uedForUedVerify" label="UED测试环境验证：">
                    <Select placeholder="请选择" style={{width: "180px"}}>{
                      [
                        <Option key={"1"} value={"1"}>验证通过 </Option>,
                        <Option key={"0"} value={"0"}>未通过 </Option>,
                        <Option key={"2"} value={"2"}>无需验证 </Option>
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
                  <Form.Item name="UedOnlineVerti" label="UED线上验证:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"1"} value={"1"}>验证通过 </Option>,
                        <Option key={"0"} value={"0"}>未通过 </Option>,
                        <Option key={"2"} value={"2"}>无需验证 </Option>
                      ]
                    }
                    </Select>
                  </Form.Item>

                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: "50px"}}>
                  <Form.Item name="uedSource" label="来 源:">
                    <Select placeholder="请选择" style={widths}>{
                      [
                        <Option key={"1"} value={"1"}>《产品hotfix申请》 </Option>,
                        <Option key={"2"} value={"2"}>《UED-hotfix申请》 </Option>,
                        <Option key={"3"} value={"3"}>《开发hotfix申请》 </Option>,
                        <Option key={"4"} value={"4"}>《emergency申请》 </Option>,
                        <Option key={"5"} value={"5"}>《开发热更新申请》 </Option>,
                        <Option key={"6"} value={"6"}> 禅道自动写入 </Option>,
                        <Option key={"7"} value={"7"}> 手工录入 </Option>,
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
                  <Form.Item name="uedRemark" label="备 注:">
                    <Input style={{width: "575px"}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Form.Item style={{marginTop: "50px"}}>
              <Button type="primary" style={{marginLeft: "300px"}}
                      onClick={commitUedModify}>确定</Button>
              <Button type="primary" style={{marginLeft: "20px"}} onClick={UEDHandleCancel}>取消</Button>
            </Form.Item>

          </Form>
        </Modal>

        {/* 删除项目 */}
        <Modal title={"删除项目"} visible={isdelModalVisible} onCancel={DelCancel} centered={true} footer={null} width={500}>

          <Form form={formForDel}>
            <Form.Item>
              <label style={{marginLeft: "20px"}}>
                此项目包含【{0}】条数据，请确认是否删除？
              </label>
            </Form.Item>

            <Form.Item>
              <Button type="primary" style={{marginLeft: "150px"}}
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
