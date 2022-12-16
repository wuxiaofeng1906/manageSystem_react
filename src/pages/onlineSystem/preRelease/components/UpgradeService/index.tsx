import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Space } from 'antd';
import { UnorderedListOutlined, SyncOutlined } from '@ant-design/icons';

import { useModel } from '@@/plugin-model/useModel';
import { AgGridReact } from 'ag-grid-react';
import '../../style/style.css';
import { loadReleaseIDSelect } from '../../comControl/controler';
import {
  getReleasedItemColumns,
  getReleasedApiColumns,
  getReleaseServiceComfirmColumns,
  getNewRelServiceComfirmColumns,
} from './grid/columns';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { confirmUpgradeService } from './serviceConfirm';
import { alalysisInitData, checkOnlineEnvSource } from '../../datas/dataAnalyze';
import { getCheckProcess } from '../CheckProgress/axiosRequest';
import { showProgressData } from '../CheckProgress/processAnalysis';
import { vertifyModifyFlag, releaseAppChangRowColor } from '../../operate';
import { inquireService } from './axiosRequest';
import { deleteLockStatus, getLockStatus } from '../../lock/rowLock';
import {
  loadApiMethodSelect,
  loadApiServiceSelect,
  loadIsApiAndDbUpgradeSelect,
  loadOnlineEnvSelect,
  loadPulishItemSelect,
  loadUpgradeApiSelect,
} from '../../comControl/controler';
import { upgradePulishItem, addPulishApi, deleteReleasedID } from './axiosRequest';
import { getGridRowsHeight } from '../gridHeight';
import { getAutoCheckMessage } from './idDeal/dataDeal';
import { serverConfirmJudge } from './checkExcute';
import { errorMessage, infoMessage, sucMessage } from '@/publicMethods/showMessages';
import StoryListModal from '@/pages/onlineSystem/preRelease/components/storyListModal';
import PreReleaseServices from '@/services/preRelease';
import { getServices } from '@/publicMethods/verifyAxios';
import { isEmpty } from 'lodash';

