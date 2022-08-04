import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useRequest } from 'ahooks';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { useGqlClient } from '@/hooks';
import {
  PageHeader,
  Button,
  message,
  Form,
  Select,
  Modal,
  Input,
  Row,
  Col,
  DatePicker,
  Checkbox,
  Spin,
  Breadcrumb,
  TreeSelect,
  Tooltip,
} from 'antd';
import { formatMomentTime } from '@/publicMethods/timeMethods';
import dayjs from 'dayjs';
import {
  // FolderAddTwoTone,
  // SnippetsTwoTone,
  // DeleteTwoTone,
  // EditTwoTone,
  CloseSquareTwoTone,
  CheckSquareTwoTone,
  SettingOutlined,
  ReloadOutlined,
  ClearOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  getProjectInfo,
  alayManagerData,
  defaultSelectParams,
  getRelatedPersonName,
  stageType,
} from './common';
import { getStaticMessage, headerPath } from './header';
import {
  numberRenderToCurrentStage,
  stageChangeToNumber,
  numberRenderToZentaoType,
  zentaoTypeRenderToNumber,
  numberRenderToZentaoSeverity,
  numberRenderToZentaoStatus,
  numberValueGetter,
} from '@/publicMethods/cellRenderer';
import moment from 'moment';
import { getHeight } from '@/publicMethods/pageSet';
import { judgeAuthority } from '@/publicMethods/authorityJudge';
import { useModel } from '@@/plugin-model/useModel';
import { getColums, setRowColor } from './grid';
import {
  queryDevelopViews,
  queryRepeats,
  LoadCombobox,
  LoadTesterCombobox,
  GetSprintProject,
  calTypeCount,
} from './data';
import { errorMessage, sucMessage } from '@/publicMethods/showMessages';
import {
  devCenterDept,
  getStageOption,
  getTypeOption,
  getAssignedToOption,
  getTesterOption,
  getSolvedByOption,
  filterDatasByCondition,
} from './filter';
import {
  requestModFlowStage,
  addSprintDetails,
  delSprintDetails,
  mosidySprintDetails,
  moveSprintDetails,
  addNewProjects,
  getZentaoInfo,
  syncDetailsData,
} from './common/axiosRequest';
import defaultTreeSelectParams from '@/pages/shimo/fileBaseline/iterateList/defaultSetting';
import styles from './sprintListDetails.less';
import { isEmpty } from 'lodash';
import RemoveModal from '@/pages/sprint/sprintListDetails/removeModal';
let ora_filter_data: any = [];

