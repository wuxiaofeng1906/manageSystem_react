import React, {useEffect, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient, useQuery} from '@/hooks';
import {PageHeader, Button, message, Form, Select, Modal, Input, Row, Col, DatePicker, Checkbox} from 'antd';
import {formatMomentTime} from '@/publicMethods/timeMethods';
import dayjs from "dayjs";
import {
  FolderAddTwoTone,
  SnippetsTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  CloseSquareTwoTone,
  CheckSquareTwoTone,
  SettingOutlined
} from '@ant-design/icons';
import {history} from 'umi';
import {
  numberRenderToYesNo,
  numberRenderTopass,
  numberRenderToCurrentStage,
  numberRenderToCurrentStageForColor,
  stageChangeToNumber,
  numberRenderToZentaoType,
  zentaoTypeRenderToNumber,
  numberRenderToZentaoTypeForLine,
  numberRenderToZentaoSeverity,
  numberRenderToZentaoStatus,
  numberRenderToSource,
  linkToZentaoPage,
  numberRenderToZentaoStatusForRed,
  stageForLineThrough,
  numRenderForSevAndpriForLine,
  proposedTestRender
} from '@/publicMethods/cellRenderer';
import {getUsersId} from '@/publicMethods/userMethod';

import axios from 'axios';
import moment from "moment";
import {getHeight} from '@/publicMethods/pageSet';
import {judgeAuthority} from "@/publicMethods/authorityJudge";
import {useModel} from "@@/plugin-model/useModel";

const {Option} = Select;

// 定义列名
const getColums = () => {

  // 获取缓存的字段
  const fields = localStorage.getItem("sp_details_filed");
  const oraFields = [
    {
      headerName: '选择',
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 35,
    },
    // {
    //   headerName: '序号',
    //   maxWidth: 80,
    //   filter: false,
    //   pinned: 'left',
    //   cellRenderer: (params: any) => {
    //     return Number(params.node.id) + 1;
    //   },
    // },
    {
      headerName: '阶段',
      field: 'stage',
      pinned: 'left',
      cellRenderer: numberRenderToCurrentStageForColor,
      minWidth: 120,
      // tooltipField: "stage"
    },
    {
      headerName: '测试',
      field: 'tester',
      pinned: 'left',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "tester",
      suppressMenu: false
    },
    {
      headerName: '类型',
      field: 'category',
      cellRenderer: numberRenderToZentaoTypeForLine,
      pinned: 'left',
      minWidth: 70,
      suppressMenu: false,
      // tooltipField: "category"

    },
    {
      headerName: '编号',
      field: 'ztNo',
      cellRenderer: linkToZentaoPage,
      pinned: 'left',
      minWidth: 90,
      // tooltipField: "ztNo"
    },
    {
      headerName: '标题内容',
      field: 'title',
      pinned: 'left',
      minWidth: 350,
      cellRenderer: stageForLineThrough,
      tooltipField: "title"

    },
    {
      headerName: '严重等级',
      field: 'severity',
      cellRenderer: numRenderForSevAndpriForLine,
      minWidth: 90,
      // tooltipField: "severity"
    },
    // {
    //   headerName: '优先级',
    //   field: 'priority',
    // },
    {
      headerName: '模块',
      field: 'moduleName',
      minWidth: 100,
      cellRenderer: stageForLineThrough,
      tooltipField: "moduleName"
    },
    {
      headerName: '状态',
      field: 'ztStatus',
      cellRenderer: numberRenderToZentaoStatusForRed,
      minWidth: 80,
      // tooltipField: "ztStatus"
    },
    {
      headerName: '已提测',
      field: 'proposedTest',
      cellRenderer: proposedTestRender,
    },
    {
      headerName: '发布环境',
      field: 'publishEnv',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "publishEnv"

    },
    {
      headerName: '指派给',
      field: 'assignedTo',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "assignedTo",
      suppressMenu: false,

    },
    {
      headerName: '解决/完成人',
      field: 'finishedBy',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "finishedBy",
      suppressMenu: false,

    },
    {
      headerName: '关闭人',
      field: 'closedBy',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "closedBy",
      suppressMenu: false,

    },
    {
      headerName: '备注',
      field: 'memo',
      minWidth: 150,
      cellRenderer: stageForLineThrough,
      tooltipField: "memo"

    },
    {
      headerName: '相关需求',
      field: 'relatedStories',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      // tooltipField: "relatedStories"
    },
    {
      headerName: '相关任务',
      field: 'relatedTasks',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      // tooltipField: "relatedTasks"

    },
    {
      headerName: '相关bug',
      field: 'relatedBugs',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      // tooltipField: "relatedBugs"

    },
    {
      headerName: '是否可热更',
      field: 'hotUpdate',
      cellRenderer: numberRenderToYesNo,
      // tooltipField: "hotUpdate"
    },
    {
      headerName: '是否有数据升级',
      field: 'dataUpdate',
      cellRenderer: numberRenderToYesNo,
      // tooltipField: "dataUpdate"
    },
    {
      headerName: '是否有接口升级',
      field: 'interUpdate',
      cellRenderer: numberRenderToYesNo,
      // tooltipField: "interUpdate"
    },
    {
      headerName: '是否有预置数据修改',
      field: 'presetData',
      cellRenderer: numberRenderToYesNo,
      // tooltipField: "presetData"
    },
    {
      headerName: '是否需要测试验证',
      field: 'testCheck',
      cellRenderer: numberRenderToYesNo,
      // tooltipField: "testCheck"
    },
    {
      headerName: '验证范围建议',
      field: 'scopeLimit',
      cellRenderer: stageForLineThrough,
      // tooltipField: "scopeLimit"
    },
    {
      headerName: 'UED',
      field: 'uedName',
      cellRenderer: stageForLineThrough,
      suppressMenu: false,
      // tooltipField: "uedName"
    },
    {
      headerName: 'UED测试环境验证',
      field: 'uedEnvCheck',
      cellRenderer: numberRenderTopass,
      // tooltipField: "uedEnvCheck"

    },
    {
      headerName: 'UED线上验证',
      field: 'uedOnlineCheck',
      cellRenderer: numberRenderTopass,
      // tooltipField: "uedOnlineCheck"
    },
    {
      headerName: '来源',
      field: 'source',
      cellRenderer: numberRenderToSource,
      // tooltipField: "source"
    },
    {
      headerName: '反馈人',
      field: 'feedback',
      cellRenderer: stageForLineThrough,
      suppressMenu: false,
      // tooltipField: "feedback"
    }
  ];

  if (fields === null) {
    return oraFields;
  }
  const myFields = JSON.parse(fields);
  const component = new Array();

  oraFields.forEach((ele: any) => {
    const newElement = ele;
    if (myFields.includes(ele.headerName)) {
      newElement.hide = false;
    } else {
      newElement.hide = true;
    }
    component.push(newElement);
  });

  return component;
};

