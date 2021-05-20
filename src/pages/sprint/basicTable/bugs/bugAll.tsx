import React, {useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient, useQuery} from '@/hooks';
import {PageHeader, Button, message, Form, Select, Modal, Input, Row, Col, DatePicker} from 'antd';
import {formatMomentTime} from '@/publicMethods/timeMethods';
import {
  FolderAddTwoTone,
  SnippetsTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  CloseSquareTwoTone,
  CheckSquareTwoTone,
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
  linkToZentaoPage,
} from '@/publicMethods/cellRenderer';
import axios from 'axios';
import moment from "moment";
import {getHeight} from '@/publicMethods/pageSet';


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
      pinned: 'left',
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
      headerName: '当前阶段',
      field: 'stage',
      cellRenderer: numberRenderToCurrentStage,
    },
    {
      headerName: '对应测试',
      field: 'tester',
    },
    {
      headerName: '禅道类型',
      field: 'category',
      cellRenderer: numberRenderToZentaoType,
    },
    {
      headerName: '禅道编号',
      field: 'ztNo',
      cellRenderer: linkToZentaoPage,
    },
    {
      headerName: '标题内容',
      field: 'title',
    },
    {
      headerName: '严重程度',
      field: 'severity',
      cellRenderer: numberRenderToZentaoSeverity,
    },
    {
      headerName: '优先级',
      field: 'priority',
    },
    {
      headerName: '所属模块',
      field: 'moduleName',
    },
    {
      headerName: '禅道状态',
      field: 'ztStatus',
      cellRenderer: numberRenderToZentaoStatus,
    },
    {
      headerName: '相关需求数',
      field: 'relatedStories',
    },
    {
      headerName: '相关任务数',
      field: 'relatedTasks',
    },
    {
      headerName: '指派给',
      field: 'assignedTo',
    },
    {
      headerName: '由谁解决',
      field: 'finishedBy',
    },
    {
      headerName: '由谁关闭',
      field: 'closedBy',
    },
    {
      headerName: '激活时长',
      field: 'activeTime',
    },
    {
      headerName: '解决时长',
      field: 'resolveTime',
    },
    {
      headerName: '回验时长',
      field: 'vertifyTime',
    },
    {
      headerName: '关闭时长',
      field: 'closeTime',
    },
    {
      headerName: '是否支持热更新',
      field: 'hotUpdate',
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '是否有数据升级',
      field: 'dataUpdate',
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '是否有接口升级',
      field: 'interUpdate',
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '是否有预置数据修改',
      field: 'presetData',
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '是否需要测试验证',
      field: 'testCheck',
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '验证范围建议',
      field: 'scopeLimit',
    },
    {
      headerName: '发布环境',
      field: 'publishEnv',
    },
    {
      headerName: '对应UED',
      field: 'uedName',
    },
    {
      headerName: 'UED测试环境验证',
      field: 'uedEnvCheck',
      cellRenderer: numberRenderTopass,
    },
    {
      headerName: 'UED线上验证',
      field: 'uedOnlineCheck',
      cellRenderer: numberRenderTopass,
    },
    {
      headerName: '备注',
      field: 'memo',
    },
    {
      headerName: '来源',
      field: 'source',
      cellRenderer: numberRenderToSource,
    },
    {
      headerName: '反馈人',
      field: 'feedback',
    },
  );

  return component;
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  const {data} = await client.query(`
      {
         proDetail(project:${params},category:"BUG"){
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

  console.log('data', data);
  return data?.proExist;
};

// 组件初始化
const SprintList: React.FC<any> = () => {
    /* 获取网页的项目id */

    const projectInfo = {
      prjId: "",
      prjNames: "",
    };

    const location = history.location.query;
    if (location !== undefined && location.projectid !== null) {
      projectInfo.prjId = location.projectid.toString();
      projectInfo.prjNames = location.project === null ? '' : location.project.toString();

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
    // 移动提醒表单
    const [formForMove] = Form.useForm();
    // 移动新增项目
    const [formForMoveAddAnaMod] = Form.useForm();


    /* region  表格相关事件 */
    const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
    const gqlClient = useGqlClient();
    const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, projectInfo.prjId));
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
      const datas: any = await queryDevelopViews(gqlClient, projectInfo.prjId);
      gridApi.current?.setRowData(datas);
    };
    // 获取部门数据
    const GetDeptMemner = (params: any) => {
      const deptMan = [];
      let deptMember;

      if (params === "all") {

        deptMember = `
          {
            WxDeptUsers{
               id
              userName
            }
          }
      `;
      } else {

        deptMember = `
          {
            WxDeptUsers(deptNames:${params}){
               id
              userName
            }
          }
      `;
      }

      const {data: {WxDeptUsers = []} = {}} = useQuery(deptMember);

      for (let index = 0; index < WxDeptUsers.length; index += 1) {
        deptMan.push(
          <Option value={WxDeptUsers[index].id}> {WxDeptUsers[index].userName}</Option>,
        );
      }
      return deptMan;
    };
    const GetSprintProject = () => {
      const projectArray = [];

      const {data: {project = []} = {}} = useQuery(`{
        project(range:{start:"2021-02-01", end:"2021-10-05 23:59:59"}){
        id
        name
      }
    }`);

      for (let index = 0; index < project.length; index += 1) {
        projectArray.push(
          <Option value={project[index].id.toString()}> {project[index].name}</Option>,
        );
      }
      return projectArray;
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
      if (chanDaoType === '') {
        message.error({
          content: `禅道类型不能为空！`,
          className: 'ModNone',
          duration: 1, // 1S 后自动关闭
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      if (ztno === '') {
        message.error({
          content: `禅道编号不能为空！`,
          className: 'ModNone',
          duration: 1, // 1S 后自动关闭
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      axios
        .get('/api/sprint/project/child', {
          params: {
            project: projectInfo.prjId,
            category: chanDaoType,
            ztNo: ztno,
          },
        })
        .then(function (res) {
          if (res.data.ok === true) {
            const queryDatas = res.data.ztRecord;
            formForAdminToAddAnaMod.setFieldsValue({
              adminCurStage: numberRenderToCurrentStage({
                value: queryDatas.stage === undefined ? '' : queryDatas.stage.toString(),
              }),
              adminAddChandaoTitle: queryDatas.title,
              adminAddSeverity: numberRenderToZentaoSeverity({
                value: queryDatas.severity === null ? '' : queryDatas.severity.toString(),
              }),
              adminAddPriority: queryDatas.priority,
              adminAddModule: queryDatas.module,
              adminAddChandaoStatus: numberRenderToZentaoStatus({value: queryDatas.ztStatus === null ? '' : queryDatas.ztStatus.toString()}),
              adminAddAssignTo: queryDatas.assignedTo,
              adminAddSolvedBy: queryDatas.finishedBy,
              adminAddClosedBy: queryDatas.closedBy,
            });
          } else {
            if (res.data.code === '404') {
              message.error({
                content: `禅道不存在ID为${ztno}的${chanDaoType}`,
                duration: 1, // 1S 后自动关闭
                className: 'ModNone',
                style: {
                  marginTop: '50vh',
                },
              });
            } else {
              message.error({
                content: `${res.data.message}`,
                duration: 1, // 1S 后自动关闭
                className: 'ModNone',
                style: {
                  marginTop: '50vh',
                },
              });
            }
            formForAdminToAddAnaMod.setFieldsValue({
              adminAddChandaoTitle: '',
              adminAddSeverity: '',
              adminAddPriority: '',
              adminAddModule: '',
              adminAddChandaoStatus: '',
              adminAddAssignTo: '',
              adminAddSolvedBy: '',
              adminAddClosedBy: '',
            });
          }
        })
        .catch(function (error) {
          message.error({
            content: error.toString(),
            duration: 1, // 1S 后自动关闭
            className: 'ModError',
            style: {
              marginTop: '50vh',
            },
          });
        });
    };

    // 添加项目
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [modal, setmodal] = useState({title: '新增明细行'});
    const addProject = () => {
      formForAdminToAddAnaMod.setFieldsValue({
        adminCurStage: '',
        adminAddTester: '',
        adminChandaoType: '',
        adminChandaoId: '',
        adminAddChandaoTitle: '',
        adminAddSeverity: '',
        adminAddPriority: '',
        adminAddModule: '',
        adminAddChandaoStatus: '',
        adminAddAssignTo: '',
        adminAddSolvedBy: '',
        adminAddClosedBy: '',
        adminAddHotUpdate: '',
        adminAddDataUpgrade: '',
        adminAddInteUpgrade: '',
        adminAddPreData: '',
        adminAddtesterVerifi: '',
        adminAddSuggestion: '',
        adminAddEnvironment: '',
        adminAddForUED: '',
        adminAddForUedVerify: '',
        adminAdminUedOnline: '',
        // adminAddSource: "",
        adminAddFeedbacker: '',
        adminAddRemark: '',
      });

      setmodal({title: '新增明细行'});
      // 赋值给控件
      setIsAddModalVisible(true);
    };

    /* endregion */

    /* region 修改功能  */

    const [isformForManagerToModVisible, setformForManagerToModVisible] = useState(false);
    const [isformForTesterToModVisible, setformForTesterToModVisible] = useState(false);
    const [isformForUEDToModVisible, setformForUEDToModVisible] = useState(false);

    /* region admin 权限操作 */
    // 新增和修改弹出层取消按钮事件
    const handleCancel = () => {
      setIsAddModalVisible(false);
    };

    // admin新增项目
    const addCommitDetails = (datas: any) => {
      axios
        .post('/api/sprint/project/child', datas)
        .then(function (res) {
          if (res.data.ok === true) {
            setIsAddModalVisible(false);
            updateGrid();
            message.info({
              content: res.data.message,
              duration: 1, // 1S 后自动关闭
              className: 'AddSuccess',
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}`,
              duration: 1, // 1S 后自动关闭
              className: 'AddNone',
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          message.error({
            content: error.toString(),
            duration: 1, // 1S 后自动关闭
            className: 'AddError',
            style: {
              marginTop: '50vh',
            },
          });
        });
    };

    // admin 修改项目
    const modCommitDetails = (datas: any) => {
      axios
        .put('/api/sprint/project/child', datas)
        .then(function (res) {
          if (res.data.ok === true) {
            setformForTesterToModVisible(false);
            setIsAddModalVisible(false);
            setformForManagerToModVisible(false);
            setformForUEDToModVisible(false);
            updateGrid();
            message.info({
              content: res.data.message,
              duration: 1, // 1S 后自动关闭
              className: 'ModSuccess',
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}`,
              duration: 1, // 1S 后自动关闭
              className: 'ModNone',
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          message.error({
            content: error.toString(),
            duration: 1,
            className: 'ModError',
            style: {
              marginTop: '50vh',
            },
          });
        });
    };

    // 提交admin 新增和修改的操作
    const commitSprintDetails = () => {
      const oradata = formForAdminToAddAnaMod.getFieldsValue();
      if (oradata.adminAddTester === '' || oradata.adminAddTester === null) {
        message.error({
          content: `对应测试不能为空！`,
          duration: 1,
          className: 'MNone',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }
      if (oradata.adminChandaoType === '' || oradata.adminChandaoId === '') {
        message.error({
          content: `禅道类型以及禅道编号不能为空！`,
          className: 'MNone',
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      const datas = {
        category: oradata.adminChandaoType,
        hotUpdate: oradata.adminAddHotUpdate,
        dataUpdate: oradata.adminAddDataUpgrade,
        interUpdate: oradata.adminAddInteUpgrade,
        presetData: oradata.adminAddPreData,
        testCheck: oradata.adminAddtesterVerifi,
        scopeLimit: oradata.adminAddSuggestion,
        publish: oradata.adminAddEnvironment,
        uedEnvCheck: oradata.adminAddForUedVerify,
        uedOnlineCheck: oradata.adminAdminUedOnline,
        memo: oradata.adminAddRemark,
      };

      if (modal.title === '新增明细行') {
        // 新增使用的是project id
        datas['project'] = projectInfo.prjId;
        datas["source"] = 7;
        datas["ztNo"] = oradata.adminChandaoId;
        datas["tester"] = oradata.adminAddTester;
        datas["uedName"] = oradata.adminAddForUED;
        datas["feedback"] = oradata.adminAddFeedbacker;

        addCommitDetails(datas);
      } else {
        const curRow: any = gridApi.current?.getSelectedRows(); // 获取选中的行
        datas['id'] = curRow[0].id;
        // 判断是否被修改过 禅道id 对应测试、对应UED、反馈人
        if (curRow[0].ztNo !== oradata.adminChandaoId) {
          datas["ztNo"] = oradata.adminChandaoId;
        }

        if (formForAdminToAddAnaMod.isFieldTouched('adminAddTester')) {
          datas["tester"] = oradata.adminAddTester;
        }

        if (formForAdminToAddAnaMod.isFieldTouched('adminAddForUED')) {
          datas["uedName"] = oradata.adminAddForUED;
        }

        if (formForAdminToAddAnaMod.isFieldTouched('adminAddFeedbacker')) {
          datas["feedback"] = oradata.adminAddFeedbacker;
        }

        modCommitDetails(datas);

      }
    };

    // admin 修改
    const adminModify = (datas: any) => {
      formForAdminToAddAnaMod.setFieldsValue({
        adminCurStage: numberRenderToCurrentStage({
          value: datas.stage === null ? '' : datas.stage.toString(),
        }),
        adminAddTester: datas.tester,
        adminChandaoType: datas.category,
        adminChandaoId: datas.ztNo,
        adminAddChandaoTitle: datas.title,
        adminAddSeverity: datas.severity,
        adminAddPriority: datas.priority,
        adminAddModule: datas.moduleName,
        adminAddChandaoStatus: numberRenderToZentaoStatus({
          value: datas.ztStatus === null ? '' : datas.ztStatus.toString(),
        }),
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
        adminAddRemark: datas.memo,
      });
      setmodal({title: '修改明细行(admin)'});
      setIsAddModalVisible(true);
    };

    /* endregion */

    /* region 开发经理 权限操作 */

    // 开发经理（开发）manager 修改
    const managerModify = (datas: any) => {
      formForManagerToMod.setFieldsValue({
        managerCHandaoID: datas.ztNo,
        managerChandaoType: numberRenderToZentaoType({value: datas.category === null ? '' : datas.category.toString()}),
        managerDataUpgrade: datas.dataUpdate,
        managerEnvironment: datas.publishEnv,
        managerHotUpdate: datas.hotUpdate,
        managerInteUpgrade: datas.interUpdate,
        managerPreData: datas.presetData,
        managerSuggestion: datas.scopeLimit,
        managerTitle: datas.title,
        managertesterVerifi: datas.testCheck,
      });
      setformForManagerToModVisible(true);
    };

    // 开发经理弹出层取消
    const mangerHandleCancel = () => {
      setformForManagerToModVisible(false);
    };

    // 开发经理提交修改
    const commitManagerModify = () => {
      const oradata = formForManagerToMod.getFieldsValue();
      if (oradata.testerChandaoType === '' || oradata.testerCHandaoID === '') {
        message.error({
          content: `禅道类型和禅道编号不能为空！`,
          className: 'MNone',
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }
      const curRow: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      const rowDatas = curRow[0];

      const datas = {
        id: rowDatas.id,
        // tester: rowDatas.tester,
        // category: oradata.managerChandaoType,
        // ztNo: oradata.managerCHandaoID,
        hotUpdate: oradata.managerHotUpdate,
        dataUpdate: oradata.managerDataUpgrade,
        interUpdate: oradata.managerInteUpgrade,
        presetData: oradata.managerPreData,
        testCheck: oradata.managertesterVerifi,
        scopeLimit: oradata.managerSuggestion,
        // publish: oradata.managerEnvironment,
        // uedName: rowDatas.uedName,
        // uedEnvCheck: rowDatas.uedEnvCheck,
        // uedOnlineCheck: rowDatas.uedOnlineCheck,
        // source: rowDatas.source,
        // feedback: rowDatas.feedback,
        // memo: rowDatas.memo,
      };
      modCommitDetails(datas);
    };

    /*  endregion */

    /* region 测试 权限操作 */
    // 测试 修改
    const testerModify = (datas: any) => {
      formForTesterToMod.setFieldsValue({
        testerChandaoType: numberRenderToZentaoType({value: datas.category === null ? '' : datas.category.toString()}),
        testerCHandaoID: datas.ztNo,
        testerTitle: datas.title,
        testChandaoStatus: numberRenderToZentaoStatus({
          value: datas.ztStatus === null ? '' : datas.ztStatus.toString(),
        }),
        testToTester: datas.tester,
        testerRemark: datas.memo

      });
      setformForTesterToModVisible(true);
    };

    const testerHandleCancel = () => {
      setformForTesterToModVisible(false);
    };

    const commitTesterModify = () => {
      const oradata = formForTesterToMod.getFieldsValue();

      if (oradata.testToTester === '' || oradata.testToTester === null) {
        message.error({
          content: `对应测试不能为空！`,
          duration: 1,
          className: 'MNone',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }
      if (oradata.testerChandaoType === '' || oradata.testerCHandaoID === '') {
        message.error({
          content: `禅道类型和禅道编号不能为空！`,
          duration: 1,
          className: 'MNone',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }
      const curRow: any = gridApi.current?.getSelectedRows(); // 获取选中的行

      const datas = {
        id: curRow[0].id,
        memo: oradata.testerRemark,

        // category: oradata.testerChandaoType,
        // ztNo: oradata.testerCHandaoID,
        // hotUpdate: rowDatas.hotUpdate,
        // dataUpdate: rowDatas.dataUpdate,
        // interUpdate: rowDatas.interUpdate,
        // presetData: rowDatas.presetData,
        // testCheck: rowDatas.testCheck,
        // scopeLimit: rowDatas.scopeLimit,
        // publish: rowDatas.publishEnv,
        // uedName: rowDatas.uedName,
        // uedEnvCheck: rowDatas.uedEnvCheck,
        // uedOnlineCheck: rowDatas.uedOnlineCheck,
        // source: rowDatas.source,
        // feedback: rowDatas.feedback,

      };
      if (formForTesterToMod.isFieldTouched('testToTester')) {
        datas["tester"] = oradata.testToTester;
      }
      modCommitDetails(datas);
    };

    /* endregion */

    /* region UED 权限操作 */
    // UED 修改
    const uedModify = (datas: any) => {
      formForUEDToMod.setFieldsValue({
        uedCHandaoID: datas.ztNo,
        uedChandaoType: numberRenderToZentaoType({value: datas.category === null ? '' : datas.category.toString()}),
        uedRemark: datas.memo,
        uedTitle: datas.title,
        uedForUED: datas.uedName,
        uedForUedVerify: datas.uedEnvCheck,
        UedOnlineVerti: datas.uedOnlineCheck,
        uedSource: datas.source,
      });

      setformForUEDToModVisible(true);
    };

    const UEDHandleCancel = () => {
      setformForUEDToModVisible(false);
    };

    const commitUedModify = () => {
      const oradata = formForUEDToMod.getFieldsValue();
      if (oradata.uedChandaoType === '' || oradata.uedCHandaoID === '') {
        message.error({
          content: `禅道类型和禅道编号不能为空！`,
          duration: 1,
          className: 'MNone',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }
      const curRow: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      const rowDatas = curRow[0];

      const datas = {
        id: rowDatas.id,
        // tester: rowDatas.tester,
        // category: oradata.uedChandaoType,
        // ztNo: oradata.uedCHandaoID,
        // hotUpdate: rowDatas.hotUpdate,
        // dataUpdate: rowDatas.dataUpdate,
        // interUpdate: rowDatas.interUpdate,
        // presetData: rowDatas.presetData,
        // testCheck: rowDatas.testCheck,
        // scopeLimit: rowDatas.scopeLimit,
        // publish: rowDatas.publishEnv,

        uedEnvCheck: oradata.uedForUedVerify,
        uedOnlineCheck: oradata.UedOnlineVerti,
        // source: rowDatas.uedSource,
        // feedback: rowDatas.feedback,
        memo: oradata.uedRemark,
      };

      if (formForUEDToMod.isFieldTouched('uedForUED')) {
        datas["uedName"] = oradata.uedForUED;
      }
      modCommitDetails(datas);
    };


    /* endregion */

    // 不同权限修改不同页面
    const authorityForMod = (detailsInfo: any) => {
      // 判断人员权限（admin，测试，开发经理（开发）,UED）
      let currentUser = '';
      currentUser = 'admin';
      switch (currentUser) {
        case 'admin':
          adminModify(detailsInfo);
          break;
        case 'tester':
          testerModify(detailsInfo);
          break;
        case 'manager':
          managerModify(detailsInfo);
          break;
        case 'UED':
          uedModify(detailsInfo);
          break;
        default:
          break;
      }
    };

    // 修改按钮点击事件
    const btnModifyProject = () => {
      const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      // 没有选中则提醒
      if (selRows.length === 0) {
        message.error({
          content: '请选中需要修改的数据!',
          duration: 1,
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
          duration: 1,
          className: 'modifyMore',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }
      authorityForMod(selRows[0]);
    };

    // 行事件双击
    const rowClicked = (params: any) => {
      authorityForMod(params.data);
    };

    /* endregion */

    /* region 删除功能 */

// 删除sprint列表
    const [isdelModalVisible, setIsDelModalVisible] = useState(false);
// 删除按钮点击
    const deleteSprintDetails = () => {
      // 判断是否选中数据
      const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      if (selRows.length === 0) {
        message.error({
          content: '请选中需要删除的数据!',
          duration: 1,
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
          duration: 1,
          className: 'delMore',
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }
      setIsDelModalVisible(true);
    };

    const delSprintList = () => {
      const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      const detailsId = selRows[0].id;
      const url = `/api/sprint/project/child/${detailsId}`;
      axios
        .delete(url)
        .then(function (res) {
          if (res.data.ok === true) {
            setIsDelModalVisible(false);
            updateGrid();
            message.info({
              content: res.data.message,
              duration: 1, // 1S 后自动关闭
              className: 'delSuccess',
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}`,
              duration: 1, // 1S 后自动关闭
              className: 'MdelNon',
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          message.error({
            content: error.toString(),
            duration: 1,
            className: 'MdelError',
            style: {
              marginTop: '50vh',
            },
          });
        });
    };

    const DelCancel = () => {
      setIsDelModalVisible(false);
    };
    /* endregion */

    /* region 移动功能 */
    const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
    const [isMoveAddModalVisible, setIsMoveAddModalVisible] = useState(false);
    const [isAble, setisAble] = useState({shown: false});

    const moveProject = () => {
      const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      if (selRows.length <= 0) {
        message.error({
          content: "请选择需要移动的数据！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        return;
      }

      formForMove.setFieldsValue({
        moveForOraPrj: projectInfo.prjNames
      });
      setIsMoveModalVisible(true);
    };

    const moveCancel = () => {
      setIsMoveModalVisible(false);
    };

    const moveSprintList = () => {
      // 获取被选择明细项
      const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      const idArray = [];
      for (let index = 0; index < selRows.length; index += 1) {
        idArray.push(selRows[index].id);
      }
      const oradata = formForMove.getFieldsValue();

      const params = {
        "id": idArray,
        "source": projectInfo.prjId,
        "target": oradata.moveNewPrj
      };

      axios.patch('/api/sprint/project/child/move', params)
        .then(function (res) {
          if (res.data.ok === true) {
            setIsMoveModalVisible(false);
            updateGrid();
            message.info({
              content: res.data.message,
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: res.data.verify === undefined ? res.data.message : res.data.verify,
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          message.error({
            content: error.toString(),
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        });


    };

    const addPrjCancel = () => {
      setIsMoveAddModalVisible(false);
    };

    const addNewProject = () => {
      const currentDate = moment(new Date()).add('year', 0);
      formForMoveAddAnaMod.setFieldsValue({
        prjNames: null,
        prjDate: formatMomentTime(currentDate),
        starttime: formatMomentTime(currentDate),
        testCutoff: formatMomentTime(currentDate),
        testFinnished: formatMomentTime(currentDate),
        planOnline: formatMomentTime(currentDate),
        planHuidu: formatMomentTime(currentDate),
        prjStatus: null,
      });

      // 赋值给控件
      setIsMoveAddModalVisible(true);
    };

    const formTimeSelected = async () => {
      const values = formForMoveAddAnaMod.getFieldsValue();
      const prjName = `${values.prjNames}${values.prjDate.format('YYYYMMDD')}`;
      const datas: any = await queryRepeats(gqlClient, prjName);
      // 时间选择后禁用某些控件
      if (datas.ok === true) {
        // 可以新增项目
        setisAble({shown: false});
        formForMoveAddAnaMod.setFieldsValue({
          prjLable: '',
        });
      } else {
        setisAble({shown: true});
        formForMoveAddAnaMod.setFieldsValue({
          prjLable: '重复项目',
          // prjStatus: data.data.status  // data 可能没有数据
        });
      }
    };

    const commitAddProject = async () => {
      const values = formForMoveAddAnaMod.getFieldsValue();
      const prjtype = values.prjNames;
      if (prjtype === null) {
        message.error({
          content: '项目类型不能为空!',
          duration: 1,
          className: 'AddNone',
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

      const prjdate = values.prjDate.format('YYYYMMDD');
      const datas = {
        name: `${prjtype}${prjdate}`,
        type: 'MANUAL',
        startAt: formatMomentTime(values.starttime),
        endAt: formatMomentTime(values.testCutoff),
        finishAt: formatMomentTime(values.testFinnished),
        stageAt: formatMomentTime(values.planHuidu),
        onlineAt: formatMomentTime(values.planOnline),
        status: values.prjStatus,
        creator: 'admin',
      };
      axios
        .post('/api/sprint/project', datas)
        .then(function (res) {
          if (res.data.ok === true) {
            setIsMoveModalVisible(false);
            setIsMoveAddModalVisible(false);
            // updateGrid();
            message.info({
              content: res.data.message,
              duration: 1,
              className: 'AddSuccess',
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}${res.data.zt.message.end[0]}`,
              duration: 1,
              className: 'AddNone',
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          // console.log("error", error);
          message.error({
            content: error.toString(),
            duration: 1,
            className: 'AddError',
            style: {
              marginTop: '50vh',
            },
          });
        });

    };

    /* endregion */

    /* region 操作流程 */
    const [isFlowModalVisible, setIsFlowModalVisible] = useState(false);
    const [flowHitmessage, setFlowHitmessage] = useState({hintMessage: ''});

    // 流程-取消
    const flowForCancle = () => {
      setFlowHitmessage({hintMessage: '已取消'});
      setIsFlowModalVisible(true);
    };
    // 流程-开发已revert
    const flowForDevRevert = () => {
      setFlowHitmessage({hintMessage: '开发已revert'});

      setIsFlowModalVisible(true);
    };

    // 流程-测试已验revert
    const flowForTestRevert = () => {
      setFlowHitmessage({hintMessage: '测试已验证revert'});

      setIsFlowModalVisible(true);
    };
    // 流程-灰度已验
    const flowForHuiduChecked = () => {
      setFlowHitmessage({hintMessage: '灰度已验过'});

      setIsFlowModalVisible(true);
    };
    // 流程-线上已验证
    const flowForOnlineChecked = () => {
      setFlowHitmessage({hintMessage: '线上已验过'});

      setIsFlowModalVisible(true);
    };

    const modFlowStage = (stage: number) => {
      const selRows: any = gridApi.current?.getSelectedRows();
      const selIds = [];
      for (let index = 0; index < selRows.length; index += 1) {
        selIds.push(selRows[index].id);
      }
      const params = {
        id: selIds,
        attribute: "stage",
        value: stage,
      };

      axios
        .patch('/api/sprint/project/child', params)
        .then(function (res) {
          if (res.data.ok === true) {
            setIsFlowModalVisible(false);
            updateGrid();
            message.info({
              content: res.data.message,
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}`,
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          message.error({
            content: error.toString(),
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        });

    };

    const commitFlow = () => {
      switch (flowHitmessage.hintMessage) {
        case '已取消':
          modFlowStage(7);
          break;
        case '开发已revert':
          modFlowStage(8);
          break;
        case '测试已验证revert':
          modFlowStage(9);
          break;
        case '灰度已验过':
          modFlowStage(10);
          break;
        case '线上已验过':
          modFlowStage(11);
          break;
        default:
          break;
      }
    };

    const flowCancel = () => {
      setIsFlowModalVisible(false);
    };

    /* endregion */

    const leftStyle = {marginLeft: '20px'};
    const rightStyle = {marginLeft: '30px'};
    const widths = {width: '200px', color: 'black'};
    const routes = [
      {
        path: '',
        breadcrumbName: 'sprint 工作台',
      }, {
        path: '',
        breadcrumbName: 'hotfix明细',
      }];

    return (

      <div style={{marginTop: "-20px"}}>

        <PageHeader
          ghost={false}
          title={projectInfo.prjNames}
          style={{height: "100px"}}
          breadcrumb={{routes}}
        />

        {/* 新增、修改、删除按钮栏 */}
        <div style={{background: 'white', marginTop: "20px"}}>
          {/* 使用一个图标就要导入一个图标 */}
          {/* 明细操作按钮 */}
          <Button type="text" style={{color: 'black'}} icon={<FolderAddTwoTone/>} size={'large'}
                  onClick={addProject}>新增</Button>
          <Button type="text" style={{color: 'black'}} icon={<EditTwoTone/>} size={'large'}
                  onClick={btnModifyProject}>修改</Button>
          <Button type="text" style={{color: 'black'}} icon={<DeleteTwoTone/>} size={'large'}
                  onClick={deleteSprintDetails}>删除</Button>
          <Button type="text" style={{color: 'black'}} icon={<SnippetsTwoTone/>} size={'large'}
                  onClick={moveProject}>移动</Button>
          {/* 操作流程按钮 */}
          <Button type="text" style={{color: 'black', float: 'right'}} icon={<CheckSquareTwoTone/>} size={'large'}
                  onClick={flowForOnlineChecked}>线上已验证</Button>
          <Button type="text" style={{color: 'black', float: 'right'}} icon={<CheckSquareTwoTone/>} size={'large'}
                  onClick={flowForHuiduChecked}>灰度已验证</Button>
          <Button type="text" style={{color: 'black', float: 'right'}} icon={<CheckSquareTwoTone/>} size={'large'}
                  onClick={flowForTestRevert}>测试已验revert</Button>
          <Button type="text" style={{color: 'black', float: 'right'}} icon={<CheckSquareTwoTone/>} size={'large'}
                  onClick={flowForDevRevert}>开发已revert</Button>
          <Button type="text" style={{color: 'black', float: 'right'}} icon={<CloseSquareTwoTone/>} size={'large'}
                  onClick={flowForCancle}>取消</Button>
          <label style={{marginTop: '10px', color: 'black', fontWeight: 'bold', float: 'right'}}>操作流程:</label>
        </div>

        {/* ag-grid 表格定义 */}
        <div className="ag-theme-alpine" style={{height: getHeight(), width: '100%'}}>
          <AgGridReact
            columnDefs={colums()} // 定义列
            rowData={data} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              minWidth: 100,
            }}
            autoGroupColumnDef={{
              minWidth: 100,
            }}
            rowSelection={'multiple'} // 设置多行选中
            groupDefaultExpanded={9} // 展开分组
            onGridReady={onGridReady}
            onRowDoubleClicked={rowClicked}
          />

        </div>

        {/* admin新增和修改表单 */}
        <Modal
          title={modal.title}
          visible={isAddModalVisible}
          onCancel={handleCancel}
          centered={true}
          footer={null}
          width={1000}
        >
          {/* admin 权限组新增和修改的界面 */}
          <Form form={formForAdminToAddAnaMod}>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminCurStage" label="当前阶段:">
                    <Select placeholder="请选择" style={widths} showSearch optionFilterProp="children">
                      {[
                        <Option key={'1'} value={'1'}>未开始</Option>,
                        <Option key={'2'} value={'2'}>开发中</Option>,
                        <Option key={'3'} value={'3'}>已提测</Option>,
                        <Option key={'4'} value={'4'}>测试中</Option>,
                        <Option key={'5'} value={'5'}>TE测试环境已验过</Option>,
                        <Option key={'6'} value={'6'}>UED测试环境已验过</Option>,
                        <Option key={'7'} value={'7'}>已取消</Option>,
                        <Option key={'8'} value={'8'}>开发已revert</Option>,
                        <Option key={'9'} value={'9'}>测试已验证revert</Option>,
                        <Option key={'10'} value={'10'}>灰度已验过</Option>,
                        <Option key={'11'} value={'11'}>线上已验过</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddTester" label="对应测试:" rules={[{required: true}]}>
                    <Select placeholder="请选择" style={widths} showSearch optionFilterProp="children">
                      {GetDeptMemner('["测试","业务"]')}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminChandaoType" label="禅道类型：" rules={[{required: true}]}>
                    <Select placeholder="请选择" style={widths}>
                      {[
                        <Option value={'1'}> Bug </Option>,
                        <Option value={'3'}> 需求 </Option>,
                        <Option value={'2'}> Task </Option>,
                      ]}
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
                    <Input disabled={true} style={{width: '510px', color: 'black'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSeverity" label="严重程度:">
                    <Select disabled={true} placeholder="请选择" style={widths}>
                      {[
                        <Option key={'1'} value={'1'}>P0</Option>,
                        <Option key={'2'} value={'2'}>P1</Option>,
                        <Option key={'3'} value={'3'}>P2</Option>,
                        <Option key={'4'} value={'4'}>P3</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddPriority" label="优先级：">
                    <Select disabled={true} placeholder="请选择" style={widths}>
                      {[
                        <Option value={'1'}>1</Option>,
                        <Option value={'2'}>2</Option>,
                        <Option value={'3'}>3</Option>,
                        <Option value={'4'}>4</Option>
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddModule" label="所属模块:">
                    <Input disabled={true} style={{width: '218px'}}/>
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
                    <Input disabled={true} style={{width: '185px', color: 'black'}}/>
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
                    <Select placeholder="请选择" style={{width: '150px'}}>
                      {[
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddDataUpgrade" label="是否有数据升级:">
                    <Select placeholder="请选择" style={{width: '170px'}}>
                      {[
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddInteUpgrade" label="是否有接口升级：">
                    <Select placeholder="请选择" style={{width: '160px'}}>
                      {[
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddPreData" label="是否有预置数据:">
                    <Select placeholder="请选择" style={{width: '150px'}}>
                      {[
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddtesterVerifi" label="是否需要测试验证：">
                    <Select placeholder="请选择" style={{width: '155px'}}>
                      {[
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSuggestion" label="验证范围建议:">
                    <Input style={{width: '790px'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddEnvironment" label="发布环境:">
                    <Select placeholder="请选择" style={widths}>
                      {[
                        <Option key={'1'} value={'1'}>集群1</Option>,
                        <Option key={'2'} value={'2'}>集群2</Option>,
                        <Option key={'3'} value={'3'}>集群3</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddForUED" label="对应UED：">
                    <Select placeholder="请选择" style={widths}>
                      {GetDeptMemner('["UED"]')}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddForUedVerify" label="UED测试环境验证：">
                    <Select placeholder="请选择" style={{width: '158px'}}>
                      {[
                        <Option key={'1'} value={'1'}>验证通过</Option>,
                        <Option key={'0'} value={'0'}>未通过</Option>,
                        <Option key={'2'} value={'2'}>无需验证</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAdminUedOnline" label="UED线上验证:">
                    <Select placeholder="请选择" style={widths}>
                      {[
                        <Option key={'1'} value={'1'}>验证通过</Option>,
                        <Option key={'0'} value={'0'}>未通过</Option>,
                        <Option key={'2'} value={'2'}>无需验证</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSource" label="来源:">
                    <Select
                      placeholder="请选择"
                      defaultValue={['手工录入']}
                      disabled={true}
                      style={widths}
                    >
                      {[
                        <Option key={'6'} value={'6'}>禅道自动写入</Option>,
                        <Option key={'7'} value={'7'}>手工录入</Option>,
                        <Option key={'1'} value={'1'}>《产品hotfix申请》</Option>,
                        <Option key={'2'} value={'2'}>《UED-hotfix申请》</Option>,
                        <Option key={'3'} value={'3'}>《开发hotfix申请》</Option>,
                        <Option key={'4'} value={'4'}>《emergency申请》</Option>,
                        <Option key={'5'} value={'5'}>《开发热更新申请》</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddFeedbacker" label="反馈人:">
                    <Select placeholder="请选择" style={widths} showSearch optionFilterProp="children">
                      {GetDeptMemner('all')}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddRemark" label="备注:">
                    <Input style={{width: '860px'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Form.Item style={{marginTop: '50px'}}>
              <Button type="primary" style={{marginLeft: '400px'}} onClick={commitSprintDetails}>
                确定</Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={handleCancel}>
                取消</Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* 开发经理和开发修改表单 */}
        <Modal
          title="编辑明细行(开发)"
          visible={isformForManagerToModVisible}
          onCancel={mangerHandleCancel}
          centered={true}
          footer={null}
          width={750}
        >
          <Form form={formForManagerToMod}>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="managerChandaoType" label="禅道类型：">
                    <Select placeholder="请选择" style={widths} disabled={true}>
                      {[
                        <Option value={'1'}> Bug </Option>,
                        <Option value={'3'}> 需求 </Option>,
                        <Option value={'2'}> Task </Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: '50px'}}>
                  <Form.Item name="managerCHandaoID" label="禅道编号:">
                    <Input placeholder="请输入" style={widths} disabled={true}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="managerTitle" label="标题内容:">
                    <Input disabled={true} style={{width: '540px', color: 'black'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="managerHotUpdate" label="是否支持热更新:">
                    <Select placeholder="请选择" style={{width: '150px'}}>
                      {[
                        <Option value={'1'}>是</Option>,
                        <Option value={'0'}>否</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={{marginLeft: '55px'}}>
                  <Form.Item name="managerDataUpgrade" label="是否有数据升级:">
                    <Select placeholder="请选择" style={{width: '170px'}}>
                      {[
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="managerInteUpgrade" label="是否有接口升级：">
                    <Select placeholder="请选择" style={{width: '155px'}}>
                      {[
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: '50px'}}>
                  <Form.Item name="managerPreData" label="是否有预置数据:">
                    <Select placeholder="请选择" style={{width: '170px'}}>
                      {[
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="managertesterVerifi" label="是否需要测试验证：">
                    <Select placeholder="请选择" style={{width: '150px'}}>
                      {[
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: '50px'}}>
                  <Form.Item name="managerEnvironment" label="发布环境:">
                    <Select placeholder="请选择" style={widths}>
                      {[
                        <Option key={'集群1'} value={'集群1'}>集群1</Option>,
                        <Option key={'集群2'} value={'集群2'}>集群2</Option>,
                        <Option key={'集群3'} value={'集群3'}>集群3</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="managerSuggestion" label="验证范围建议:">
                    <Input style={{width: '520px'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Form.Item style={{marginTop: '50px'}}>
              <Button type="primary" style={{marginLeft: '300px'}} onClick={commitManagerModify}>
                确定
              </Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={mangerHandleCancel}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* 测试修改表单 */}
        <Modal
          title="编辑明细行(测试)"
          visible={isformForTesterToModVisible}
          onCancel={testerHandleCancel}
          centered={true}
          footer={null}
          width={750}
        >
          <Form form={formForTesterToMod}>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="testerChandaoType" label="禅道类型：">
                    <Select placeholder="请选择" style={widths} disabled={true}>
                      {[
                        <Option value={'1'}> Bug </Option>,
                        <Option value={'3'}> 需求 </Option>,
                        <Option value={'2'}> Task </Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: '50px'}}>
                  <Form.Item name="testerCHandaoID" label="禅道编号:">
                    <Input placeholder="请输入" style={widths} disabled={true}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="testerTitle" label="标题内容:">
                    <Input disabled={true} style={{width: '540px', color: 'black'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="testChandaoStatus" label="禅道状态:">
                    <Input disabled={true} style={widths}/>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: '50px'}}>
                  <Form.Item name="testToTester" label="对应测试:" rules={[{required: true}]}>
                    <Select placeholder="请选择" style={widths} showSearch optionFilterProp="children">
                      {GetDeptMemner('["测试","业务"]')}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="testerRemark" label="备 注:">
                    <Input style={{width: '570px'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Form.Item style={{marginTop: '50px'}}>
              <Button type="primary" style={{marginLeft: '300px'}} onClick={commitTesterModify}>
                确定
              </Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={testerHandleCancel}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* UED修改表单 */}
        <Modal
          title="编辑明细行(UED)"
          visible={isformForUEDToModVisible}
          onCancel={UEDHandleCancel}
          centered={true}
          footer={null}
          width={750}
        >
          <Form form={formForUEDToMod}>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="uedChandaoType" label="禅道类型：">
                    <Select placeholder="请选择" style={widths} disabled={true}>
                      {[
                        <Option value={'1'}> Bug </Option>,
                        <Option value={'3'}> 需求 </Option>,
                        <Option value={'2'}> Task </Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: '50px'}}>
                  <Form.Item name="uedCHandaoID" label="禅道编号:">
                    <Input placeholder="请输入" style={widths} disabled={true}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="uedTitle" label="标题内容:">
                    <Input disabled={true} style={{width: '540px', color: 'black'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="uedForUED" label="对应UED：">
                    <Select placeholder="请选择" style={widths}>
                      {GetDeptMemner('["UED"]')}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="uedForUedVerify" label="UED测试环境验证：">
                    <Select placeholder="请选择" style={{width: '180px'}}>
                      {[
                        <Option key={'1'} value={'1'}>验证通过</Option>,
                        <Option key={'0'} value={'0'}>未通过</Option>,
                        <Option key={'2'} value={'2'}>无需验证</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="UedOnlineVerti" label="UED线上验证:">
                    <Select placeholder="请选择" style={widths}>
                      {[
                        <Option key={'1'} value={'1'}>验证通过</Option>,
                        <Option key={'0'} value={'0'}>未通过</Option>,
                        <Option key={'2'} value={'2'}>无需验证</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={{marginLeft: '50px'}}>
                  <Form.Item name="uedSource" label="来 源:">
                    <Select placeholder="请选择" style={widths} disabled={true}>
                      {[
                        <Option key={'1'} value={'1'}>《产品hotfix申请》</Option>,
                        <Option key={'2'} value={'2'}>《UED-hotfix申请》</Option>,
                        <Option key={'3'} value={'3'}>《开发hotfix申请》</Option>,
                        <Option key={'4'} value={'4'}>《emergency申请》</Option>,
                        <Option key={'5'} value={'5'}>《开发热更新申请》</Option>,
                        <Option key={'6'} value={'6'}>禅道自动写入</Option>,
                        <Option key={'7'} value={'7'}>手工录入</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="uedRemark" label="备 注:">
                    <Input style={{width: '575px'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Form.Item style={{marginTop: '50px'}}>
              <Button type="primary" style={{marginLeft: '300px'}} onClick={commitUedModify}>
                确定
              </Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={UEDHandleCancel}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* 删除项目 */}
        <Modal
          title={'删除明细行'}
          visible={isdelModalVisible}
          onCancel={DelCancel}
          centered={true}
          footer={null}
          width={500}
        >
          <Form form={formForDel}>
            <Form.Item>
              <label style={{marginLeft: '20px'}}>删除将不能恢复，请确认是否删除？</label>
            </Form.Item>

            <Form.Item>
              <Button type="primary" style={{marginLeft: '150px'}} onClick={delSprintList}>
                确定
              </Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={DelCancel}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>


        {/* 移动项目 */}
        <Modal
          title={'移动明细行'}
          visible={isMoveModalVisible}
          onCancel={moveCancel}
          centered={true}
          footer={null}
          width={500}
        >
          <Form form={formForMove}>
            <div style={{marginLeft: '60px'}}>
              <Form.Item name="moveForOraPrj" label="原项目名称:">
                <Input style={widths} disabled={true}/>
              </Form.Item>
              <Form.Item label="新项目名称:">
                <Input.Group compact>
                  <Form.Item name="moveNewPrj">
                    <Select placeholder="请选择" style={widths} showSearch optionFilterProp="children">
                      {GetSprintProject()}
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" size={"middle"} style={{marginLeft: '10px'}}
                            onClick={addNewProject}> + </Button>
                  </Form.Item>
                </Input.Group>
              </Form.Item>

            </div>

            <Form.Item>
              <Button type="primary" style={{marginLeft: '150px'}} onClick={moveSprintList}>
                确定
              </Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={moveCancel}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>


        {/* 新增项目 */}
        <Modal
          title="新增项目"
          visible={isMoveAddModalVisible}
          onCancel={addPrjCancel}
          centered={true}
          footer={null}
          width={700}
        >
          <Form form={formForMoveAddAnaMod}>
            <Row gutter={16} style={{marginBottom: '-20px'}}>
              <Col className="gutter-row">
                <div style={rightStyle}>
                  <Form.Item label="项目名称：">
                    <Input.Group compact>
                      <Form.Item name="prjNames">
                        <Select id={'prjNames'} placeholder="请选择类型" style={{width: '150px'}}>
                          {[
                            <Option key={'sprint'} value={'sprint'}>sprint</Option>,
                            <Option key={'hotfix'} value={'hotfix'}>hotfix</Option>,
                            <Option key={'emergency'} value={'emergency'}>emergency</Option>,
                          ]}
                        </Select>
                      </Form.Item>

                      <Form.Item name="prjDate">
                        <DatePicker onChange={formTimeSelected}/>
                      </Form.Item>
                      <Form.Item name="prjLable">
                        <input
                          style={{
                            marginLeft: '10px',
                            color: 'red',
                            border: 'none',
                            backgroundColor: 'transparent',
                          }}
                          disabled={true}
                        />
                      </Form.Item>
                      <Form.Item name="prjId">
                        <label style={{display: 'none'}}></label>
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
                    <Select placeholder="请选择" style={widths}>
                      {[
                        <Option key={'closed'} value={'closed'}>已关闭</Option>,
                        <Option key={'doing'} value={'doing'}>进行中</Option>,
                        <Option key={'suspended'} value={'suspended'}>已挂起</Option>,
                        <Option key={'wait'} value={'wait'}>未开始</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Form.Item style={{marginTop: '50px'}}>
              <Button type="primary" style={{marginLeft: '250px'}} disabled={isAble.shown}
                      onClick={commitAddProject}>确定</Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={addPrjCancel}>取消</Button>
            </Form.Item>
          </Form>
        </Modal>


        {/* 流程操作 */}
        <Modal
          title={'流程操作提示'}
          visible={isFlowModalVisible}
          onCancel={flowCancel}
          centered={true}
          footer={null}
          width={500}
        >
          <Form>
            <Form.Item>
              <label style={{marginLeft: '20px'}}>
                确定将当前阶段修改为【{flowHitmessage.hintMessage}】吗？
              </label>
            </Form.Item>

            <Form.Item>
              <Button type="primary" style={{marginLeft: '150px'}} onClick={commitFlow}>
                确定</Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={flowCancel}>
                取消</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
;
export default SprintList;