const gird_filter_condition: any = []; // 表格自带过滤了的条件
const { Option } = Select;
const SprintList: React.FC<any> = () => {
  const { initialState } = useModel('@@initialState');
  const { prjId, prjNames, prjType, showTestConfirmFlag } = getProjectInfo();
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  /* region 整个模块都需要用到的表单定义 */
  // 模块查询
  const [formForQuery] = Form.useForm();
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
  const [pageTitle, setPageTitle] = useState(<label></label>);
  const [personName, setPersonName] = useState({
    assignedTo: [],
    tester: [],
    solvedBy: [],
  });

  /* endregion */

  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const gqlClient = useGqlClient();
  const { data, loading } = useRequest(() =>
    queryDevelopViews(gqlClient, prjId, prjType, true, showTestConfirmFlag),
  );

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight());
  window.onresize = function () {
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };
  /* endregion */

  /* region 下拉框动态加载 以及条件筛选 */
  const [selectOption, setSelectOptions] = useState({
    deptSelect: [],
    stageSelect: [],
    typeSelect: [],
    assignedSelect: [],
    testSelect: [],
    solvedSelect: [],
  });

  // 获取表格中的数据(最原始的，从gql中拿取的数据)
  const getOraGridData = () => {
    const datas: any = [];
    gridApi.current?.forEachNode((rows: any) => {
      datas.push(rows?.data);
    });
    return datas;
  };

  // 获取表格中的数据（进行过滤后，界面可以看到的数据）
  const getFilteredGridData = () => {
    const datas: any = [];
    gridApi.current?.forEachNodeAfterFilter((rows: any) => {
      datas.push(rows?.data);
    });
    return datas;
  };

  // 部门下拉框
  const onDeptSelectFocus = async () => {
    const optionArray: any = await devCenterDept(gqlClient, getFilteredGridData());
    setSelectOptions({
      ...selectOption,
      deptSelect: optionArray,
    });
  };
  // 获取阶段下拉框
  const onStageSelectFocus = () => {
    const optionArray: any = getStageOption(getFilteredGridData());
    setSelectOptions({
      ...selectOption,
      stageSelect: optionArray,
    });
  };

  // 获取类型下拉框
  const onTypeSelectFocus = () => {
    const optionArray: any = getTypeOption(getFilteredGridData());
    setSelectOptions({
      ...selectOption,
      typeSelect: optionArray,
    });
  };

  // 获取指派给下拉框
  const onAssignedSelectFocus = () => {
    const optionArray: any = getAssignedToOption(personName?.assignedTo, getFilteredGridData());
    setSelectOptions({
      ...selectOption,
      assignedSelect: optionArray,
    });
  };

  // 测试下拉框
  const onTestSelectFocus = () => {
    const optionArray: any = getTesterOption(personName?.tester, getFilteredGridData());
    setSelectOptions({
      ...selectOption,
      testSelect: optionArray,
    });
  };

  // 解决人/完成人
  const onSolvedSelectFocus = () => {
    const optionArray: any = getSolvedByOption(personName?.solvedBy, getFilteredGridData());
    setSelectOptions({
      ...selectOption,
      solvedSelect: optionArray,
    });
  };

  // 条件选择
  const onSelectChanged = () => {
    const queryCondition = formForQuery.getFieldsValue();
    const filterData = filterDatasByCondition(queryCondition, ora_filter_data);
    gridApi.current?.setRowData(filterData);

    // 过滤表格自带条件
    const hardcodedFilter = {};
    gird_filter_condition.forEach((ele: any) => {
      hardcodedFilter[ele.column] = { type: 'set', values: ele.filterValue };
    });
    gridApi.current?.setFilterModel(hardcodedFilter);

    // 还要设置title
    const countRt = calTypeCount(getFilteredGridData());
    setPageTitle(getStaticMessage(countRt));
  };
  /* endregion 下拉框动态加载 */

  /* region 表格更新 */

  // 获取表格中的过滤条件
  const getGridFilterValue = (params: any) => {
    const columnID = params.column?.colId;
    // 判断是否有对应列，有的话删除后再添加，
    if (gird_filter_condition && gird_filter_condition.length) {
      gird_filter_condition.forEach((ele: any, index: number) => {
        if (ele.column === columnID) {
          gird_filter_condition.splice(index, 1);
        }
      });
    }

    const filterValues: any = [];
    const currentValue: any = params.filterInstance.valueModel.selectedValues;
    currentValue.forEach((ele: any) => {
      filterValues.push(ele);
    });
    if (filterValues.length > 0) {
      gird_filter_condition.push({
        column: columnID,
        filterValue: filterValues,
      });
    }

    console.log('gird_filter_condition', gird_filter_condition);
  };
  const updateGrid = async () => {
    // 需要结合筛选条件
    const datas: any = await queryDevelopViews(
      gqlClient,
      prjId,
      prjType,
      false,
      showTestConfirmFlag,
    );
    ora_filter_data = datas?.result;
    onSelectChanged();
  };

  /* endregion */

  /* region  各个权限修改弹窗以及事件 */

  /* region admin 的新增功能和修改功能  */
  //  弹出框
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isformForManagerToModVisible, setformForManagerToModVisible] = useState(false);
  const [isformForTesterToModVisible, setformForTesterToModVisible] = useState(false);
  const [isformForUEDToModVisible, setformForUEDToModVisible] = useState(false);
  const [modal, setmodal] = useState({ title: '新增明细行' });

  // 失去焦点后查询值
  const checkZentaoInfo = async (params: any) => {
    const ztno = params.target.value;
    const chanDaoType = formForAdminToAddAnaMod.getFieldValue('adminChandaoType');
    if (chanDaoType === '') {
      errorMessage(`禅道类型不能为空！`);
      return;
    }
    if (ztno === '') {
      errorMessage(`禅道编号不能为空！`);
      return;
    }

    const result = await getZentaoInfo(prjId, chanDaoType, ztno);
    if (result.ok === true) {
      const queryDatas = result.ztRecord;
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
        adminAddChandaoStatus: numberRenderToZentaoStatus({
          value: queryDatas.ztStatus === null ? '' : queryDatas.ztStatus.toString(),
        }),
        adminAddAssignTo: queryDatas.assignedTo,
        adminAddSolvedBy:
          queryDatas.finishedBy === undefined ? queryDatas.resolvedBy : queryDatas.finishedBy,
        adminAddClosedBy: queryDatas.closedBy,
        // adminAddFeedbacker: queryDatas.feedback,
        createTime_hidden:
          dayjs(queryDatas.openedAt).format('YYYY-MM-DD HH:mm:ss') === 'Invalid Date'
            ? ''
            : dayjs(queryDatas.openedAt).format('YYYY-MM-DD HH:mm:ss'),
        activeTime_hidden:
          dayjs(queryDatas.activedAt).format('YYYY-MM-DD HH:mm:ss') === 'Invalid Date'
            ? ''
            : dayjs(queryDatas.activedAt).format('YYYY-MM-DD HH:mm:ss'),
        resolveTime_hidden:
          dayjs(queryDatas.resolvedAt).format('YYYY-MM-DD HH:mm:ss') === 'Invalid Date'
            ? ''
            : dayjs(queryDatas.resolvedAt).format('YYYY-MM-DD HH:mm:ss'),
      });
    } else {
      if (Number(result.code) === 404) {
        errorMessage(`禅道不存在ID为${ztno}的${numberRenderToZentaoType({ value: chanDaoType })}`);
      } else if (Number(result.code) === 409) {
        errorMessage(
          `【${prjNames}】已存在ID为${ztno}的${numberRenderToZentaoType({ value: chanDaoType })}`,
        );
      } else {
        errorMessage(`${result.message.toString()}`);
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
  };

  // 点击新增按钮赋值弹出窗
  const addProject = () => {
    // formForAdminToAddAnaMod.resetFields();
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
      adminAddPageadjust: '',
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
      adminAddFeedbacker: '',
      adminAddRemark: '',
      adminAddBaseLine: '',
      adminClearCache: '',
    });

    setmodal({ title: '新增明细行' });
    // 赋值给控件
    setIsAddModalVisible(true);
  };

  // 点击修改按钮赋值弹出窗
  const adminModify = async (datas: any) => {
    // 还要获取英文名
    const nameIdArray: any = [];
    const teters = datas.tester;
    if (teters && teters.length > 0) {
      teters.forEach((ele: any) => {
        nameIdArray.push(ele.name);
      });
    }
    // const teters = datas.tester.split(';');
    // const deptUsers = await getDeptMemner(gqlClient, "测试");
    // const nameIdArray = getUsersId(deptUsers, teters);

    let publishEnv: any = [];
    if (datas.publishEnv !== null && datas.publishEnv !== '') {
      publishEnv = datas.publishEnv.split(';');
    }

    //  解析测试人员
    formForAdminToAddAnaMod.setFieldsValue({
      adminCurStage: numberRenderToCurrentStage({
        value: datas.stage === null ? '' : datas.stage.toString(),
      }),
      adminAddTester: nameIdArray,
      adminChandaoType: datas.category === '-3' ? '3' : datas.category,
      adminChandaoId: datas.ztNo,
      adminAddChandaoTitle: datas.title,
      adminAddSeverity: datas.severity,
      adminAddPriority: datas.priority,
      adminAddModule: datas.moduleName,
      adminAddChandaoStatus: numberRenderToZentaoStatus({
        value: datas.ztStatus === null ? '' : datas.ztStatus.toString(),
      }),
      adminAddAssignTo: datas.assignedTo?.name,
      adminAddSolvedBy: datas.finishedBy?.name,
      adminAddClosedBy: datas.closedBy,
      adminAddPageadjust: numberValueGetter(datas.pageAdjust),
      adminAddHotUpdate: numberValueGetter(datas.hotUpdate),
      adminAddDataUpgrade: numberValueGetter(datas.dataUpdate),
      adminAddInteUpgrade: numberValueGetter(datas.interUpdate),
      adminAddPreData: numberValueGetter(datas.presetData),
      adminAddtesterVerifi: numberValueGetter(datas.testCheck),
      adminAddSuggestion: datas.scopeLimit,
      adminAddProposedTest: datas.proposedTest,
      adminAddEnvironment: publishEnv,
      adminAddForUED: datas.uedName,
      adminAddForUedVerify: datas.uedEnvCheck,
      adminAdminUedOnline: datas.uedOnlineCheck,
      adminAddSource: datas.source,
      adminAddFeedbacker: datas.feedback,
      adminAddRemark: datas.memo,
      adminAddBaseLine: datas.baseline,
      adminClearCache:
        datas.clearCache === '-1' ? '1' : datas.clearCache === '-0' ? '0' : datas.clearCache,
    });
    setmodal({ title: '修改明细行(admin)' });
    setIsAddModalVisible(true);
  };

  //  发送请求 新增数据
  const addCommitDetails = async (datas: any) => {
    const result = await addSprintDetails(datas);
    if (result.ok === true) {
      setIsAddModalVisible(false);
      updateGrid();
      sucMessage('明细新增成功！');
    } else if (Number(result.code) === 403) {
      errorMessage('您无权新增明细！');
    } else if (Number(result.code) === 409) {
      errorMessage(
        `【${prjNames}】已存在ID为${datas.ztNo}的${numberRenderToZentaoType({
          value: datas.category,
        })}`,
      );
    } else {
      errorMessage(`${result.message}`);
    }
  };

  //   发送请求 修改数据
  const modCommitDetails = async (datas: any) => {
    const result = await mosidySprintDetails(datas);
    if (result.ok === true) {
      setformForTesterToModVisible(false);
      setIsAddModalVisible(false);
      setformForManagerToModVisible(false);
      setformForUEDToModVisible(false);
      updateGrid();
      sucMessage('修改成功！');
    } else if (Number(result.code) === 403) {
      errorMessage('您无权修改明细！');
    } else if (Number(result.code) === 409) {
      errorMessage(
        `【${prjNames}】已存在ID为${datas.ztNo}的${numberRenderToZentaoType({
          value: datas.category,
        })}`,
      );
    } else {
      errorMessage(`${result.message}`);
    }
  };

  // commit 事件 admin 新增和修改的操作
  const commitSprintDetails = () => {
    /* region 数据获取和提醒 */
    const oradata = formForAdminToAddAnaMod.getFieldsValue();
    if (
      oradata.adminAddTester === '' ||
      oradata.adminAddTester === null ||
      oradata.adminAddTester === undefined
    ) {
      message.error({
        content: `对应测试不能为空！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    // 用;拼接测试人员
    let testers = '';
    oradata.adminAddTester.forEach((eles: any) => {
      testers = testers === '' ? eles : `${testers};${eles}`;
    });
    // 用;拼接发布环境
    let pubEnv = '';
    if (oradata.adminAddEnvironment !== undefined) {
      oradata.adminAddEnvironment.forEach((eles: any) => {
        pubEnv = pubEnv === '' ? eles : `${pubEnv};${eles}`;
      });
    }

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
      stage:
        Number(oradata.adminCurStage).toString() === 'NaN'
          ? stageChangeToNumber(oradata.adminCurStage)
          : Number(oradata.adminCurStage),
      category: oradata.adminChandaoType,
      pageAdjust: oradata.adminAddPageadjust === '' ? null : oradata.adminAddPageadjust,
      hotUpdate: oradata.adminAddHotUpdate === '' ? null : oradata.adminAddHotUpdate,
      dataUpdate: oradata.adminAddDataUpgrade === '' ? null : oradata.adminAddDataUpgrade,
      interUpdate: oradata.adminAddInteUpgrade === '' ? null : oradata.adminAddInteUpgrade,
      presetData: oradata.adminAddPreData === '' ? null : oradata.adminAddPreData,
      scopeLimit: oradata.adminAddSuggestion,
      proposedTest: oradata.adminAddProposedTest === '' ? null : oradata.adminAddProposedTest,
      publishEnv: pubEnv,
      uedEnvCheck: oradata.adminAddForUedVerify === '' ? null : oradata.adminAddForUedVerify,
      uedOnlineCheck: oradata.adminAdminUedOnline === '' ? null : oradata.adminAdminUedOnline,
      memo: oradata.adminAddRemark,
      baseline: oradata.adminAddBaseLine === '' ? null : oradata.adminAddBaseLine,
      // 隐藏的字段
      // openedAt: oradata.createTime_hidden === "" ? null : oradata.createTime_hidden,
      // resolvedAt: oradata.resolveTime_hidden=== "" ? null : oradata.resolveTime_hidden,
      // activedAt: oradata.activeTime_hidden === "" ? null : oradata.activeTime_hidden,
    };

    if (oradata.createTime_hidden !== '') {
      datas['openedAt'] = oradata.createTime_hidden;
    }
    if (oradata.resolveTime_hidden !== '') {
      datas['resolvedAt'] = oradata.resolveTime_hidden;
    }
    if (oradata.activeTime_hidden !== '') {
      datas['activedAt'] = oradata.activeTime_hidden;
    }

    // 判断是管理员新增明细还是管理员修改明细行
    if (modal.title === '新增明细行') {
      datas['source'] = 7;
      datas['ztNo'] = oradata.adminChandaoId;
      datas['tester'] = testers;
      datas['uedName'] = oradata.adminAddForUED;
      datas['feedback'] = oradata.adminAddFeedbacker;
      datas['testCheck'] =
        oradata.adminAddtesterVerifi === '' ? '' : `-${oradata.adminAddtesterVerifi}`; // 新增的行都是为手动修改的数据
      datas['clearCache'] = oradata.adminClearCache === '' ? '' : `-${oradata.adminClearCache}`; // 手动修改是否清缓存

      addCommitDetails(datas);
    } else {
      const curRow: any = gridApi.current?.getSelectedRows(); // 获取选中的行
      datas['id'] = curRow[0].id;
      // 判断是否被修改过 禅道id 对应测试、对应UED、创建人,是否需要测试验证
      if (curRow[0].ztNo !== oradata.adminChandaoId) {
        datas['ztNo'] = oradata.adminChandaoId;
      }

      // 如果修改了禅道类型，那么category传入旧值，newCategory传入新值。
      const rowCategory = curRow[0].category === '-3' ? '3' : curRow[0].category;
      if (rowCategory !== oradata.adminChandaoType) {
        datas['category'] = curRow[0].category;
        datas['newCategory'] = oradata.adminChandaoType;
      }

      // 如果修改了是否需要测试验证，就要改为负值。
      if (curRow[0].testCheck !== oradata.adminAddtesterVerifi) {
        datas['testCheck'] =
          oradata.adminAddtesterVerifi === '' ? '' : `-${oradata.adminAddtesterVerifi}`; //  为手动修改的数据
      }

      // 如果修改了是否清缓存，就要改为负值。
      if (curRow[0].clearCache !== oradata.adminClearCache) {
        datas['clearCache'] = oradata.adminClearCache === '' ? '' : `-${oradata.adminClearCache}`; //  为手动修改的数据
      }

      if (formForAdminToAddAnaMod.isFieldTouched('adminAddTester')) {
        datas['tester'] = testers;
      }

      if (formForAdminToAddAnaMod.isFieldTouched('adminAddForUED')) {
        datas['uedName'] = oradata.adminAddForUED;
      }
      if (curRow[0].feedback !== oradata.adminAddFeedbacker) {
        datas['feedback'] = oradata.adminAddFeedbacker;
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
    let pubEnv = [];
    if (datas.publishEnv !== null && datas.publishEnv !== '') {
      pubEnv = datas.publishEnv.split(';');
    }

    formForManagerToMod.setFieldsValue({
      managerCHandaoID: datas.ztNo,
      managerChandaoType: numberRenderToZentaoType({
        value: datas.category === null ? '' : datas.category.toString(),
      }),
      managerDataUpgrade: numberValueGetter(datas.dataUpdate),
      managerProTested: datas.proposedTest,
      managerEnvironment: pubEnv,
      managerPageAdjust: numberValueGetter(datas.pageAdjust),
      managerHotUpdate: numberValueGetter(datas.hotUpdate),
      managerInteUpgrade: numberValueGetter(datas.interUpdate),
      managerPreData: numberValueGetter(datas.presetData),
      managerSuggestion: datas.scopeLimit,
      managerTitle: datas.title,
      managertesterVerifi: numberValueGetter(datas.testCheck),
      managerClearCache:
        datas.clearCache === '-1' ? '1' : datas.clearCache === '-0' ? '0' : datas.clearCache,
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
      errorMessage(`禅道类型和禅道编号不能为空！`);
      return;
    }
    const datas = alayManagerData(oradata, gridApi.current?.getSelectedRows(), prjId);
    modCommitDetails(datas);
  };

  /*  endregion */

  /* region 测试 权限操作 */
  // 测试 修改
  const testerModify = async (datas: any) => {
    // 获取测试
    const nameIdArray: any = [];
    const testerArray = datas.tester;
    if (testerArray && testerArray.length > 0) {
      testerArray.forEach((tester: any) => {
        nameIdArray.push(tester.id);
      });
    } else {
      nameIdArray.push('NA');
    }
    // const teters = datas.tester.split(';');
    // const deptUsers = await getDeptMemner(gqlClient, "测试");
    // const nameIdArray = getUsersId(deptUsers, teters);
    formForTesterToMod.setFieldsValue({
      testerChandaoType: numberRenderToZentaoType({
        value: datas.category === null ? '' : datas.category.toString(),
      }),
      testerCHandaoID: datas.ztNo,
      testerTitle: datas.title,
      testChandaoStatus: numberRenderToZentaoStatus({
        value: datas.ztStatus === null ? '' : datas.ztStatus.toString(),
      }),
      testToTester: nameIdArray,
      testerProTested: datas.proposedTest,
      testerStage: numberRenderToCurrentStage({ value: datas.stage }),
      testerRemark: datas.memo,
    });
    setformForTesterToModVisible(true);
  };

  const testerHandleCancel = () => {
    setformForTesterToModVisible(false);
  };

  const commitTesterModify = () => {
    const oradata = formForTesterToMod.getFieldsValue();
    if (oradata.testToTester === '' || oradata.testToTester === null) {
      errorMessage(`对应测试不能为空！`);
      return;
    }
    if (oradata.testerChandaoType === '' || oradata.testerCHandaoID === '') {
      errorMessage(`禅道类型和禅道编号不能为空！`);
      return;
    }
    const curRow: any = gridApi.current?.getSelectedRows(); // 获取选中的行
    const datas = {
      id: curRow[0].id,
      project: prjId,
      category: zentaoTypeRenderToNumber(oradata.testerChandaoType),
      // 以上为必填字段
      proposedTest: oradata.testerProTested === '' ? null : oradata.testerProTested,
      // 测试不能修改当前阶段
      memo: oradata.testerRemark,
    };

    if (formForTesterToMod.isFieldTouched('testToTester')) {
      // 用;拼接测试人员
      let testers = '';
      oradata.testToTester.forEach((eles: any) => {
        testers = testers === '' ? eles : `${testers};${eles}`;
      });
      datas['tester'] = testers;
    }

    modCommitDetails(datas);
  };

  /* endregion */

  /* region UED 权限操作 */
  // UED 修改
  const uedModify = (datas: any) => {
    formForUEDToMod.setFieldsValue({
      uedCHandaoID: datas.ztNo,
      uedChandaoType: numberRenderToZentaoType({
        value: datas.category === null ? '' : datas.category.toString(),
      }),
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
      errorMessage(`禅道类型和禅道编号不能为空！`);
      return;
    }
    const curRow: any = gridApi.current?.getSelectedRows(); // 获取选中的行
    const rowDatas = curRow[0];
    const datas = {
      id: rowDatas.id,
      project: prjId,
      category: zentaoTypeRenderToNumber(oradata.uedChandaoType),
      // 以上为必填字段
      uedEnvCheck: oradata.uedForUedVerify === '' ? null : oradata.uedForUedVerify,
      uedOnlineCheck: oradata.UedOnlineVerti === '' ? null : oradata.UedOnlineVerti,
      memo: oradata.uedRemark,
    };

    if (formForUEDToMod.isFieldTouched('uedForUED')) {
      datas['uedName'] = oradata.uedForUED;
    }
    modCommitDetails(datas);
  };

  /* endregion */

  // 某些特殊字段在某些组中不可修改
  const [specialFieldEdit, setSpecialFieldEdit] = useState({
    adminStage: true,
    managerUserPerceive: true,
  });

  // 权限判定-----------------------不同权限修改不同页面
  const authorityForMod = (detailsInfo: any) => {
    // 判断人员权限（admin，测试，开发经理（开发）,UED）
    let currentUserGroup;
    if (initialState?.currentUser) {
      currentUserGroup =
        initialState.currentUser === undefined ? '' : initialState.currentUser.group;
    }
    // currentUserGroup = 'devGroup';
    if (currentUserGroup !== undefined) {
      switch (currentUserGroup.toString()) {
        case 'superGroup':
          setSpecialFieldEdit({
            ...specialFieldEdit,
            adminStage: false,
          });
          adminModify(detailsInfo);
          break;
        case 'projectListMG':
          adminModify(detailsInfo);
          break;
        case 'testGroup':
          testerModify(detailsInfo);
          break;
        case 'devManageGroup':
          // 开发经理可以修改是否清缓存字段，其他开发不可以修改。
          setSpecialFieldEdit({
            ...specialFieldEdit,
            managerUserPerceive: false,
          });
          managerModify(detailsInfo);
          break;
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
      errorMessage('请选中需要修改的数据!');
      return;
    }
    // 一次只能修改一条数据
    if (selRows.length > 1) {
      errorMessage('一次只能修改一条数据!');
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

  const [isdelModalVisible, setIsDelModalVisible] = useState(false);
  // 删除按钮点击
  const deleteSprintDetails = () => {
    // 判断是否选中数据
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
    if (selRows.length === 0) {
      errorMessage('请选中需要删除的数据!');
      return;
    }
    setIsDelModalVisible(true);
  };

  // 删除选中的数据
  const delSprintList = async () => {
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
    const result = await delSprintDetails(selRows);
    if (result.ok === true) {
      setIsDelModalVisible(false);
      updateGrid();
      sucMessage('记录删除成功！');
    } else if (Number(result.code) === 403) {
      errorMessage('您无权删除明细！');
    } else {
      errorMessage(`${result.message}`);
    }
  };

  const DelCancel = () => {
    setIsDelModalVisible(false);
  };
  /* endregion */

  /* region 移动功能 */
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
  const [isMoveAddModalVisible, setIsMoveAddModalVisible] = useState(false);
  const [isAble, setisAble] = useState({ shown: false });

  // 窗口弹出，并赋值
  const moveProject = () => {
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
    if (selRows.length <= 0) {
      errorMessage('请选择需要移动的数据！');
      return;
    }

    formForMove.setFieldsValue({
      moveForOraPrj: prjNames,
    });
    setIsMoveModalVisible(true);
  };

  // 取消
  const moveCancel = () => {
    setIsMoveModalVisible(false);
  };

  // 发送请求
  const moveSprintList = async () => {
    // 获取被选择明细项
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行
    const oradata = formForMove.getFieldsValue();

    const result = await moveSprintDetails(selRows, prjId, oradata);
    if (result.ok === true) {
      setIsMoveModalVisible(false);
      updateGrid();
      sucMessage('明细移动成功！');
    } else if (Number(result.code) === 403) {
      errorMessage('您无权移动明细！');
    } else {
      const messages = result.verify === undefined ? result.message : result.verify;
      errorMessage(messages.toString());
    }
  };

  // 取消新增项目
  const addPrjCancel = () => {
    setIsMoveAddModalVisible(false);
  };

  // 新增项目赋值
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

  // 时间选择事件
  const formTimeSelected = async () => {
    const values = formForMoveAddAnaMod.getFieldsValue();
    const prjName = `${values.prjNames}${values.prjDate.format('YYYYMMDD')}`;
    const datas: any = await queryRepeats(gqlClient, prjName);
    if (datas === null) {
      errorMessage('判断重复数据失败！');
    } else if (datas.ok === true) {
      //  // 时间选择后禁用某些控件
      // 可以新增项目
      setisAble({ shown: false });
      formForMoveAddAnaMod.setFieldsValue({
        prjLable: '',
      });
    } else {
      setisAble({ shown: true });
      formForMoveAddAnaMod.setFieldsValue({
        prjLable: '重复项目',
        // prjStatus: data.data.status  // data 可能没有数据
      });
    }
  };

  // 发送请求新增项目
  const commitAddProject = async () => {
    const values = formForMoveAddAnaMod.getFieldsValue();
    const prjtype = values.prjNames;
    if (prjtype === null) {
      errorMessage('项目类型不能为空!');
      return;
    }
    if (values.prjStatus === null) {
      errorMessage('项目状态不能为空!');
      return;
    }
    const result = await addNewProjects(values, prjtype);
    if (result.ok === true) {
      setIsMoveModalVisible(false);
      setIsMoveAddModalVisible(false);
      sucMessage('新增项目成功！');
    } else if (Number(result.code) === 403) {
      errorMessage('您无权新增项目！');
    } else {
      errorMessage(`${result.message}${result.zt.message.end[0]}`);
    }
  };

  /* endregion */

  /* region 操作流程 */

  const [isRevokeModalVisible, setIsRevokeModalVisible] = useState(false); // 撤销操作
  const [buttonMessage, setButtonHintMessage] = useState({ hintMessage: '' });
  const [isFlowModalVisible, setIsFlowModalVisible] = useState(false); // 其他流程按钮
  const [flowHitmessage, setFlowHitmessage] = useState({ hintMessage: '' });
  const [testConfirm, setTestConfirm] = useState(undefined);

  // 判断是否有勾选一条数据
  const judgingSelectdRow = () => {
    const selRows: any = gridApi.current?.getSelectedRows();
    if (selRows.length > 0) {
      return true;
    }
    errorMessage(`请至少选中一条记录进行操作！`);
    return false;
  };

  // 流程-取消
  const flowForCancle = () => {
    if (judgingSelectdRow()) {
      setFlowHitmessage({ hintMessage: '已取消' });
      setIsFlowModalVisible(true);
    }
  };

  // 流程-开发已revert
  const flowForDevRevert = () => {
    if (judgingSelectdRow()) {
      setFlowHitmessage({ hintMessage: '开发已revert' });
      setIsFlowModalVisible(true);
    }
  };

  // 流程-测试已验revert
  const flowForTestRevert = () => {
    if (judgingSelectdRow()) {
      setFlowHitmessage({ hintMessage: '测试已验证revert' });
      setIsFlowModalVisible(true);
    }
  };

  // 流程-灰度已验
  const flowForHuiduChecked = () => {
    if (judgingSelectdRow()) {
      setFlowHitmessage({ hintMessage: '灰度已验过' });
      setIsFlowModalVisible(true);
    }
  };

  // 流程-线上已验证
  const flowForOnlineChecked = () => {
    if (judgingSelectdRow()) {
      setFlowHitmessage({ hintMessage: '线上已验过' });
      setIsFlowModalVisible(true);
    }
  };

  // 修改操作流程
  const modFlowStage = async (content: any, values: any) => {
    const selRows: any = gridApi.current?.getSelectedRows();
    const result = await requestModFlowStage(selRows, content, values);
    if (result.code === 200) {
      setIsFlowModalVisible(false);
      setIsRevokeModalVisible(false);
      updateGrid();
      sucMessage('修改成功！');
      //   测试确认需要清空
      setTestConfirm(undefined);
    }
  };

  const commitFlow = () => {
    switch (flowHitmessage.hintMessage) {
      case '已取消':
        modFlowStage('stage', 8);
        break;
      case '开发已revert':
        modFlowStage('stage', 9);
        break;
      case '测试已验证revert':
        modFlowStage('stage', 10);
        break;
      case '灰度已验过':
        modFlowStage('stage', 11);
        break;
      case '线上已验过':
        modFlowStage('stage', 12);
        break;
      default:
        break;
    }
  };

  const flowCancel = () => {
    setIsFlowModalVisible(false);
  };

  // 以下为撤销和基线操作
  const flowForRevoke = () => {
    if (judgingSelectdRow()) {
      setButtonHintMessage({ hintMessage: '撤销' });
      setIsRevokeModalVisible(true);
    }
  };

  const flowForBaseLine = () => {
    if (judgingSelectdRow()) {
      setButtonHintMessage({ hintMessage: '基线' });
      setIsRevokeModalVisible(true);
    }
  };

  const revokeCancel = () => {
    setIsRevokeModalVisible(false);
  };

  const commitRevoke = () => {
    if (buttonMessage.hintMessage === '撤销') {
      modFlowStage('stage', 13);
    } else if (buttonMessage.hintMessage === '基线') {
      modFlowStage('baseline', '1');
    }
  };

  // 批量修改测试
  const testConfirmSelect = (params: any) => {
    if (judgingSelectdRow()) {
      // const selRows: any = gridApi.current?.getSelectedRows();
      // selRows.forEach((row: any) => {
      //
      // });
      setTestConfirm(params);
      modFlowStage('testConfirmed', params);
    }
  };
  /* endregion */

  /* region 设置字段 */
  const [isFieldModalVisible, setFieldModalVisible] = useState(false);
  const [selectedFiled, setSelectedFiled] = useState(['']);
  const nessField = ['选择', '序号', '类型', '编号']; // 必需的列
  const unNessField = [
    '阶段',
    '测试',
    '测试确认',
    '标题内容',
    '创建时间',
    '解决时间',
    '所属计划',
    '严重等级',
    '截止日期',
    '模块',
    '状态',
    '已提测',
    '发布环境',
    '指派给',
    '解决/完成人',
    '关闭人',
    '备注',
    '相关需求',
    '相关任务',
    '相关bug',
    '是否涉及页面调整',
    '是否可热更',
    '是否清缓存',
    '是否有数据升级',
    '是否有接口升级',
    '是否有预置数据修改',
    '测试验证?',
    '验证范围建议',
    'UED',
    'UED测试环境验证',
    'UED线上验证',
    '来源',
    '创建人',
    '是否延期',
  ];

  const onSetFieldsChange = (checkedValues: any) => {
    setSelectedFiled(checkedValues);
  };

  // 界面显示
  const showFieldsModal = () => {
    const fields = localStorage.getItem('sp_details_filed');
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
    localStorage.setItem('sp_details_filed', JSON.stringify(selectedFiled));
    setFieldModalVisible(false);
    // 首先需要清空原有列，否则会导致列混乱
    gridApi.current?.setColumnDefs([]);
    sucMessage('保存成功！');
  };
  // 取消 按钮
  const fieldCancel = () => {
    setFieldModalVisible(false);
  };
  /* endregion */

  /* region 手动同步数据 */
  const [refreshItem, setRefreshItem] = useState(false);
  const refreshGrid = async () => {
    setRefreshItem(true);
    const result = await syncDetailsData(prjId);
    if (result.ok === true) {
      updateGrid();
      sucMessage('项目详情同步成功！');
    } else {
      errorMessage(`错误：${result.message}`);
    }
    setRefreshItem(false);
  };
  /* endregion */
  const onClear = async () => {
    /*
        3 :story: 规则【未开始、开发中、开发完】
        1 、-3 : bug/b_story: 规则【未开始、开发中】
     */
    const selected: { stage: number; id: number; category: string; flag: boolean }[] | undefined =
      gridApi.current?.getSelectedRows().map((it) => ({
        stage: it.stage,
        id: it.id,
        category: it.category,
        flag: ['1', '-3'].includes(it.category)
          ? [1, 2].includes(it.stage)
            ? true
            : false
          : ['3'].includes(it.category)
          ? [1, 2, 3].includes(it.stage)
            ? true
            : false
          : false,
      }));
    message.destroy();
    if (isEmpty(selected)) return message.warning('请先选择需要移除的需求！');

    // 不满足规则的
    const dissatisfy = selected?.filter((it) => !it.flag);
    if (!isEmpty(dissatisfy)) {
      Modal.confirm({
        width: 500,
        centered: true,
        title: '移除需求提醒',
        okText: '确认',
        cancelText: '取消',
        icon: <ExclamationCircleOutlined />,
        onOk: () => {
          console.log(selected);
        },
        content: (
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            <p style={{ marginBottom: 5 }}>您需要移除的需求:</p>
            {dissatisfy?.map((it) => (
              <div style={{ display: 'flex', textIndent: '1em' }} key={it.id}>
                <div style={{ minWidth: 100 }}>{it.id}</div>
                <div style={{ minWidth: 100 }}>阶段为：{stageType[it.stage]}</div>
              </div>
            ))}
            <p style={{ marginTop: 5 }}>请确认是否仍要移除？</p>
          </div>
        ),
      });
      return;
    }
    console.log(selected);
  };

  const onRemove = async () => {
    if (isEmpty(gridApi.current?.getSelectedRows()))
      return message.warning('请先选择需要移除的需求！');
    setShowRemoveModal(true);
  };

  useEffect(() => {
    setPageTitle(getStaticMessage(data?.resCount));
    ora_filter_data = data?.result;
    //   需要取出最初的指派给、测试、解决完成人，用于下拉框筛选
    const personData = getRelatedPersonName(data?.result);
    setPersonName({
      assignedTo: personData?.assigned,
      tester: personData?.tester,
      solvedBy: personData?.solvedBy,
    });
  }, [data]);

  // useEffect(() => {
  //
  //   console.log(1111111, testConfirmFlag)
  //   // 过滤表格自带条件
  //   if (testConfirmFlag) {
  //     const hardcodedFilter = {"testConfirmed": {type: "set", values: ["否"]}};
  //     gridApi.current?.setFilterModel(hardcodedFilter);
  //     // testConfirmFlag = false;
  //   }
  // },[])

  const leftStyle = { marginLeft: '20px' };
  const rightStyle = { marginLeft: '30px' };
  const widths = { width: '200px', color: 'black' };
  const marginTopHeight = { marginTop: -15 };
  return (
    <div style={{ width: '100%', marginTop: '-30px' }} className={styles.sprintListDetails}>
      <PageHeader
        ghost={false}
        title={prjNames}
        style={{ height: '85px' }}
        breadcrumbRender={() => {
          return <Breadcrumb>{headerPath}</Breadcrumb>;
        }}
      />

      <Spin spinning={refreshItem} tip="项目详情同步中..." size={'large'}>
        {/* 蓝色title展示 */}
        <div style={{ color: 'blue', backgroundColor: 'white' }}> {pageTitle}</div>
        {/* 条件筛选 */}
        <Form form={formForQuery}>
          <Row gutter={5} style={{ background: 'white', marginTop: '5px', height: 30 }}>
            <Col span={8}>
              <Form.Item label="部门/组" name={'dept'}>
                <TreeSelect
                  className={'deptTree'}
                  size={'small'}
                  {...defaultTreeSelectParams}
                  treeDefaultExpandedKeys={[59]}
                  dropdownStyle={{ minHeight: 400, overflow: 'auto' }} // 下拉框的样式
                  listHeight={1200} // 下拉框中列表的设置。
                  onFocus={onDeptSelectFocus}
                  treeData={selectOption.deptSelect}
                  onChange={onSelectChanged}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="阶段" name={'stage'}>
                <Select
                  {...defaultSelectParams}
                  style={{ width: '100%' }}
                  onFocus={onStageSelectFocus}
                  onChange={onSelectChanged}
                >
                  {selectOption.stageSelect}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="类型" name={'types'}>
                <Select
                  {...defaultSelectParams}
                  style={{ width: '100%' }}
                  onFocus={onTypeSelectFocus}
                  onChange={onSelectChanged}
                >
                  {selectOption.typeSelect}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={5} style={{ background: 'white', height: 30 }}>
            <Col span={8}>
              <Form.Item label="指派给" name={'assignedTo'}>
                <Select
                  {...defaultSelectParams}
                  style={{ width: '100%' }}
                  onFocus={onAssignedSelectFocus}
                  onChange={onSelectChanged}
                >
                  {selectOption.assignedSelect}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="测试" name={'test'}>
                <Select
                  {...defaultSelectParams}
                  style={{ width: '100%' }}
                  onFocus={onTestSelectFocus}
                  onChange={onSelectChanged}
                >
                  {selectOption.testSelect}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="解决/完成" name={'solved'}>
                <Select
                  {...defaultSelectParams}
                  style={{ width: '100%' }}
                  onFocus={onSolvedSelectFocus}
                  onChange={onSelectChanged}
                >
                  {selectOption.solvedSelect}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* 明细操作按钮   */}
        <Row style={{ background: 'white', marginTop: '5px' }}>
          <Col span={22}>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {/*<Button type="text"*/}
              {/*        style={{*/}
              {/*          marginLeft: "-10px",*/}
              {/*          display: judgeAuthority("新增项目明细行") === true ? "inline" : "none"*/}
              {/*        }}*/}
              {/*        icon={<FolderAddTwoTone/>}*/}
              {/*        onClick={addProject}>新增</Button>*/}
              {/*<Button*/}
              {/*  type="text"*/}
              {/*  style={{*/}
              {/*    marginLeft: '-10px',*/}
              {/*    display: judgeAuthority('修改项目明细行') === true ? 'inline' : 'none',*/}
              {/*  }}*/}
              {/*  icon={<EditTwoTone />}*/}
              {/*  onClick={btnModifyProject}*/}
              {/*>*/}
              {/*  修改*/}
              {/*</Button>*/}
              {/*<Button*/}
              {/*  type="text"*/}
              {/*  style={{*/}
              {/*    marginLeft: '-10px',*/}
              {/*    display: judgeAuthority('删除项目明细行') === true ? 'inline' : 'none',*/}
              {/*  }}*/}
              {/*  icon={<DeleteTwoTone />}*/}
              {/*  onClick={deleteSprintDetails}*/}
              {/*>*/}
              {/*  删除*/}
              {/*</Button>*/}
              {/*<Button*/}
              {/*  type="text"*/}
              {/*  style={{*/}
              {/*    marginLeft: '-10px',*/}
              {/*    display: judgeAuthority('移动项目明细行') === true ? 'inline' : 'none',*/}
              {/*  }}*/}
              {/*  icon={<SnippetsTwoTone />}*/}
              {/*  onClick={moveProject}*/}
              {/*>*/}
              {/*  移动*/}
              {/*</Button>*/}
              <Tooltip
                title={'移除默认将该移除的内容关联到下个班车中'}
                overlayStyle={{ color: 'black' }}
              >
                <Button
                  type="text"
                  style={{ marginLeft: '-10px' }}
                  icon={<ClearOutlined style={{ color: '#228dff' }} />}
                  onClick={onRemove}
                >
                  移除
                </Button>
              </Tooltip>

              <label style={{ marginTop: '5px', fontWeight: 'bold', marginLeft: '10px' }}>
                操作流程:
              </label>
              <Button
                type="text"
                style={{ display: judgeAuthority('打基线') === true ? 'inline' : 'none' }}
                icon={<CheckSquareTwoTone />}
                onClick={flowForBaseLine}
              >
                基线
              </Button>

              <Button
                type="text"
                style={{
                  marginLeft: '-10px',
                  display: judgeAuthority('撤销') === true ? 'inline' : 'none',
                }}
                icon={<CloseSquareTwoTone />}
                onClick={flowForRevoke}
              >
                撤销
              </Button>

              {/*<Button*/}
              {/*  type="text"*/}
              {/*  style={{*/}
              {/*    marginLeft: '-10px',*/}
              {/*    display: judgeAuthority('取消') === true ? 'inline' : 'none',*/}
              {/*  }}*/}
              {/*  icon={<CloseSquareTwoTone />}*/}
              {/*  onClick={flowForCancle}*/}
              {/*>*/}
              {/*  取消*/}
              {/*</Button>*/}

              {/*<Button*/}
              {/*  type="text"*/}
              {/*  style={{*/}
              {/*    marginLeft: '-10px',*/}
              {/*    display: judgeAuthority('开发已revert') === true ? 'inline' : 'none',*/}
              {/*  }}*/}
              {/*  icon={<CheckSquareTwoTone />}*/}
              {/*  onClick={flowForDevRevert}*/}
              {/*>*/}
              {/*  开发已revert*/}
              {/*</Button>*/}

              <Button
                type="text"
                style={{
                  marginLeft: '-10px',
                  display: judgeAuthority('测试已验revert') === true ? 'inline' : 'none',
                }}
                icon={<CheckSquareTwoTone />}
                onClick={flowForTestRevert}
              >
                测试已验revert
              </Button>

              <Button
                type="text"
                style={{
                  marginLeft: '-10px',
                  display: judgeAuthority('灰度已验证') === true ? 'inline' : 'none',
                }}
                icon={<CheckSquareTwoTone />}
                onClick={flowForHuiduChecked}
              >
                灰度已验证
              </Button>

              <Button
                type="text"
                style={{
                  marginLeft: '-10px',
                  display: judgeAuthority('线上已验证') === true ? 'inline' : 'none',
                }}
                icon={<CheckSquareTwoTone />}
                onClick={flowForOnlineChecked}
              >
                线上已验证
              </Button>
              <label
                style={{
                  marginTop: '5px',
                  display: judgeAuthority(`修改"测试已确认"字段`) === true ? 'inline' : 'none',
                }}
              >
                测试确认:
              </label>
              <Select
                placeholder="请选择"
                value={testConfirm}
                style={{
                  marginLeft: '5px',
                  width: '85px',
                  marginTop: '4px',
                  display: judgeAuthority(`修改"测试已确认"字段`) === true ? 'inline' : 'none',
                }}
                size={'small'}
                onChange={testConfirmSelect}
              >
                {[
                  <Option key={'1'} value={'1'}>
                    是
                  </Option>,
                  <Option key={'0'} value={'0'}>
                    否
                  </Option>,
                ]}
              </Select>
            </div>
          </Col>
          <Col span={1} style={{ textAlign: 'right' }}>
            <div>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={refreshGrid}
                style={{ display: 'inline', float: 'right' }}
              >
                刷新
              </Button>
            </div>
          </Col>
          <Col span={1} style={{ textAlign: 'right' }}>
            <div>
              <Button type="text" icon={<SettingOutlined />} onClick={showFieldsModal}>
                {' '}
              </Button>
            </div>
          </Col>
        </Row>
        {/* ag-grid 表格定义 */}
        <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%' }}>
          <AgGridReact
            columnDefs={getColums(prjNames)} // 定义列
            rowData={data?.result} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              minWidth: 100,
              // suppressMenu: true,
              cellStyle: { 'line-height': '28px' },
            }}
            autoGroupColumnDef={{
              minWidth: 100,
            }}
            rowHeight={28}
            headerHeight={30}
            rowSelection={'multiple'} // 设置多行选中
            groupDefaultExpanded={9} // 展开分组
            onGridReady={onGridReady}
            onRowDoubleClicked={rowClicked}
            getRowStyle={setRowColor}
            onGridSizeChanged={onGridReady}
            onColumnEverythingChanged={onGridReady}
            tooltipShowDelay={500}
            onFilterModified={getGridFilterValue}
          />
        </div>
      </Spin>
      {/* admin新增和修改表单 */}
      <Modal
        title={modal.title}
        visible={isAddModalVisible} //
        onCancel={handleCancel}
        centered={true}
        footer={null}
        width={900}
      >
        {/* admin 权限组新增和修改的界面 */}
        <Form form={formForAdminToAddAnaMod}>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={8}>
              <Form.Item name="adminCurStage" label="当前阶段:">
                <Select disabled={specialFieldEdit.adminStage}>
                  {[
                    <Option key={'1'} value={'1'}>
                      未开始
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      开发中
                    </Option>,
                    <Option key={'3'} value={'3'}>
                      开发完
                    </Option>,
                    <Option key={'4'} value={'4'}>
                      已提测
                    </Option>,
                    <Option key={'5'} value={'5'}>
                      测试中
                    </Option>,
                    <Option key={'6'} value={'6'}>
                      TE测试环境已验过
                    </Option>,
                    <Option key={'7'} value={'7'}>
                      UED测试环境已验过
                    </Option>,
                    <Option key={'8'} value={'8'}>
                      已取消
                    </Option>,
                    <Option key={'9'} value={'9'}>
                      开发已revert
                    </Option>,
                    <Option key={'10'} value={'10'}>
                      测试已验证revert
                    </Option>,
                    <Option key={'11'} value={'11'}>
                      灰度已验过
                    </Option>,
                    <Option key={'12'} value={'12'}>
                      线上已验过
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddTester" label="对应测试:" rules={[{ required: true }]}>
                <Select
                  // mode="tags"
                  mode="multiple"
                  placeholder="请输入"
                  maxTagCount={'responsive'}
                  optionFilterProp="children"
                >
                  {LoadTesterCombobox()}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminChandaoType" label="禅道类型：" rules={[{ required: true }]}>
                <Select placeholder="请选择" style={{ color: 'black' }}>
                  {' '}
                  {/* disabled={isSelectType} */}
                  {[
                    <Option value={'1'}> Bug </Option>,
                    <Option value={'3'}> 需求 </Option>,
                    <Option value={'2'}> Task </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={8}>
              <Form.Item name="adminChandaoId" label="禅道编号:" rules={[{ required: true }]}>
                <Input placeholder="请输入" onBlur={checkZentaoInfo} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="adminAddChandaoTitle" label="标题内容:">
                <Input disabled={true} style={{ color: 'black' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={8}>
              <Form.Item name="adminAddSeverity" label="严重程度:">
                <Select disabled={true} placeholder="请选择">
                  {[
                    <Option key={'1'} value={'1'}>
                      P0
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      P1
                    </Option>,
                    <Option key={'3'} value={'3'}>
                      P2
                    </Option>,
                    <Option key={'4'} value={'4'}>
                      P3
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddPriority" label="优先级：">
                <Select disabled={true} placeholder="请选择" style={{ color: 'black' }}>
                  {[
                    <Option value={'1'}>1</Option>,
                    <Option value={'2'}>2</Option>,
                    <Option value={'3'}>3</Option>,
                    <Option value={'4'}>4</Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddModule" label="所属模块:">
                <Input disabled={true} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={8}>
              <Form.Item name="adminAddChandaoStatus" label="禅道状态:">
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddAssignTo" label="指派给:">
                <Input disabled={true} style={{ color: 'black' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddSolvedBy" label="解决/完成人:">
                <Input disabled={true} style={{ color: 'black' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={8}>
              <Form.Item name="adminAddClosedBy" label="由谁关闭:">
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddHotUpdate" label="是否可热更:">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminClearCache" label="是否清缓存:">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={8}>
              <Form.Item name="adminAddDataUpgrade" label="是否有数据升级:">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddInteUpgrade" label="是否有接口升级：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddPreData" label="是否有预置数据:">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={8}>
              <Form.Item name="adminAddtesterVerifi" label="是否需要测试验证：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddPageadjust" label="是否涉及页面调整：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddProposedTest" label="已提测：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      免
                    </Option>,
                    <Option key={'3'} value={'3'}>
                      驳回修改中
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={8}>
              <Form.Item name="adminAddBaseLine" label="是否基线：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="adminAddSuggestion" label="验证范围建议:">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={8}>
              <Form.Item name="adminAddEnvironment" label="发布环境:">
                <Select
                  placeholder="请选择"
                  mode="multiple"
                  optionFilterProp="children"
                  maxTagCount={'responsive'}
                >
                  {[
                    <Option key={'集群0'} value={'集群0'}>
                      集群1
                    </Option>,
                    <Option key={'集群1'} value={'集群1'}>
                      集群1
                    </Option>,
                    <Option key={'集群2'} value={'集群2'}>
                      集群2
                    </Option>,
                    <Option key={'集群3'} value={'集群3'}>
                      集群3
                    </Option>,
                    <Option key={'集群4'} value={'集群4'}>
                      集群4
                    </Option>,
                    <Option key={'集群5'} value={'集群5'}>
                      集群5
                    </Option>,
                    <Option key={'集群6'} value={'集群6'}>
                      集群6
                    </Option>,
                    <Option key={'集群7'} value={'集群7'}>
                      集群7
                    </Option>,
                    <Option key={'集群8'} value={'集群8'}>
                      集群8
                    </Option>,
                    <Option key={'global'} value={'global'}>
                      global
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddForUED" label="对应UED：">
                <Select placeholder="请选择">{LoadCombobox('UED')}</Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddForUedVerify" label="UED测试环境验证：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      验证通过
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      未通过
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      无需验证
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={8}>
              <Form.Item name="adminAdminUedOnline" label="UED线上验证:">
                <Select placeholder="请选择" style={{ color: 'black' }}>
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      验证通过
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      未通过
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      无需验证
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="adminAddSource" label="来源:">
                <Select
                  placeholder="请选择"
                  defaultValue={['手工录入']}
                  disabled={true}
                  style={{ color: 'black' }}
                >
                  {[
                    <Option key={'6'} value={'6'}>
                      禅道自动写入
                    </Option>,
                    <Option key={'7'} value={'7'}>
                      手工录入
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      《产品hotfix申请》
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      《UED-hotfix申请》
                    </Option>,
                    <Option key={'3'} value={'3'}>
                      《开发hotfix申请》
                    </Option>,
                    <Option key={'4'} value={'4'}>
                      《emergency申请》
                    </Option>,
                    <Option key={'5'} value={'5'}>
                      《开发热更新申请》
                    </Option>,
                    <Option key={'8'} value={'8'}>
                      自动获取
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="adminAddFeedbacker" label="创建人:">
                <Select placeholder="请选择" showSearch optionFilterProp="children">
                  {LoadCombobox('all')}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={24}>
              <Form.Item name="adminAddRemark" label="备注:">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          {/* 以下为不用显示出来但是需要传递的数据 */}
          <Row gutter={16} style={{ marginTop: '-50px' }}>
            <Col className="gutter-row">
              <div style={leftStyle}>
                <Form.Item name="createTime_hidden">
                  <Input hidden={true} style={widths} />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row">
              <div style={leftStyle}>
                <Form.Item name="activeTime_hidden">
                  <Input hidden={true} style={widths} />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row">
              <div style={leftStyle}>
                <Form.Item name="resolveTime_hidden">
                  <Input hidden={true} style={{ width: '185px', color: 'black' }} />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row">
              <Form.Item style={{ marginTop: '-10px' }}>
                <Button
                  type="primary"
                  style={{ marginLeft: '400px' }}
                  onClick={commitSprintDetails}
                >
                  确定
                </Button>
                <Button type="primary" style={{ marginLeft: '20px' }} onClick={handleCancel}>
                  取消
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 开发经理和开发修改表单 */}
      <Modal
        title="编辑明细行(开发)"
        visible={isformForManagerToModVisible} // isformForManagerToModVisible
        onCancel={mangerHandleCancel}
        centered={true}
        footer={null}
        width={650}
      >
        <Form form={formForManagerToMod}>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="managerChandaoType" label="禅道类型：">
                <Select placeholder="请选择" disabled={true}>
                  {[
                    <Option value={'1'}> Bug </Option>,
                    <Option value={'3'}> 需求 </Option>,
                    <Option value={'2'}> Task </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="managerCHandaoID" label="禅道编号:">
                <Input placeholder="请输入" disabled={true} style={{ color: 'black' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={24}>
              <Form.Item name="managerTitle" label="标题内容:">
                <Input disabled={true} style={{ color: 'black' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="managerHotUpdate" label="是否支持热更新:">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="managerClearCache" label="是否清缓存:">
                <Select placeholder="请选择" disabled={specialFieldEdit.managerUserPerceive}>
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="managerDataUpgrade" label="是否有数据升级:">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="managerInteUpgrade" label="是否有接口升级：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="managerPreData" label="是否有预置数据:">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="managertesterVerifi" label="是否需要测试验证：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="managerPageAdjust" label="是否涉及页面调整：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="managerProTested" label="已提测：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      免
                    </Option>,
                    <Option key={'3'} value={'3'}>
                      驳回修改中
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={24}>
              <Form.Item name="managerEnvironment" label="发布环境:">
                <Select
                  placeholder="请选择"
                  mode="multiple"
                  optionFilterProp="children"
                  maxTagCount={'responsive'}
                >
                  {[
                    <Option key={'集群0'} value={'集群0'}>
                      集群1
                    </Option>,
                    <Option key={'集群1'} value={'集群1'}>
                      集群1
                    </Option>,
                    <Option key={'集群2'} value={'集群2'}>
                      集群2
                    </Option>,
                    <Option key={'集群3'} value={'集群3'}>
                      集群3
                    </Option>,
                    <Option key={'集群4'} value={'集群4'}>
                      集群4
                    </Option>,
                    <Option key={'集群5'} value={'集群5'}>
                      集群5
                    </Option>,
                    <Option key={'集群6'} value={'集群6'}>
                      集群6
                    </Option>,
                    <Option key={'集群7'} value={'集群7'}>
                      集群7
                    </Option>,
                    <Option key={'集群8'} value={'集群8'}>
                      集群8
                    </Option>,
                    <Option key={'global'} value={'global'}>
                      global
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={24}>
              <Form.Item name="managerSuggestion" label="验证范围建议:">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" style={{ marginLeft: '230px' }} onClick={commitManagerModify}>
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={mangerHandleCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 测试修改表单 */}
      <Modal
        title="编辑明细行(测试)"
        visible={isformForTesterToModVisible} //  isformForTesterToModVisible
        onCancel={testerHandleCancel}
        centered={true}
        footer={null}
        width={650}
      >
        <Form form={formForTesterToMod}>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="testerChandaoType" label="禅道类型：">
                <Select placeholder="请选择" disabled={true}>
                  {[
                    <Option value={'1'}> Bug </Option>,
                    <Option value={'3'}> 需求 </Option>,
                    <Option value={'2'}> Task </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="testerCHandaoID" label="禅道编号:">
                <Input placeholder="请输入" disabled={true} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={24}>
              <Form.Item name="testerTitle" label="标题内容:">
                <Input disabled={true} style={{ color: 'black' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="testChandaoStatus" label="禅道状态:">
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="testerStage" label="当前阶段:">
                <Select disabled={true}>
                  {[
                    <Option key={'1'} value={'1'}>
                      未开始
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      开发中
                    </Option>,
                    <Option key={'3'} value={'3'}>
                      开发完
                    </Option>,
                    <Option key={'4'} value={'4'}>
                      已提测
                    </Option>,
                    <Option key={'5'} value={'5'}>
                      测试中
                    </Option>,
                    <Option key={'6'} value={'6'}>
                      TE测试环境已验过
                    </Option>,
                    <Option key={'7'} value={'7'}>
                      UED测试环境已验过
                    </Option>,
                    <Option key={'8'} value={'8'}>
                      已取消
                    </Option>,
                    <Option key={'9'} value={'9'}>
                      开发已revert
                    </Option>,
                    <Option key={'10'} value={'10'}>
                      测试已验证revert
                    </Option>,
                    <Option key={'11'} value={'11'}>
                      灰度已验过
                    </Option>,
                    <Option key={'12'} value={'12'}>
                      线上已验过
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="testToTester" label="对应测试:" rules={[{ required: true }]}>
                <Select
                  placeholder="请选择"
                  mode="multiple"
                  maxTagCount={'responsive'}
                  optionFilterProp="children"
                >
                  {LoadTesterCombobox()}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="testerProTested" label="已提测：">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      否
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      是
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      免
                    </Option>,
                    <Option key={'3'} value={'3'}>
                      驳回修改中
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={24}>
              <Form.Item name="testerRemark" label="备 注:">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" style={{ marginLeft: '230px' }} onClick={commitTesterModify}>
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={testerHandleCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* UED修改表单 */}
      <Modal
        title="编辑明细行(UED)"
        visible={isformForUEDToModVisible} // isformForUEDToModVisible
        onCancel={UEDHandleCancel}
        centered={true}
        footer={null}
        width={650}
      >
        <Form form={formForUEDToMod}>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="uedChandaoType" label="禅道类型：">
                <Select placeholder="请选择" disabled={true}>
                  {[
                    <Option value={'1'}> Bug </Option>,
                    <Option value={'3'}> 需求 </Option>,
                    <Option value={'2'}> Task </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="uedCHandaoID" label="禅道编号:">
                <Input placeholder="请输入" disabled={true} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={24}>
              <Form.Item name="uedTitle" label="标题内容:">
                <Input disabled={true} style={{ color: 'black' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="uedForUED" label="对应UED：">
                <Select placeholder="请选择">{LoadCombobox('UED')}</Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={leftStyle}>
                <Form.Item name="uedForUedVerify" label="UED测试环境验证：">
                  <Select placeholder="请选择">
                    {[
                      <Option key={''} value={''}>
                        {' '}
                      </Option>,
                      <Option key={'1'} value={'1'}>
                        验证通过
                      </Option>,
                      <Option key={'0'} value={'0'}>
                        未通过
                      </Option>,
                      <Option key={'2'} value={'2'}>
                        无需验证
                      </Option>,
                    ]}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={12}>
              <Form.Item name="UedOnlineVerti" label="UED线上验证:">
                <Select placeholder="请选择">
                  {[
                    <Option key={''} value={''}>
                      {' '}
                    </Option>,
                    <Option key={'1'} value={'1'}>
                      验证通过
                    </Option>,
                    <Option key={'0'} value={'0'}>
                      未通过
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      无需验证
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="uedSource" label="来 源:">
                <Select placeholder="请选择" disabled={true}>
                  {[
                    <Option key={'1'} value={'1'}>
                      《产品hotfix申请》
                    </Option>,
                    <Option key={'2'} value={'2'}>
                      《UED-hotfix申请》
                    </Option>,
                    <Option key={'3'} value={'3'}>
                      《开发hotfix申请》
                    </Option>,
                    <Option key={'4'} value={'4'}>
                      《emergency申请》
                    </Option>,
                    <Option key={'5'} value={'5'}>
                      《开发热更新申请》
                    </Option>,
                    <Option key={'6'} value={'6'}>
                      禅道自动写入
                    </Option>,
                    <Option key={'7'} value={'7'}>
                      手工录入
                    </Option>,
                    <Option key={'8'} value={'8'}>
                      自动获取
                    </Option>,
                  ]}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ ...marginTopHeight }}>
            <Col span={24}>
              <div>
                <Form.Item name="uedRemark" label="备 注:">
                  <Input />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" style={{ marginLeft: '230px' }} onClick={commitUedModify}>
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={UEDHandleCancel}>
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
            <label style={{ marginLeft: '20px' }}>删除将不能恢复，请确认是否删除？</label>
          </Form.Item>

          <Form.Item>
            <Button type="primary" style={{ marginLeft: '150px' }} onClick={delSprintList}>
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={DelCancel}>
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
          <div style={{ marginLeft: '60px' }}>
            <Form.Item name="moveForOraPrj" label="原项目名称:">
              <Input style={widths} disabled={true} />
            </Form.Item>
            <Form.Item label="新项目名称:">
              <Input.Group compact>
                <Form.Item name="moveNewPrj">
                  <Select
                    placeholder="请选择"
                    style={widths}
                    showSearch
                    optionFilterProp="children"
                  >
                    {GetSprintProject()}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    size={'middle'}
                    style={{ marginLeft: '10px' }}
                    onClick={addNewProject}
                  >
                    {' '}
                    +{' '}
                  </Button>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" style={{ marginLeft: '150px' }} onClick={moveSprintList}>
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={moveCancel}>
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
          <Row gutter={16} style={{ marginBottom: '-20px' }}>
            <Col className="gutter-row">
              <div style={rightStyle}>
                <Form.Item label="项目名称：">
                  <Input.Group compact>
                    <Form.Item name="prjNames">
                      <Select id={'prjNames'} placeholder="请选择类型" style={{ width: '150px' }}>
                        {[
                          <Option key={'sprint'} value={'sprint'}>
                            sprint
                          </Option>,
                          <Option key={'hotfix'} value={'hotfix'}>
                            hotfix
                          </Option>,
                          <Option key={'emergency'} value={'emergency'}>
                            emergency
                          </Option>,
                        ]}
                      </Select>
                    </Form.Item>

                    <Form.Item name="prjDate">
                      <DatePicker onChange={formTimeSelected} />
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
                      <label style={{ display: 'none' }}></label>
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
                  <DatePicker style={widths} allowClear={false} />
                </Form.Item>
              </div>
            </Col>

            <Col className="gutter-row">
              <div style={leftStyle}>
                <Form.Item name="testCutoff" label="提测截止">
                  <DatePicker style={widths} allowClear={false} />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col className="gutter-row">
              <div style={rightStyle}>
                <Form.Item name="testFinnished" label="测试完成：">
                  <DatePicker style={widths} allowClear={false} />
                </Form.Item>
              </div>
            </Col>

            <Col className="gutter-row">
              <div style={leftStyle}>
                <Form.Item name="planHuidu" label="计划灰度：">
                  <DatePicker style={widths} allowClear={false} />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col className="gutter-row">
              <div style={rightStyle}>
                <Form.Item name="planOnline" label="计划上线：">
                  <DatePicker style={widths} allowClear={false} />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row">
              <div style={leftStyle}>
                <Form.Item name="prjStatus" label="项目状态:">
                  <Select placeholder="请选择" style={widths}>
                    {[
                      <Option key={'closed'} value={'closed'}>
                        已关闭
                      </Option>,
                      <Option key={'doing'} value={'doing'}>
                        进行中
                      </Option>,
                      <Option key={'suspended'} value={'suspended'}>
                        已挂起
                      </Option>,
                      <Option key={'wait'} value={'wait'}>
                        未开始
                      </Option>,
                    ]}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '50px' }}>
            <Button
              type="primary"
              style={{ marginLeft: '250px' }}
              disabled={isAble.shown}
              onClick={commitAddProject}
            >
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={addPrjCancel}>
              取消
            </Button>
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
            <label style={{ marginLeft: '20px' }}>
              确定将当前阶段修改为【{flowHitmessage.hintMessage}】吗？
            </label>
          </Form.Item>

          <Form.Item>
            <Button type="primary" style={{ marginLeft: '150px' }} onClick={commitFlow}>
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={flowCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 撤销操作 */}
      <Modal
        title={`${buttonMessage.hintMessage}提示`}
        visible={isRevokeModalVisible}
        onCancel={revokeCancel}
        centered={true}
        footer={null}
        width={400}
      >
        <Form>
          <Form.Item>
            <label style={{ marginLeft: '20px' }}>
              是否确定进行{buttonMessage.hintMessage}操作？
            </label>
          </Form.Item>

          <Form.Item>
            <Button type="primary" style={{ marginLeft: '100px' }} onClick={commitRevoke}>
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={revokeCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={'自定义字段'}
        visible={isFieldModalVisible}
        onCancel={fieldCancel}
        centered={true}
        footer={null}
        width={940}
      >
        <Form>
          <div>
            <Checkbox.Group
              style={{ width: '110%', marginLeft: -10 }}
              value={selectedFiled}
              onChange={onSetFieldsChange}
            >
              <Row>
                <Col span={4}>
                  <Checkbox defaultChecked value="序号">
                    序号
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox defaultChecked disabled value="选择">
                    选择
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox defaultChecked disabled value="类型">
                    类型
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox defaultChecked disabled value="编号">
                    编号
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="阶段">阶段</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="测试">测试</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="测试确认">测试确认</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="标题内容">标题内容</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="严重等级">严重等级</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="所属计划">所属计划</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="截止日期">截止日期</Checkbox>
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
                  <Checkbox value="是否涉及页面调整">是否涉及页面调整</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="是否可热更">是否可热更</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="是否清缓存">是否清缓存</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="是否有数据升级">是否有数据升级</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="是否有接口升级">是否有接口升级</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="是否有预置数据修改">是否有预置数据修改</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="测试验证?">测试验证?</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="创建时间">创建时间</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="解决时间">解决时间</Checkbox>
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
                  <Checkbox value="创建人">创建人</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="是否延期">是否延期</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </div>

          <div>
            <Checkbox onChange={selectAllField}>全选</Checkbox>

            <Button type="primary" style={{ marginLeft: '300px' }} onClick={commitField}>
              确定
            </Button>
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={fieldCancel}>
              取消
            </Button>
          </div>
        </Form>
      </Modal>
      <RemoveModal
        visible={showRemoveModal}
        gridRef={gridApi}
        onCancel={() => setShowRemoveModal(false)}
        onOk={() => setShowRemoveModal(false)}
      />
    </div>
  );
};

export default SprintList;