const { TextArea } = Input;
const { Option } = Select;
const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);
let currentOperateStatus = false; // 需要将useState中的operteStatus值赋值过来，如果直接取operteStatus，下拉框那边获取不到最新的operteStatus；
const UpgradeService: React.FC<any> = () => {
  const {
    tabsData,
    modifyProcessStatus,
    releaseItem,
    upgradeApi,
    upgradeConfirm,
    preReleaseData,
    lockedItem,
    modifyLockedItem,
    setRelesaeItem,
    setUpgradeApi,
    releasedIDArray,
    modifyReleasedID,
    allLockedArray,
    operteStatus,
    setDelModal,
    setShowStoryModal,
  } = useModel('releaseProcess');
  const [applicantConfirmForm] = Form.useForm(); // 应用
  const [formUpgradeService] = Form.useForm(); // 升级服务
  const [appServerList, setAppserverList] = useState<any[]>([]);
  const [deployTip, setDeployTip] = useState('');
  const [initPage, setInitPage] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  // 暂时忽略掉一键部署ID后端服务的获取

  /* region 升级服务： 发布项表格 */
  const releaseItemGridApi = useRef<GridApi>();
  const onReleaseItemGridReady = (params: GridReadyEvent) => {
    releaseItemGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion  */

  /* region 升级服务 二  */
  const upGradeGridApi = useRef<GridApi>();
  const onUpGradeGridReady = (params: GridReadyEvent) => {
    upGradeGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion   */

  /* region 升级服务 三  */
  const serverConfirmGridApi = useRef<GridApi>();
  const onConfirmGridReady = (params: GridReadyEvent) => {
    serverConfirmGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const serverConfirmGridApi2 = useRef<GridApi>();
  const onConfirmGridReady2 = (params: GridReadyEvent) => {
    serverConfirmGridApi2.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion   */

  /* region 一键部署ID相关事件 */
  const [releaseIDArray, setReleaseIDArray] = useState(null);
  const getReleaseID = async () => {
    const releaseIds = await loadReleaseIDSelect(tabsData.activeKey);
    setReleaseIDArray(releaseIds);
  };

  //  设置已选中的id
  const onReleaseIdChanges = async (selectedId: any) => {
    modifyReleasedID(selectedId);
  };

  // 删除一键部署ID
  const deleteReleaseId = async (deletedId: string) => {
    // 如果有需要被删除的数据就删除，并且更新列表
    const result = await deleteReleasedID(tabsData.activeKey, deletedId);
    if (result !== '') {
      errorMessage(result.toString());
      return;
    }
    sucMessage(`【${deletedId}】删除成功！`);
    const newData: any = await alalysisInitData('pulishItem', tabsData.activeKey);
    formUpgradeService.setFieldsValue({
      hitMessage: await getAutoCheckMessage(tabsData.activeKey),
    });
    setRelesaeItem({
      gridHight: getGridRowsHeight(newData.upService_releaseItem),
      gridData: newData.upService_releaseItem,
    });
  };

  // 一键部署ID查询
  const inquireServiceClick = async (showErrorTip = true) => {
    if (!(await vertifyModifyFlag(6, tabsData.activeKey))) {
      if (showErrorTip) {
        message.error({
          content: `服务确认已完成，不能进行查询！`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
      return;
    }

    const queryCondition = formUpgradeService.getFieldsValue().deployID;
    if (isEmpty(queryCondition)) {
      message.error({
        content: '一键部署ID不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    // releaseIdArray 需要注意
    const result = await inquireService(releasedIDArray, tabsData.activeKey);
    if (result.message !== '') {
      if (result.code == 4001) {
        setDeployTip(result.message.replace('错误：', ''));
      } else {
        message.error({
          content: result.message,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
    } else {
      setDeployTip('');
      const pulishData: any = await alalysisInitData('pulishItem', tabsData.activeKey);
      const newData: any = pulishData.upService_releaseItem;
      formUpgradeService.setFieldsValue({
        hitMessage: await getAutoCheckMessage(tabsData.activeKey),
      });
      setRelesaeItem({ gridHight: getGridRowsHeight(newData), gridData: newData });
      // 需要判断升级接口内容是否有值，如果没有的话，则需要新增一个空行
      const apidata: any = await alalysisInitData('pulishApi', tabsData.activeKey);

      if (!apidata.upService_interface || apidata.upService_interface <= 0) {
        // @ts-ignore
        setUpgradeApi({ gridHight: getGridRowsHeight([]).toString(), gridData: [{}] });
      }
    }
  };

  const [releaseIdDisable, setReleaseIdDisable] = useState(false);

  const modifyReleaseIdStatus = (newData_confirm: any) => {
    // 任务：62713 ：升级服务当所有人员都确认通过，一键部署ID列表置为灰色不可编辑，需要编辑时，需要测试取消确认(修改确认状态为"是")
    if (newData_confirm && newData_confirm.length > 0) {
      const confirmInfo = newData_confirm[0];

      if (
        confirmInfo.front_confirm_status === '1' &&
        confirmInfo.back_end_confirm_status === '1' &&
        confirmInfo.global_confirm_status === '1' &&
        confirmInfo.jsf_confirm_status === '1' &&
        confirmInfo.openapi_confirm_status === '1' &&
        confirmInfo.process_confirm_status === '1' &&
        confirmInfo.qbos_store_confirm_status === '1' &&
        confirmInfo.test_confirm_status === '1'
      ) {
        setReleaseIdDisable(true);
      } else if (confirmInfo.test_confirm_status === '2') {
        setReleaseIdDisable(false);
      }
    } else {
      setReleaseIdDisable(false);
    }
  };

  /* endregion */

  /* region 行的新增和修改 */

  /* region 发布项新增和修改 */
  const [pulishItemForm] = Form.useForm(); // 发布项
  const [pulishItemModal, setPulishItemModal] = useState({ shown: false, title: '新增' }); // 发布项 新增和修改的共同modal显示
  const [pulishItemFormSelected, setPulishItemFormSelected] = useState({
    // 发布项弹出窗口中的select框加载
    onlineEnv: [],
    pulishItem: [],
    isApiDbUpgrade: [],
  });

  (window as any).showPulishItemForm = async (type: any, params: any) => {
    // 验证是否已经确认服务，如果已经确认了，就不能新增和修改了
    const flag = await vertifyModifyFlag(1, tabsData.activeKey);
    if (!flag) return infoMessage('服务确认已完成，不能进行修改！');
    if (type === 'add') {
      pulishItemForm.resetFields();
      setPulishItemModal({
        shown: true,
        title: '新增',
      });
    } else {
      let onlineEnvArray;
      if (params.online_environment) {
        onlineEnvArray = params.online_environment.split(',');
      }

      const appid = params.app_id;
      pulishItemForm.setFieldsValue({
        onlineEnv: onlineEnvArray,
        pulishItem: params.release_item,
        application: params.app,
        hotUpdate: params.hot_update,
        interAndDbUpgrade: params.is_upgrade_api_database,
        // branchAndEnv: params.branch_environment,
        description: params.instructions,
        remark: params.remarks,
        appId: appid,
        automationTest: params.automation_check,
        deploymentId: params.deployment_id,
      });

      // 如果appid是空的，则表示是新查询出来的数据
      if (!appid) {
        setPulishItemModal({
          shown: true,
          title: '修改',
        });
      } else {
        modifyLockedItem(`${tabsData.activeKey}-step2-app-${appid}`);
        const lockInfo = await getLockStatus(`${tabsData.activeKey}-step2-app-${appid}`);
        if (lockInfo.errMessage) {
          message.error({
            content: `${lockInfo.errMessage}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          setPulishItemModal({
            shown: true,
            title: '修改',
          });
        }
      }
    }

    // 设置下拉框
    setPulishItemFormSelected({
      onlineEnv: await loadOnlineEnvSelect(preReleaseData.release_cluster),
      pulishItem: await loadPulishItemSelect(),
      isApiDbUpgrade: await loadIsApiAndDbUpgradeSelect(),
    });
  };

  // 取消发布项弹出窗
  const pulishItemModalCancle = () => {
    setPulishItemModal({
      ...pulishItemModal,
      shown: false,
    });
    const formData = pulishItemForm.getFieldsValue();
    if (formData.appId) {
      deleteLockStatus(lockedItem);
    }
  };

  // 保存发布项结果
  const savePulishResult = async () => {
    const formData = pulishItemForm.getFieldsValue();
    const result = await upgradePulishItem(formData, tabsData.activeKey);
    if (result === '') {
      message.info({
        content: '修改成功！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      setPulishItemModal({
        ...pulishItemModal,
        shown: false,
      });

      const newData: any = await alalysisInitData('pulishItem', tabsData.activeKey);
      setRelesaeItem({
        gridHight: getGridRowsHeight(newData.upService_releaseItem),
        gridData: newData.upService_releaseItem,
      });

      // 也要刷新一键部署ID
      // setReleasedIdForm(newData?.upService_releaseItem);
      //   发布项结果保存成功之后，需要刷新发布项中的服务确认完成
      const newData_confirm: any = await alalysisInitData('pulishConfirm', tabsData.activeKey);
      serverConfirmGridApi.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认设置一行空值
      serverConfirmGridApi2.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认设置一行空值

      // setGridHeight({
      //   ...gridHeight,
      //   pulishItemGrid: getGridHeight(newData.upService_releaseItem.length),
      //   upConfirm: getGridHeight(newData_confirm.upService_confirm.length),
      // });

      // 保存后需要解解锁
      if (formData.appId) {
        deleteLockStatus(lockedItem);
      }
    } else {
      message.error({
        content: `${result}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  };
  /* endregion */

  /* region 发布接口新增和修改 */
  const [upgradeIntForm] = Form.useForm(); // 发布接口
  const [upgradeIntModal, setUpgradeIntModal] = useState({ shown: false, title: '新增' }); // 发布项新增和修改的共同modal显示
  const [upgradeApiFormSelected, setUpgradeApiFormSelected] = useState({
    // 发布接口弹出窗口中的select框加载
    onlineEnv: [],
    upgradeApi: [],
    apiService: [],
    apiMethod: [],
  });

  // 发布接口弹出窗口进行修改和新增
  (window as any).showUpgradeApiForm = async (type: any, params: any) => {
    const flag = await vertifyModifyFlag(2, tabsData.activeKey);
    if (!flag) return infoMessage('服务确认已完成，不能进行修改！');
    if (type === 'add') {
      upgradeIntForm.resetFields();
      upgradeIntForm.setFieldsValue({
        renter: 'ALL', // 新增:租户ID默认值
      });
      setUpgradeIntModal({ shown: true, title: '新增' });
    } else {
      const apiid = params.api_id;
      upgradeIntForm.setFieldsValue({
        onlineEnv:
          params.online_environment === undefined
            ? undefined
            : params.online_environment.split(','),
        upInterface: params.update_api,
        interService: params.api_name,
        // hotUpdate: params.hot_update,
        method: params.api_method,
        URL: params.api_url,
        renter: params.related_tenant,
        remark: params.remarks,
        apiId: apiid,
        data: params.data,
        header: params.header,
      });
      modifyLockedItem(`${tabsData.activeKey}-step2-api-${apiid}`);
      const lockInfo = await getLockStatus(`${tabsData.activeKey}-step2-api-${apiid}`);

      if (lockInfo.errMessage) {
        infoMessage(lockInfo.errMessage);
      } else {
        setUpgradeIntModal({ shown: true, title: '修改' });
      }
    }
    // 设置下拉框
    setUpgradeApiFormSelected({
      onlineEnv: await loadOnlineEnvSelect(preReleaseData.release_cluster),
      upgradeApi: await loadUpgradeApiSelect(),
      apiService: await loadApiServiceSelect(),
      apiMethod: await loadApiMethodSelect(),
    });
  };
  // 取消事件
  const upgradeIntModalCancle = () => {
    setUpgradeIntModal({ ...upgradeIntModal, shown: false });

    if (upgradeIntModal.title === '修改') {
      //   释放锁
      deleteLockStatus(lockedItem);
    }
  };

  // 保存数据
  const saveUpgradeInterResult = async () => {
    const formData = upgradeIntForm.getFieldsValue();
    const result = await addPulishApi(formData, tabsData.activeKey, upgradeIntModal.title);
    if (result === '') {
      sucMessage('保存成功！');
      setUpgradeIntModal({ ...upgradeIntModal, shown: false });

      const newData: any = await alalysisInitData('pulishApi', tabsData.activeKey);
      setUpgradeApi({
        gridHight: getGridRowsHeight(newData.upService_interface),
        gridData: newData.upService_interface,
      });

      // (不管成功或者失败)刷新表格
      const newData_confirm: any = await alalysisInitData('pulishConfirm', tabsData.activeKey);
      serverConfirmGridApi.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认刷新数据
      serverConfirmGridApi2.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认刷新数据

      if (upgradeIntModal.title === '修改') {
        //   释放锁
        deleteLockStatus(lockedItem);
      }
    } else {
      infoMessage(result);
    }
  };

  /* endregion */

  /* region 服务确认 */
  // 表格数据重置
  const resetTable = async (currentReleaseNum: string) => {
    const newData_confirm: any = await alalysisInitData('pulishConfirm', currentReleaseNum);
    serverConfirmGridApi.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认刷新数据
    serverConfirmGridApi2.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认刷新数据
  };

  // 下拉框选择是否确认事件
  const saveUperConfirmInfo = async (newValue: string, props: any, checkStepFourSource = false) => {
    const isOk = newValue == '1'; // 当前测试修改确认状态为是
    const currentReleaseNum = props.data?.ready_release_num;
    const testField = props.column.colId == 'test_confirm_status';
    const editId = props.column.colId?.replace('confirm_status', 'user_id');
    // checkStepFourSource: 检查step 4的上线环境是否存在未填【1.填写了应用2.填写了升级接口】

    // 确认为是：检查对应值班人确认对应服务集群是否填写
    const upgrade =
      releaseItemGridApi.current
        ?.getRenderedNodes()
        ?.flatMap((it) =>
          !isEmpty(it.data) &&
          it.data?.edit_user_id == props.data?.[editId] &&
          isEmpty(it.data?.online_environment)
            ? [it.data?.app]
            : [],
        ) ?? [];
    const services =
      upGradeGridApi.current
        ?.getRenderedNodes()
        ?.flatMap((it) =>
          !isEmpty(it.data) &&
          it.data?.edit_user_id == props.data?.[editId] &&
          isEmpty(it.data?.online_environment)
            ? [it.data?.api_name]
            : [],
        ) ?? [];
    // 校验各自值班确认服务集群是否为空
    if (!isEmpty([...upgrade, ...services]) && !testField && isOk) {
      infoMessage(`服务[${String([...upgrade, ...services])}]未填写相关信息，请填写完成后再次确认`);
      resetTable(currentReleaseNum);
      return;
    }
    // 验证 集群是否未填写
    const checkEnvIsEmpty = checkStepFourSource && testField;

    // 忽略检查 由【是】修改为【否】 不校验
    const ignoreCheck = testField && !isOk;

    if (!ignoreCheck) {
      // 验证 开发是否已确认
      const checkDeveloperHasFinish = serverConfirmJudge(
        currentOperateStatus,
        props,
        formUpgradeService.getFieldValue('hitMessage'),
      );
      // 存在集群未填写 并开完均已确认 且测试修改为是
      if (checkEnvIsEmpty && checkDeveloperHasFinish)
        infoMessage('step4 中上线环境未填写，不能修改服务已确认！');

      // 重置为初始状态（不更新确认状态）
      if (!checkDeveloperHasFinish || checkEnvIsEmpty) {
        // (不管成功或者失败)刷新表格
        resetTable(currentReleaseNum);
        return;
      }
    }
    const datas = {
      user_name: usersInfo.name,
      user_id: usersInfo.userid,
      person_type: '',
      ready_release_num: currentReleaseNum,
      confirm_status: newValue,
    };

    switch (props.column.colId) {
      case 'front_confirm_status': // 前端
        datas.person_type = 'front';
        break;
      case 'back_end_confirm_status': // 后端
        datas.person_type = 'back';
        break;
      case 'process_confirm_status': // 流程
        datas.person_type = 'process';
        break;
      case 'test_confirm_status': // 测试
        datas.person_type = 'test';
        break;
      case 'global_confirm_status': // global
        datas.person_type = 'global';
        break;
      case 'openapi_confirm_status': // openapi
        datas.person_type = 'openapi';
        break;
      case 'qbos_store_confirm_status': // qbos
        datas.person_type = 'qbos';
        break;
      case 'jsf_confirm_status': // 测试
        datas.person_type = 'jsf';
        break;
      default:
        break;
    }

    const result = await confirmUpgradeService(datas);
    if (result === '') {
      sucMessage('保存成功！');
      // 刷新状态进度条
      const processData: any = await getCheckProcess(currentReleaseNum);
      if (processData) {
        modifyProcessStatus(await showProgressData(processData.data));
      }

      //   刷新表格
    } else {
      infoMessage(result);
    }

    //   (不管成功或者失败)刷新表格
    const newData_confirm: any = await alalysisInitData('pulishConfirm', currentReleaseNum);
    serverConfirmGridApi.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认刷新数据
    serverConfirmGridApi2.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认刷新数据

    modifyReleaseIdStatus(newData_confirm);
  };
  /* endregion */

  /* endregion */

  const showArrays = async () => {
    formUpgradeService.setFieldsValue({
      deployID: releasedIDArray,
      hitMessage: await getAutoCheckMessage(tabsData.activeKey), // 31357
    });
    // 初始化部署检查错误提示
    if (isEmpty(releasedIDArray)) {
      setDeployTip('');
    } else if (initPage && !isEmpty(releasedIDArray) && !releaseIdDisable && !operteStatus) {
      inquireServiceClick(false).then(() => {
        setInitPage(false);
      });
    }
  };

  const onRefreshService = async (showMessage = true) => {
    if (operteStatus) return;
    try {
      setRefreshLoading(true);
      await PreReleaseServices.refreshService(tabsData.activeKey ?? '');
      await alalysisInitData('pulishItem', tabsData.activeKey);
      if (showMessage) {
        message.success('刷新成功');
      }
      setRefreshLoading(false);
    } catch (e) {
      setRefreshLoading(false);
    }
  };

  const getServerList = async () => {
    const res = await getServices('');
    setAppserverList(
      res.data?.map((it: any) => ({ label: it.server, value: it.server, key: it.server_id })) ?? [],
    );
  };
  useEffect(() => {
    getServerList();
  }, []);
  useEffect(() => {
    showArrays();
  }, [releasedIDArray]);

  useEffect(() => {
    setInitPage(true);
    setDeployTip('');
  }, [tabsData.activeKey]);

  useEffect(() => {
    currentOperateStatus = operteStatus;
    // 一键部署ID是否可以修改
    setReleaseIdDisable(operteStatus);
    // modifyReleaseIdStatus(upgradeConfirm.gridData);
  }, [operteStatus, upgradeConfirm.gridData]);

  //  测试修改服务确认完成为【是】：检查 上线环境是否存在未填
  useEffect(() => {
    // 存在有一项数据不完整 为true
    const flag = checkOnlineEnvSource(releaseItem, upgradeApi);
    applicantConfirmForm.setFieldsValue({ status: flag });
  }, [JSON.stringify(releaseItem.gridData), JSON.stringify(upgradeApi.gridData)]);
  return (
    <div>
      {/* 升级服务 */}
      <div>
        <fieldset className={'fieldStyle'}>
          <legend className={'legendStyle'}>
            Step4 升级服务
            <label style={{ color: 'Gray' }}>
              (值班测试：填写一键部署ID和测试服务确认完成；前后端值班：填写应用服务和升级接口/对应服务确认完成)
            </label>
          </legend>
          <div>
            <div>
              <div
                style={{
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <Space size={8}>
                  <Button
                    title={'刷新'}
                    type={'text'}
                    size={'small'}
                    icon={<SyncOutlined style={{ color: '#46A0FC' }} spin={refreshLoading} />}
                    onClick={() => onRefreshService()}
                    disabled={refreshLoading || operteStatus}
                  />
                  <Button
                    title={'待发布需求列表'}
                    icon={<UnorderedListOutlined style={{ color: '#46A0FC' }} />}
                    type={'text'}
                    size={'small'}
                    onClick={() => setShowStoryModal(true)}
                  />
                </Space>
              </div>
              {/* 升级服务 */}
              <div
                className="ag-theme-alpine"
                style={{ height: releaseItem.gridHight, width: '100%' }}
              >
                <AgGridReact
                  columnDefs={getReleasedItemColumns()} // 定义列
                  rowData={isEmpty(releaseItem.gridData) ? [{}] : releaseItem.gridData} // 数据绑定
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    minWidth: 90,
                    cellStyle: { 'line-height': '25px' },
                  }}
                  getRowStyle={(params: any) => {
                    return releaseAppChangRowColor(
                      allLockedArray,
                      'step2-app',
                      params.data?.app_id,
                    );
                  }}
                  headerHeight={25}
                  rowHeight={25}
                  onGridReady={onReleaseItemGridReady}
                  onGridSizeChanged={onReleaseItemGridReady}
                  onColumnEverythingChanged={onReleaseItemGridReady}
                />
              </div>

              {/* 升级接口 */}
              <div
                className="ag-theme-alpine"
                style={{ height: upgradeApi.gridHight, width: '100%' }}
              >
                <AgGridReact
                  columnDefs={getReleasedApiColumns()} // 定义列
                  rowData={isEmpty(upgradeApi.gridData) ? [{}] : upgradeApi.gridData} // 数据绑定
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    cellStyle: { 'line-height': '25px' },
                    minWidth: 90,
                  }}
                  headerHeight={25}
                  rowHeight={25}
                  getRowStyle={(params: any) => {
                    return releaseAppChangRowColor(
                      allLockedArray,
                      'step2-api',
                      params.data?.api_id,
                    );
                  }}
                  onGridReady={onUpGradeGridReady}
                  onGridSizeChanged={onUpGradeGridReady}
                  onColumnEverythingChanged={onUpGradeGridReady}
                />
              </div>
            </div>
            {/* 条件查询 */}
            <div style={{ height: 35, width: '100%' }}>
              <Form form={formUpgradeService}>
                <Row gutter={10}>
                  <Col span={12}>
                    {/* 一键部署ID */}
                    <Form.Item label="一键部署ID:" name="deployID" required>
                      <Select
                        mode="multiple"
                        size={'small'}
                        disabled={releaseIdDisable}
                        style={{ width: '100%' }}
                        showSearch
                        onChange={onReleaseIdChanges}
                        onFocus={getReleaseID}
                        onDeselect={deleteReleaseId}
                      >
                        {releaseIDArray}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Button
                      size={'small'}
                      type="primary"
                      style={{
                        color: '#46A0FC',
                        backgroundColor: '#ECF5FF',
                        borderRadius: 5,
                        marginTop: 3,
                        width: 'max-content',
                      }}
                      disabled={releaseIdDisable}
                      onClick={() => inquireServiceClick()}
                    >
                      点击一键校验
                    </Button>
                    <Form.Item
                      label=""
                      name="hitMessage"
                      style={{ marginLeft: 110, marginTop: -28 }}
                    >
                      <Input
                        disabled
                        style={{
                          border: 'none',
                          backgroundColor: 'white',
                          color: 'red',
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
            {/*一键部署检查错误提示*/}
            <div style={{ color: 'red' }}>{deployTip}</div>
            {/* 服务确认完成 */}
            <div>
              <div style={{ fontWeight: 'bold' }}> 服务确认完成</div>
              <div
                className="ag-theme-alpine"
                style={{ height: upgradeConfirm.gridHight, width: '100%' }}
              >
                <AgGridReact
                  columnDefs={getReleaseServiceComfirmColumns()} // 定义列
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    cellStyle: { 'line-height': '25px' },
                    minWidth: 90,
                  }}
                  rowData={upgradeConfirm.gridData}
                  headerHeight={25}
                  rowHeight={25}
                  onGridReady={onConfirmGridReady}
                  onGridSizeChanged={onConfirmGridReady}
                  onColumnEverythingChanged={onConfirmGridReady}
                  frameworkComponents={{
                    confirmSelectChoice: (props: any) => {
                      applicantConfirmForm.setFieldsValue({
                        [props.column.colId]: props.value,
                      });
                      let Color = 'black';
                      const currentValue = props.value;
                      if (currentValue === '1') {
                        Color = '#2BF541';
                      } else if (currentValue === '2') {
                        Color = 'orange';
                      } else if (currentValue === '9') {
                        return (
                          <Select
                            size={'small'}
                            bordered={false}
                            style={{ width: '100%' }}
                            defaultValue={'免'}
                            disabled
                          ></Select>
                        );
                      }

                      return (
                        <Form
                          form={applicantConfirmForm}
                          key={props.column.colId}
                          initialValues={{ [props.column.colId]: props.value }}
                        >
                          <Form.Item
                            noStyle
                            shouldUpdate={(old, next) => old.status != next.status}
                          >
                            {({ getFieldValue }) => {
                              return (
                                <Form.Item name={props.column.colId}>
                                  <Select
                                    size={'small'}
                                    bordered={false}
                                    disabled={currentOperateStatus}
                                    style={{ width: '100%', color: Color }}
                                    onChange={(newValue: any) => {
                                      saveUperConfirmInfo(newValue, props, getFieldValue('status'));
                                    }}
                                  >
                                    <Option key={'1'} value={'1'}>
                                      是
                                    </Option>
                                    <Option key={'2'} value={'2'}>
                                      否
                                    </Option>
                                  </Select>
                                </Form.Item>
                              );
                            }}
                          </Form.Item>
                        </Form>
                      );
                    },
                  }}
                ></AgGridReact>
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: upgradeConfirm.gridHight, width: '100%' }}
              >
                <AgGridReact
                  columnDefs={getNewRelServiceComfirmColumns()} // 定义列
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    cellStyle: { 'line-height': '25px' },
                    minWidth: 90,
                  }}
                  rowData={upgradeConfirm.gridData}
                  headerHeight={25}
                  rowHeight={25}
                  onGridReady={onConfirmGridReady2}
                  onGridSizeChanged={onConfirmGridReady2}
                  onColumnEverythingChanged={onConfirmGridReady2}
                  frameworkComponents={{
                    confirmSelectChoice: (props: any) => {
                      let Color = 'black';
                      const currentValue = props.value;
                      if (currentValue === '1') {
                        Color = '#2BF541';
                      } else if (currentValue === '2') {
                        Color = 'orange';
                      } else if (currentValue === '9') {
                        return (
                          <Select
                            size={'small'}
                            bordered={false}
                            style={{ width: '100%' }}
                            defaultValue={'免'}
                            disabled
                          ></Select>
                        );
                      }

                      return (
                        <Select
                          size={'small'}
                          defaultValue={currentValue}
                          bordered={false}
                          disabled={currentOperateStatus}
                          style={{ width: '100%', color: Color }}
                          onChange={(newValue: any) => {
                            saveUperConfirmInfo(newValue, props);
                          }}
                        >
                          <Option key={'1'} value={'1'}>
                            是
                          </Option>
                          <Option key={'2'} value={'2'}>
                            否
                          </Option>
                        </Select>
                      );
                    },
                  }}
                ></AgGridReact>
              </div>
            </div>

            {/*  提示标签 */}
            <div style={{ fontSize: 'smaller', marginTop: 10 }}>
              1、先选择【构建环境】，在选择【一键部署ID】，点击查询按钮，自动获取并展示发布的应用集合；
              <br />
              2、发布项为前端、后端、流程时，分支和环境提供上线分支/测试环境，说明填写更新服务；
              <br />
              3、发布项为前端镜像、后端镜像、流程镜像时，分支和环境提供镜像版本号，说明填写提供镜像/版本名称；
              <br />
              4、发布项为接口时，分支和环境处提供具体接口，说明填写method：接口升级，租户升级说明。
            </div>
          </div>
        </fieldset>
      </div>
      {/* 发布项 */}
      <Modal
        title={pulishItemModal.title}
        visible={pulishItemModal.shown}
        onCancel={pulishItemModalCancle}
        centered={true}
        footer={null}
        width={630}
      >
        <Form form={pulishItemForm}>
          <Row>
            <Col span={12}>
              <Form.Item name="onlineEnv" label="上线环境:" required style={{ marginTop: -15 }}>
                <Select showSearch mode="multiple">
                  {pulishItemFormSelected.onlineEnv}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pulishItem"
                label="发布项："
                required
                style={{ marginTop: -15, marginLeft: 10 }}
              >
                <Select showSearch style={{ marginLeft: 27, width: 183 }}>
                  {pulishItemFormSelected.pulishItem}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="application" label="应用：" required style={{ marginTop: -15 }}>
                <Select
                  placeholder="请选择相应的应用！"
                  style={{ width: '100%', color: 'black' }}
                  allowClear
                  options={appServerList}
                  showSearch
                />
              </Form.Item>
            </Col>
            {/*<Col span={12}>*/}
            {/*  <Form.Item*/}
            {/*    name="branchAndEnv"*/}
            {/*    label="分支和环境："*/}
            {/*    required*/}
            {/*    style={{ marginTop: -15, marginLeft: 10 }}*/}
            {/*  >*/}
            {/*    <Input disabled style={{ color: 'black' }} />*/}
            {/*  </Form.Item>*/}
            {/*</Col>*/}
          </Row>

          <Form.Item
            name="interAndDbUpgrade"
            label="是否涉及接口与数据库升级："
            required
            style={{ marginTop: -15 }}
          >
            <Select>{pulishItemFormSelected.isApiDbUpgrade}</Select>
          </Form.Item>

          <Form.Item name="hotUpdate" label="是否支持热更新：" required style={{ marginTop: -15 }}>
            <Select>
              <Option key={'1'} value={'1'}>
                {'是'}
              </Option>
              <Option key={'2'} value={'2'}>
                {'否'}
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="说明：" style={{ marginTop: -15 }}>
            <TextArea />
          </Form.Item>
          <Form.Item name="remark" label="备注：" style={{ marginTop: -15 }}>
            <TextArea />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ borderRadius: 5, marginLeft: 20, float: 'right' }}
              onClick={pulishItemModalCancle}
            >
              取消
            </Button>
            <Button
              type="primary"
              style={{
                color: '#46A0FC',
                backgroundColor: '#ECF5FF',
                borderRadius: 5,
                float: 'right',
              }}
              onClick={savePulishResult}
              disabled={currentOperateStatus}
            >
              确定
            </Button>
          </Form.Item>

          {/* 隐藏字段，进行修改需要的字段 */}
          <Row style={{ marginTop: -60 }}>
            <Col span={2}>
              <Form.Item name="appId">
                <Input style={{ width: 50, display: 'none' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="automationTest">
                <Input style={{ width: 50, display: 'none' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="deploymentId">
                <Input style={{ width: 50, display: 'none' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 接口服务 */}
      <Modal
        title={upgradeIntModal.title}
        visible={upgradeIntModal.shown}
        onCancel={upgradeIntModalCancle}
        centered={true}
        footer={null}
        width={1000}
      >
        <Form form={upgradeIntForm}>
          <Row>
            <Col span={12}>
              <Form.Item name="onlineEnv" label="上线环境:" required style={{ marginTop: -15 }}>
                <Select showSearch mode="multiple" style={{ width: '100%' }}>
                  {upgradeApiFormSelected.onlineEnv}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="upInterface"
                label="升级接口："
                required
                style={{ marginLeft: 10, marginTop: -15 }}
              >
                <Select showSearch style={{}}>
                  {upgradeApiFormSelected.upgradeApi}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="interService" label="接口服务：" required style={{ marginTop: -15 }}>
                <Select showSearch style={{ width: '100%' }}>
                  {upgradeApiFormSelected.apiService}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="renter"
                label="租户ID："
                required
                style={{ marginLeft: 10, marginTop: -15 }}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="method" label="接口Method：" required style={{ marginTop: -15 }}>
                <Select showSearch style={{}}>
                  {upgradeApiFormSelected.apiMethod}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="URL"
                label="接口URL："
                required
                style={{ marginLeft: 10, marginTop: -15 }}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          {/*
          <Form.Item name="hotUpdate" label="是否支持热更新：" required style={{marginTop: -15}}>
            <Select>
              <Option key={'1'} value={'1'}>
                {'是'}
              </Option>
              <Option key={'2'} value={'2'}>
                {'否'}
              </Option>
            </Select>
          </Form.Item> */}
          <Row>
            <Col span={12}>
              <Form.Item name="data" label="Data" style={{ marginTop: -15 }}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="header" label="Header" style={{ marginLeft: 10, marginTop: -15 }}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注：" style={{ marginTop: -15 }}>
            <TextArea />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ borderRadius: 5, marginLeft: 20, float: 'right' }}
              onClick={upgradeIntModalCancle}
            >
              取消
            </Button>
            <Button
              type="primary"
              style={{
                color: '#46A0FC',
                backgroundColor: '#ECF5FF',
                borderRadius: 5,
                float: 'right',
              }}
              onClick={saveUpgradeInterResult}
              disabled={currentOperateStatus}
            >
              确定
            </Button>
          </Form.Item>
          {/* 隐藏字段，进行修改需要的字段 */}
          <Row style={{ marginTop: -60 }}>
            <Col span={2}>
              <Form.Item name="apiId">
                <Input style={{ width: 50, display: 'none' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <StoryListModal onRefresh={onRefreshService} />
    </div>
  );
};

export default UpgradeService;