const calTypeCount = (data: any) => {
  let bug = 0;
  let task = 0;
  let story = 0;
  data.forEach((ele: any) => {
    if (ele.category === "1") {
      bug += 1;
    } else if (ele.category === "2") {
      task += 1;
    } else {
      story += 1;
    }

  });
  return {bug, task, story};
};
// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, prjID: any, prjType: any) => {
  const {data} = await client.query(`
      {
         proDetail(project:${prjID},category:"${prjType}",order:ASC){
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
            proposedTest
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
  return {result: data?.proDetail, resCount: calTypeCount(data?.proDetail)};
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


// 获取部门数据
const getDeptMemner = async (client: GqlClient<object>, params: any) => {
  let deptMember = "";

  if (params === "all") {

    deptMember = `
          {
            WxDeptUsers{
               id
              userName
            }
          }
      `;
  }
  if (params === "UED") {

    deptMember = `
          {
            WxDeptUsers(deptNames:["UED"]){
               id
              userName
            }
          }
      `;
  }

  if (params === "测试") {

    deptMember = `
          {
            WxDeptUsers(deptNames:["测试","业务"], techs:[TEST]){
                id
                userName
              }
          }
      `;
  }

  const {data} = await client.query(deptMember);

  return data?.WxDeptUsers;
};


// 组件初始化
const SprintList: React.FC<any> = () => {
    const {initialState} = useModel('@@initialState');

    const sys_accessToken = localStorage.getItem("accessId");
    axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;
    /* 获取网页的项目id */
    let prjId: string = '';
    let prjNames: string = '';
    let prjType: string = '';
    const location = history.location.query;
    if (location !== undefined && location.projectid !== null) {
      prjId = location.projectid.toString();
      prjNames = location.project === null ? '' : location.project.toString();
    }

    if (location !== undefined && location.type !== undefined && location.type !== null) {
      prjType = location.type.toString();
    }

    /* region 整个模块都需要用到的表单定义 */
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
    const [pageTitle, setPageTitle] = useState("");

    /* endregion */

    /* region  表格相关事件 */
    const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
    const gqlClient = useGqlClient();
    const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, prjId, prjType));


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
      const datas: any = await queryDevelopViews(gqlClient, prjId, prjType);
      gridApi.current?.setRowData(datas?.result);

      const bugs = datas?.resCount.bug === undefined ? 0 : datas?.resCount.bug;
      const tasks = datas?.resCount.task === undefined ? 0 : datas?.resCount.task;
      const storys = datas?.resCount.story === undefined ? 0 : datas?.resCount.story;
      setPageTitle(`共${bugs + tasks + storys}个，bug ${bugs} 个，task ${tasks} 个，story ${storys} 个`);

    };

    const LoadCombobox = (params: any) => {
      const deptMan = [];
      let deptMember = "";

      if (params === "all") {

        deptMember = `
          {
            WxDeptUsers{
               id
              userName
            }
          }
      `;
      }
      if (params === "UED") {

        deptMember = `
          {
            WxDeptUsers(deptNames:["UED"]){
               id
              userName
            }
          }
      `;
      }

      if (params === "测试") {

        deptMember = `
          {
            WxDeptUsers(deptNames:["测试","业务"], techs:[TEST]){
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
        project(range:{start:"", end:""},,order:DESC){
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

    /* region admin 的新增功能和修改功能  */
    //  弹出框
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isformForManagerToModVisible, setformForManagerToModVisible] = useState(false);
    const [isformForTesterToModVisible, setformForTesterToModVisible] = useState(false);
    const [isformForUEDToModVisible, setformForUEDToModVisible] = useState(false);
    const [modal, setmodal] = useState({title: '新增明细行'});

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
            project: prjId,
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
              createTime_hidden: dayjs(queryDatas.openedAt).format("YYYY-MM-DD HH:mm:ss") === "Invalid Date" ? '' : dayjs(queryDatas.openedAt).format("YYYY-MM-DD HH:mm:ss"),
              activeTime_hidden: dayjs(queryDatas.activedAt).format("YYYY-MM-DD HH:mm:ss") === "Invalid Date" ? '' : dayjs(queryDatas.activedAt).format("YYYY-MM-DD HH:mm:ss"),
              resolveTime_hidden: dayjs(queryDatas.resolvedAt).format("YYYY-MM-DD HH:mm:ss") === "Invalid Date" ? '' : dayjs(queryDatas.resolvedAt).format("YYYY-MM-DD HH:mm:ss")
            });
          } else {
            if (Number(res.data.code) === 404) {
              message.error({
                content: `禅道不存在ID为${ztno}的${numberRenderToZentaoType({value: chanDaoType})}`,
                duration: 1, // 1S 后自动关闭
                style: {
                  marginTop: '50vh',
                },
              });
            } else if (Number(res.data.code) === 409) {
              message.error({
                content: `【${prjNames}】已存在ID为${ztno}的${numberRenderToZentaoType({value: chanDaoType})}`,
                duration: 1, // 1S 后自动关闭
                style: {
                  marginTop: '50vh',
                },
              });
            } else {
              message.error({
                content: `${res.data.message}`,
                duration: 1, // 1S 后自动关闭
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

    // 点击新增按钮赋值弹出窗
    const addProject = () => {
      formForAdminToAddAnaMod.setFieldsValue({
        adminCurStage: '',
        adminAddTester: undefined,
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
        adminAddProposedTest: '',
        adminAddEnvironment: undefined,
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

    // 点击修改按钮赋值弹出窗
    const adminModify = async (datas: any) => {
      // 还要获取英文名
      const teters = datas.tester.split(';');
      const deptUsers = await getDeptMemner(gqlClient, "测试");
      const nameIdArray = getUsersId(deptUsers, teters);

      let publishEnv: any = [];
      if (datas.publishEnv !== null) {
        publishEnv = datas.publishEnv.split(';');
      }
      //  解析测试人员
      formForAdminToAddAnaMod.setFieldsValue({
        adminCurStage: numberRenderToCurrentStage({
          value: datas.stage === null ? '' : datas.stage.toString(),
        }),
        adminAddTester: nameIdArray,
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
        adminAddProposedTest: datas.proposedTest,
        adminAddEnvironment: publishEnv,
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

    //  发送请求 新增数据
    const addCommitDetails = (datas: any) => {
      console.log("datas", datas);
      axios
        .post('/api/sprint/project/child', datas)
        .then(function (res) {

          if (res.data.ok === true) {
            setIsAddModalVisible(false);
            updateGrid();
            message.info({
              content: res.data.message,
              duration: 1, // 1S 后自动关闭
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}`,
              duration: 1, // 1S 后自动关闭
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
            style: {
              marginTop: '50vh',
            },
          });
        });
    };

    //   发送请求 修改数据
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
              style: {
                marginTop: '50vh',
              },
            });
          } else if (Number(res.data.code) === 409) {
            message.error({
              content: `【${prjNames}】已存在ID为${datas.ztNo}的${numberRenderToZentaoType({value: datas.category})}`,
              duration: 1, // 1S 后自动关闭
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}`,
              duration: 1, // 1S 后自动关闭
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

    // commit 事件 admin 新增和修改的操作
    const commitSprintDetails = () => {

      /* region 数据获取和提醒 */
      const oradata = formForAdminToAddAnaMod.getFieldsValue();
      if (oradata.adminAddTester === '' || oradata.adminAddTester === null || oradata.adminAddTester === undefined) {
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

      // 用;拼接测试人员
      let testers = "";
      oradata.adminAddTester.forEach((eles: any) => {
        testers = testers === "" ? eles : `${testers};${eles}`;
      });

      // 用;拼接发布环境
      let pubEnv = "";
      oradata.adminAddEnvironment.forEach((eles: any) => {
        pubEnv = pubEnv === "" ? eles : `${pubEnv};${eles}`;
      });

      if (oradata.adminChandaoType === '' || oradata.adminChandaoId === '') {
        message.error({
          content: `禅道类型以及禅道编号不能为空！`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
        return;
      }

      /* #endregion */

      const datas = {
        project: prjId,
        stage: Number(oradata.adminCurStage).toString() === "NaN" ? stageChangeToNumber(oradata.adminCurStage) : Number(oradata.adminCurStage),
        category: oradata.adminChandaoType,
        hotUpdate: oradata.adminAddHotUpdate,
        dataUpdate: oradata.adminAddDataUpgrade,
        interUpdate: oradata.adminAddInteUpgrade,
        presetData: oradata.adminAddPreData,
        testCheck: oradata.adminAddtesterVerifi,
        scopeLimit: oradata.adminAddSuggestion,
        proposedTest: oradata.adminAddProposedTest === "" ? null : oradata.adminAddProposedTest,
        publishEnv: pubEnv,
        uedEnvCheck: oradata.adminAddForUedVerify,
        uedOnlineCheck: oradata.adminAdminUedOnline,
        memo: oradata.adminAddRemark,

        // 隐藏的字段
        // openedAt: oradata.createTime_hidden === "" ? null : oradata.createTime_hidden,
        // resolvedAt: oradata.resolveTime_hidden=== "" ? null : oradata.resolveTime_hidden,
        // activedAt: oradata.activeTime_hidden === "" ? null : oradata.activeTime_hidden,
      };

      if (oradata.createTime_hidden !== "") {
        datas['openedAt'] = oradata.createTime_hidden;
      }
      if (oradata.resolveTime_hidden !== "") {
        datas['resolvedAt'] = oradata.resolveTime_hidden;

      }
      if (oradata.activeTime_hidden !== "") {
        datas['activedAt'] = oradata.activeTime_hidden;

      }

      // 判断是管理员新增明细还是管理员修改明细行
      if (modal.title === '新增明细行') {

        datas["source"] = 7;
        datas["ztNo"] = oradata.adminChandaoId;
        datas["tester"] = testers;
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

        // 如果修改了禅道类型，那么category传入旧值，newCategory传入新值。
        if (curRow[0].category !== oradata.adminChandaoType) {
          datas["category"] = curRow[0].category;
          datas["newCategory"] = oradata.adminChandaoType;
        }

        if (formForAdminToAddAnaMod.isFieldTouched('adminAddTester')) {
          datas["tester"] = testers;
        }

        if (formForAdminToAddAnaMod.isFieldTouched('adminAddForUED')) {
          datas["uedName"] = oradata.adminAddForUED;
        }

        if (curRow[0].feedback !== oradata.adminAddFeedbacker) {
          datas["feedback"] = oradata.adminAddFeedbacker;
        }

        modCommitDetails(datas);

      }

    };

    // 新增和修改 弹出层取消按钮事件
    const handleCancel = () => {
      setIsAddModalVisible(false);
    };
    /* endregion */

    /* region 开发经理 权限操作 */

    // 开发经理（开发）manager 修改
    const managerModify = (datas: any) => {
      const pubEnv = datas.publishEnv.split(';');
      formForManagerToMod.setFieldsValue({
        managerCHandaoID: datas.ztNo,
        managerChandaoType: numberRenderToZentaoType({value: datas.category === null ? '' : datas.category.toString()}),
        managerDataUpgrade: datas.dataUpdate,
        managerProTested: datas.proposedTest,
        managerEnvironment: pubEnv,
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

      // 用;拼接发布环境
      let pubEnv = "";
      oradata.managerEnvironment.forEach((eles: any) => {
        pubEnv = pubEnv === "" ? eles : `${pubEnv};${eles}`;
      });

      const datas = {
        id: rowDatas.id,
        project: prjId,
        category: zentaoTypeRenderToNumber(oradata.managerChandaoType),
        ztNo: oradata.managerCHandaoID,
        // 以上为必填项
        hotUpdate: oradata.managerHotUpdate,
        dataUpdate: oradata.managerDataUpgrade,
        interUpdate: oradata.managerInteUpgrade,
        presetData: oradata.managerPreData,
        testCheck: oradata.managertesterVerifi,
        scopeLimit: oradata.managerSuggestion,
        proposedTest: oradata.managerProTested === "" ? null : oradata.managerProTested,
        publishEnv: pubEnv,
        // tester: rowDatas.tester,
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
    const testerModify = async (datas: any) => {
      // 获取英文名
      const teters = datas.tester.split(';');
      const deptUsers = await getDeptMemner(gqlClient, "测试");
      const nameIdArray = getUsersId(deptUsers, teters);

      formForTesterToMod.setFieldsValue({
        testerChandaoType: numberRenderToZentaoType({value: datas.category === null ? '' : datas.category.toString()}),
        testerCHandaoID: datas.ztNo,
        testerTitle: datas.title,
        testChandaoStatus: numberRenderToZentaoStatus({
          value: datas.ztStatus === null ? '' : datas.ztStatus.toString(),
        }),
        testToTester: nameIdArray,
        testerProTested: datas.proposedTest,
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
        project: prjId,
        category: zentaoTypeRenderToNumber(oradata.testerChandaoType),
        ztNo: oradata.testerCHandaoID,
        // 以上为必填字段
        proposedTest: oradata.testerProTested === "" ? null : oradata.testerProTested,
        memo: oradata.testerRemark,

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
        // 用;拼接测试人员
        let testers = "";
        oradata.testToTester.forEach((eles: any) => {
          testers = testers === "" ? eles : `${testers};${eles}`;
        });
        datas["tester"] = testers;
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
        project: prjId,
        category: zentaoTypeRenderToNumber(oradata.uedChandaoType),
        ztNo: oradata.uedCHandaoID,
        // 以上为必填字段

        uedEnvCheck: oradata.uedForUedVerify,
        uedOnlineCheck: oradata.UedOnlineVerti,
        memo: oradata.uedRemark,

        // source: rowDatas.uedSource,
        // feedback: rowDatas.feedback,
        // tester: rowDatas.tester,
        // hotUpdate: rowDatas.hotUpdate,
        // dataUpdate: rowDatas.dataUpdate,
        // interUpdate: rowDatas.interUpdate,
        // presetData: rowDatas.presetData,
        // testCheck: rowDatas.testCheck,
        // scopeLimit: rowDatas.scopeLimit,
        // publish: rowDatas.publishEnv,

      };

      if (formForUEDToMod.isFieldTouched('uedForUED')) {
        datas["uedName"] = oradata.uedForUED;
      }
      modCommitDetails(datas);
    };


    /* endregion */

    // 权限判定-----------------------不同权限修改不同页面
    const authorityForMod = (detailsInfo: any) => {
      // 判断人员权限（admin，测试，开发经理（开发）,UED）
      let currentUserGroup;
      if (initialState?.currentUser) {
        currentUserGroup = initialState.currentUser === undefined ? "" : initialState.currentUser.group;
      }
      // currentUserGroup = 'superGroup';
      if (currentUserGroup !== undefined) {
        switch (currentUserGroup.toString()) {
          case 'superGroup':
          case 'projectListMG':
            adminModify(detailsInfo);
            break;
          case 'testGroup':
            testerModify(detailsInfo);
            break;
          case 'devManageGroup':
          case 'devGroup':
            managerModify(detailsInfo);
            break;
          case 'UedGroup':
            uedModify(detailsInfo);
            break;
          default:
            break;
        }
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
      // if (selRows.length > 1) {
      //   message.error({
      //     content: '一次只能删除一条数据!',
      //     duration: 1,
      //     className: 'delMore',
      //     style: {
      //       marginTop: '50vh',
      //     },
      //   });
      //   return;
      // }
      setIsDelModalVisible(true);
    };

    const delSprintList = () => {
      const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      const deleteIdArray: any = [];
      selRows.forEach((rows: any) => {
        const {id} = rows;
        if (rows.category === "1") {
          deleteIdArray.push(`BUG_${id}`);
        } else if (rows.category === "2") {
          deleteIdArray.push(`TASK_${id}`);
        } else if (rows.category === "3") {
          deleteIdArray.push(`STORY_${id}`);
        }

      });

      axios.delete('/api/sprint/project/child', {data: {data: deleteIdArray}})
        .then(function (res) {
          if (res.data.ok === true) {
            setIsDelModalVisible(false);
            updateGrid();
            message.info({
              content: "记录删除成功！",
              duration: 1, // 1S 后自动关闭
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}`,
              duration: 1, // 1S 后自动关闭
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
        moveForOraPrj: prjNames
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
        "source": prjId,
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
      if (datas === null) {
        message.error({
          content: '判断重复数据失败！',
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else if (datas.ok === true) {  //  // 时间选择后禁用某些控件
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

        const rows = selRows[index];
        if (rows.category === "1") {
          selIds.push(`BUG_${rows.id}`);
        } else if (rows.category === "2") {
          selIds.push(`TASK_${rows.id}`);
        } else if (rows.category === "3") {
          selIds.push(`STORY_${rows.id}`);
        }
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
          modFlowStage(8);
          break;
        case '开发已revert':
          modFlowStage(9);
          break;
        case '测试已验证revert':
          modFlowStage(10);
          break;
        case '灰度已验过':
          modFlowStage(11);
          break;
        case '线上已验过':
          modFlowStage(12);
          break;
        default:
          break;
      }
    };

    const flowCancel = () => {
      setIsFlowModalVisible(false);
    };

    /* endregion */

    /* region 设置字段 */

    const [isFieldModalVisible, setFieldModalVisible] = useState(false);
    const [selectedFiled, setSelectedFiled] = useState(['']);
    const nessField = ['选择', '类型', '编号'];
    const unNessField = ['阶段', '测试', '标题内容', '严重等级', '模块', '状态', '已提测', '发布环境',
      '指派给', '解决/完成人', '关闭人', '备注', '相关需求', '相关任务', '相关bug', '是否可热更', '是否有数据升级',
      '是否有接口升级', '是否有预置数据', '是否需要测试验证', '验证范围建议', 'UED', 'UED测试环境验证', 'UED线上验证', '来源', '反馈人'];


    const onSetFieldsChange = (checkedValues: any) => {
      setSelectedFiled(checkedValues);
    };

    // 界面显示
    const showFieldsModal = () => {
      const fields = localStorage.getItem("sp_details_filed");
      if (fields === null) {
        setSelectedFiled(nessField.concat(unNessField));
      } else {
        setSelectedFiled(JSON.parse(fields));
      }
      setFieldModalVisible(true);
    };

    const selectAllField = (e: any) => {
      if (e.target.checked === true) {
        setSelectedFiled(nessField.concat(unNessField));
      } else {
        setSelectedFiled(nessField);
      }

    };

    // 保存按钮
    const commitField = () => {
      localStorage.setItem("sp_details_filed", JSON.stringify(selectedFiled));
      setFieldModalVisible(false);
      // 首先需要清空原有列，否则会导致列混乱
      gridApi.current?.setColumnDefs([]);

      message.info({
        content: "保存成功！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

    };
    // 取消 按钮
    const fieldCancel = () => {
      setFieldModalVisible(false);
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
        breadcrumbName: '项目详情',
      }];

    useEffect(() => {

      const bugs = data?.resCount.bug === undefined ? 0 : data?.resCount.bug;
      const tasks = data?.resCount.task === undefined ? 0 : data?.resCount.task;
      const storys = data?.resCount.story === undefined ? 0 : data?.resCount.story;

      setPageTitle(`共 ${bugs + tasks + storys} 个，bug ${bugs} 个，task ${tasks} 个，story ${storys} 个`);
    }, [data]);

    return (

      <div style={{marginTop: "-20px"}}>

        <PageHeader
          ghost={false}
          title={prjNames}
          subTitle={<div style={{color: "black"}}> {pageTitle}</div>}
          style={{height: "100px"}}
          breadcrumb={{routes}}
        />


        {/* 新增、修改、删除按钮栏 */}
        <div style={{background: 'white', marginTop: "20px"}}>
          {/* 使用一个图标就要导入一个图标 */}
          {/* 明细操作按钮 */}

          <Button type="text" style={{color: 'black', display: judgeAuthority("新增项目明细行") === true ? "inline" : "none"}}
                  icon={<FolderAddTwoTone/>} size={'large'}
                  onClick={addProject}>新增</Button>
          <Button type="text" style={{color: 'black', display: judgeAuthority("修改项目明细行") === true ? "inline" : "none"}}
                  icon={<EditTwoTone/>} size={'large'}
                  onClick={btnModifyProject}>修改</Button>
          <Button type="text" style={{color: 'black', display: judgeAuthority("删除项目明细行") === true ? "inline" : "none"}}
                  icon={<DeleteTwoTone/>} size={'large'}
                  onClick={deleteSprintDetails}>删除</Button>
          <Button type="text" style={{color: 'black', display: judgeAuthority("移动项目明细行") === true ? "inline" : "none"}}
                  icon={<SnippetsTwoTone/>} size={'large'}
                  onClick={moveProject}>移动</Button>

          <Button type="text"
                  style={{color: 'black', float: 'right'}}
                  icon={<SettingOutlined/>} size={'large'}
                  onClick={showFieldsModal}> </Button>
          {/* <label style={{marginTop: '10px', color: 'black', fontWeight: 'bold', float: 'right'}}>设置：</label> */}


          {/* 操作流程按钮 */}
          <Button type="text" style={{color: 'black'}} size={'large'}> </Button>

          <Button type="text"
                  style={{color: 'black', float: 'right', display: judgeAuthority("线上已验证") === true ? "inline" : "none"}}
                  icon={<CheckSquareTwoTone/>} size={'large'}
                  onClick={flowForOnlineChecked}>线上已验证</Button>
          <Button type="text"
                  style={{color: 'black', float: 'right', display: judgeAuthority("灰度已验证") === true ? "inline" : "none"}}
                  icon={<CheckSquareTwoTone/>} size={'large'}
                  onClick={flowForHuiduChecked}>灰度已验证</Button>
          <Button type="text" style={{
            color: 'black',
            float: 'right',
            display: judgeAuthority("测试已验revert") === true ? "inline" : "none"
          }} icon={<CheckSquareTwoTone/>} size={'large'}
                  onClick={flowForTestRevert}>测试已验revert</Button>
          <Button type="text" style={{
            color: 'black',
            float: 'right',
            display: judgeAuthority("开发已revert") === true ? "inline" : "none"
          }} icon={<CheckSquareTwoTone/>} size={'large'}
                  onClick={flowForDevRevert}>开发已revert</Button>
          <Button type="text"
                  style={{color: 'black', float: 'right', display: judgeAuthority("取消") === true ? "inline" : "none"}}
                  icon={<CloseSquareTwoTone/>} size={'large'}
                  onClick={flowForCancle}>取消</Button>
          <label style={{marginTop: '10px', color: 'black', fontWeight: 'bold', float: 'right'}}>操作流程:</label>

        </div>

        {/* ag-grid 表格定义 */}
        <div className="ag-theme-alpine" style={{height: getHeight(), width: '100%'}}>
          <AgGridReact
            columnDefs={getColums()} // 定义列
            rowData={data?.result} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              minWidth: 100,
              suppressMenu: true,
              cellStyle: {"line-height": "30px"},
            }}

            autoGroupColumnDef={{
              minWidth: 100,
            }}
            rowHeight={32}
            headerHeight={35}
            rowSelection={'multiple'} // 设置多行选中
            groupDefaultExpanded={9} // 展开分组
            onGridReady={onGridReady}
            onRowDoubleClicked={rowClicked}
            excelStyles={[]}

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
                        <Option key={'3'} value={'3'}>开发完</Option>,
                        <Option key={'3'} value={'4'}>已提测</Option>,
                        <Option key={'4'} value={'5'}>测试中</Option>,
                        <Option key={'5'} value={'6'}>TE测试环境已验过</Option>,
                        <Option key={'6'} value={'7'}>UED测试环境已验过</Option>,
                        <Option key={'7'} value={'8'}>已取消</Option>,
                        <Option key={'8'} value={'9'}>开发已revert</Option>,
                        <Option key={'9'} value={'10'}>测试已验证revert</Option>,
                        <Option key={'10'} value={'11'}>灰度已验过</Option>,
                        <Option key={'11'} value={'12'}>线上已验过</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddTester" label="对应测试:" rules={[{required: true}]}>
                    <Select
                      mode="tags"
                      style={widths}
                      placeholder="请输入"
                      optionFilterProp="children"
                    >
                      {LoadCombobox('测试')}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminChandaoType" label="禅道类型：" rules={[{required: true}]}>
                    <Select placeholder="请选择" style={{width: '180px', color: 'black'}}>
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
                <div style={{marginLeft: '10px'}}>
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
                <div style={{marginLeft: "35px"}}>
                  <Form.Item name="adminAddPriority" label="优先级：">
                    <Select disabled={true} placeholder="请选择" style={{width: '210px', color: 'black'}}>
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
                <div style={{marginLeft: "30px"}}>
                  <Form.Item name="adminAddModule" label="所属模块:">
                    <Input disabled={true} style={{width: '188px'}}/>
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
                <div style={{marginLeft: '33px'}}>
                  <Form.Item name="adminAddAssignTo" label="指派给:">
                    <Input disabled={true} style={{width: '212px', color: 'black'}}/>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSolvedBy" label="解决/完成人:">
                    <Input disabled={true} style={{width: '180px', color: 'black'}}/>
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
                  <Form.Item name="adminAddHotUpdate" label="是否可热更:">
                    <Select placeholder="请选择" style={{width: '195px'}}>
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
                    <Select placeholder="请选择" style={{width: '160px'}}>
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
                    <Select placeholder="请选择" style={{width: '165px'}}>
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
                    <Select placeholder="请选择" style={{width: '148px'}}>
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
                <div style={{marginLeft: '35px'}}>
                  <Form.Item name="adminAddProposedTest" label="已提测：">
                    <Select placeholder="请选择" style={{width: '200px'}}>
                      {[
                        <Option key={''} value={''}> </Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'2'} value={'2'}>免</Option>
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddSuggestion" label="验证范围建议:">
                    <Input style={{width: '490px'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddEnvironment" label="发布环境:">
                    <Select placeholder="请选择" style={widths} mode="tags"
                            optionFilterProp="children">
                      {[
                        <Option key={'集群1'} value={'集群1'}>集群1</Option>,
                        <Option key={'集群2'} value={'集群2'}>集群2</Option>,
                        <Option key={'集群3'} value={'集群3'}>集群3</Option>,
                        <Option key={'集群4'} value={'集群4'}>集群4</Option>
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={{marginLeft: '30px'}}>
                  <Form.Item name="adminAddForUED" label="对应UED：">
                    <Select placeholder="请选择" style={widths}>
                      {LoadCombobox('UED')}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddForUedVerify" label="UED测试环境验证：">
                    <Select placeholder="请选择" style={{width: '150px'}}>
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
                    <Select placeholder="请选择" style={{width: '175px', color: 'black'}}>
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
                  <Form.Item name="adminAddSource" label="来源:">
                    <Select
                      placeholder="请选择"
                      defaultValue={['手工录入']}
                      disabled={true}
                      style={{width: '210px', color: 'black'}}
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
                <div style={{marginLeft: "35px"}}>
                  <Form.Item name="adminAddFeedbacker" label="反馈人:">
                    <Select placeholder="请选择" style={widths} showSearch optionFilterProp="children">
                      {LoadCombobox('all')}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="adminAddRemark" label="备注:">
                    <Input style={{width: '855px'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            {/* 以下为不用显示出来但是需要传递的数据 */}
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="createTime_hidden">
                    <Input hidden={true} style={widths}/>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="activeTime_hidden">
                    <Input hidden={true} style={widths}/>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="resolveTime_hidden">
                    <Input hidden={true} style={{width: '185px', color: 'black'}}/>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Form.Item>
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
                <div style={{marginLeft: '65px'}}>
                  <Form.Item name="managerProTested" label="已提测：">
                    <Select placeholder="请选择" style={{width: '200px'}}>
                      {[
                        <Option key={''} value={''}> </Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'2'} value={'2'}>免</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={{marginLeft: '50px'}}>
                  <Form.Item name="managerEnvironment" label="发布环境:">
                    <Select placeholder="请选择" style={{width: '515px'}} mode="tags"
                            optionFilterProp="children">
                      {[
                        <Option key={'集群1'} value={'集群1'}>集群1</Option>,
                        <Option key={'集群2'} value={'集群2'}>集群2</Option>,
                        <Option key={'集群3'} value={'集群3'}>集群3</Option>,
                        <Option key={'集群4'} value={'集群4'}>集群4</Option>
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
                    <Input style={{width: '515px'}}/>
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
                    <Select placeholder="请选择"
                            style={widths}
                            mode="tags"
                            optionFilterProp="children">
                      {LoadCombobox('测试')}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row">
                <div style={{marginLeft: '35px'}}>
                  <Form.Item name="testerProTested" label="已提测：">
                    <Select placeholder="请选择" style={{width: '200px'}}>
                      {[
                        <Option key={''} value={''}> </Option>,
                        <Option key={'0'} value={'0'}>否</Option>,
                        <Option key={'1'} value={'1'}>是</Option>,
                        <Option key={'2'} value={'2'}>免</Option>,
                      ]}
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col className="gutter-row">
                <div style={leftStyle}>
                  <Form.Item name="testerRemark" label="备 注:">
                    <Input style={{width: '270px'}}/>
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
                      {LoadCombobox('UED')}
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

        <Modal
          title={'自定义字段'}
          visible={isFieldModalVisible}
          onCancel={fieldCancel}
          centered={true}
          footer={null}
          width={920}
        >
          <Form>
            <div>
              <Checkbox.Group style={{width: '100%'}} value={selectedFiled} onChange={onSetFieldsChange}>
                <Row>
                  <Col span={4}>
                    <Checkbox defaultChecked disabled value="选择">选择</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox defaultChecked disabled value="类型">类型</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox defaultChecked disabled value="编号">编号</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="阶段">阶段</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="测试">测试</Checkbox>
                  </Col>

                  <Col span={4}>
                    <Checkbox value="标题内容">标题内容</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="严重等级">严重等级</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="模块">模块</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="状态">状态</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="发布环境">发布环境</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="已提测">已提测</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="指派给">指派给</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="解决/完成人">解决/完成人</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="关闭人">关闭人</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="备注">备注</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="相关需求">相关需求</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="相关任务">相关任务</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="相关bug">相关bug</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="是否可热更">是否可热更</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="是否有数据升级">是否有数据升级</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="是否有接口升级">是否有接口升级</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="是否有预置数据">是否有预置数据</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="是否需要测试验证">是否需要测试验证</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="验证范围建议">验证范围建议</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="UED">UED</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="UED测试环境验证">UED测试环境验证</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="UED线上验证">UED线上验证</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="来源">来源</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="反馈人">反馈人</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>,
            </div>

            <div>
              <Checkbox onChange={selectAllField}>全选</Checkbox>

              <Button type="primary" style={{marginLeft: '300px'}} onClick={commitField}>
                确定</Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={fieldCancel}>
                取消</Button>
            </div>

          </Form>
        </Modal>

      </div>
    );
  }
;
export default SprintList;
