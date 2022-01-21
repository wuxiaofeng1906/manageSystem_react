import React, {useEffect, useRef, useState} from 'react';
import {useRequest} from "ahooks";
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './supplementFile/style.css';
import {
  Button, Form, Input, message, Modal, Select, Tabs,
  Row, Col, DatePicker, Checkbox, Divider, Card, Switch, Progress, Spin
} from 'antd';
import moment from "moment";
import {AgGridReact} from "ag-grid-react";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {
  loadPrjNameSelect, loadReleaseTypeSelect, loadReleaseWaySelect, loadReleaseIDSelect, loadOnlineEnvSelect,
  loadPulishItemSelect, loadIsApiAndDbUpgradeSelect, loadUpgradeApiSelect, loadApiServiceSelect, loadApiMethodSelect,
  loadCategorySelect, loadCommiterSelect, loadTechSideSelect, loadBranchNameSelect, loadServiceSelect, loadImgEnvSelect,
  loadCheckTypeSelect, loadBrowserTypeSelect
} from "./supplementFile/comControl/controler";
import {
  getNewNum, deleteReleaseItem, getPageCHeckProcess,
  savePreProjects, inquireService, upgradePulishItem, delUpgradeItems,
  addPulishApi, confirmUpgradeService, dataRepaireReview, confirmDataRepairService, getCheckNumForOnlineBranch,
  saveOnlineBranchData, getModifiedData, executeOnlineCheck, saveProcessResult
} from "./supplementFile/datas/logic";
import {alalysisInitData} from "./supplementFile/datas/dataAnalyze";
import {
  getGridHeight, getReleasedItemColumns, getReleasedApiColumns,
  getReleaseServiceComfirmColumns, getReviewColumns, getReviewConfirmColums,
  getOnlineBranchColumns, getWorkOrderColumns, releaseAppChangRowColor
} from "./supplementFile/grid/gridSet";
import {getLockStatus, deleteLockStatus, getAllLockedData, getLockedId} from "./supplementFile/lock/rowLock";
import {getNewPageNum} from "@/pages/onDutyAndRelease/preRelease/supplementFile/datas/axiosApi";
import {history} from "@@/core/history";
import {showReleasedId} from './upgradeService/dataDeal';
import {showProgressData} from './progress/alaProgress';

const {TabPane} = Tabs;
const {Option} = Select;
const {TextArea} = Input;

const userLogins: any = localStorage.getItem("userLogins");
const usersInfo = JSON.parse(userLogins);
let currentListNo = "";  // 当前页面编号
let newOnlineBranchNum = "";
let lockedInfo = "";// 被锁了的id
let releaseIdArray: any = []; // 已发布的一键部署ID
let allLockedArray: any = [];  // 被锁的数据

const PreRelease: React.FC<any> = () => {
    const interValRef: any = useRef(); // 定时任务数据id保存

    /* region Form 和state定义 */
    const [pulishItemForm] = Form.useForm(); // 发布项
    const [upgradeIntForm] = Form.useForm(); // 发布接口
    const [dataReviewForm] = Form.useForm(); // 数据修复review
    const [formForOnlineBranch] = Form.useForm(); // 上线分支设置
    const [formUpgradeService] = Form.useForm(); // 升级服务
    const [formForPreReleaseProject] = Form.useForm(); // 预发布 head

    const [gridHeight, setGridHeight] = useState({
      pulishItemGrid: 100,
      upgradeApiGrid: 100,
      upConfirm: 100,
      dataRepaireReviewGrid: 100,
      onlineBranchGrid: 100,
      reviewConfirm: 100,
      orderList: 100
    });
    const [processStatus, setProcessStatus] = useState({ // 进度条相关数据和颜色
      releaseProject: "Gainsboro",  // #2BF541
      upgradeService: "Gainsboro",
      dataReview: "Gainsboro",
      onliineCheck: "Gainsboro",
      releaseResult: "9",
      processPercent: 0
    });
    const [pulishItemModal, setPulishItemModal] = useState({shown: false, title: "新增"});    // 发布项 新增和修改的共同modal显示
    const [upgradeIntModal, setUpgradeIntModal] = useState({shown: false, title: "新增"});    // 发布项新增和修改的共同modal显示
    const [dataReviewtModal, setDataReviewModal] = useState({shown: false, title: "新增"});    // 发布项新增和修改的共同modal显示
    const [onlineBranchModal, setOnlineBranchModal] = useState({shown: false, title: "新增", loading: false}); // 上线分支设置
    const [autoLogModal, setAutoLogModal] = useState({    // 自动化测试日志弹窗
      show: false,
      url: {ui: "", api: ""}
    });
    const [pulishItemFormSelected, setPulishItemFormSelected] = useState({  // 发布项弹出窗口中的select框加载
      onlineEnv: [],
      pulishItem: [],
      isApiDbUpgrade: []
    });
    const [upgradeApiFormSelected, setUpgradeApiFormSelected] = useState({  // 发布接口弹出窗口中的select框加载
      onlineEnv: [],
      upgradeApi: [],
      apiService: [],
      apiMethod: [],
    });
    const [dataReviewFormSelected, setDataReviewFormSelected] = useState({     // 数据修复review 弹窗selected框
      category: [],
      repairCommiter: [],
    });
    const [onlineBranchFormSelected, setOnlineBranchFormSelected] = useState({     // 上线分支 弹窗selected框
      branchName: [],
      techSide: [],
      server: [],
      imgEnv: [],
      checkType: [],
      browser: []
    });
    const [delModal, setDelModal] = useState({   // 列表数据删除弹窗
      shown: false,
      type: -1,
      datas: {}
    });
    const [executeStatus, setExecuteStatus] = useState(false); // 上线分支点击执行后的进度展示
    const [showTabs, setShowTabs] = useState({  // 页面tabPage当前展示页面
      shown: false, targetKey: ""
    });
    const [tabContent, setTabContent] = useState({ // 页面tabPage展示
      activeKey: "", panes: []
    });
    const [saveButtonDisable, setSaveButtonDisable] = useState(false); // 保存按钮是否可用
    /* endregion */

    /* region 表格的定义 */
    const firstUpSerGridApi = useRef<GridApi>();
    const secondUpSerGridApi = useRef<GridApi>();
    const thirdUpSerGridApi = useRef<GridApi>();
    const firstDataReviewGridApi = useRef<GridApi>();
    const firstOnlineBranchGridApi = useRef<GridApi>();
    const firstListGridApi = useRef<GridApi>();
    /* endregion */

    /* region 当前页面数据的获取 */
    // 获取当前链接是否有携带预发布编号（就是区分是否从历史记录跳转过来的），
    const location = history.location.query;
    let releasedNumStr = "";
    if (JSON.stringify(location) !== '{}' && location) {
      releasedNumStr = location?.releasedNum === null ? "" : (location?.releasedNum).toString();
    }
    // 查询数据
    const initData = useRequest(() => alalysisInitData("", releasedNumStr)).data;

    /* endregion */

    /* region 新增和修改表格行弹窗 */

    // 发布项弹出窗口进行修改和新增
    const showPulishItemForm = async (type: any, params: any) => {

      if (type === "add") {
        pulishItemForm.resetFields();
        setPulishItemModal({
          shown: true,
          title: "新增"
        });
      } else {

        let onlineEnvArray;
        if (params.online_environment) {
          onlineEnvArray = (params.online_environment).split(",");
        }

        const appid = params.app_id;
        pulishItemForm.setFieldsValue({
          onlineEnv: onlineEnvArray,
          pulishItem: params.release_item,
          application: params.app,
          hotUpdate: params.hot_update,
          interAndDbUpgrade: params.is_upgrade_api_database,
          branchAndEnv: params.branch_environment,
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
            title: "修改"
          });
        } else {
          lockedInfo = `${currentListNo}-step2-app-${appid}`;
          const lockInfo = await getLockStatus(lockedInfo);

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
              title: "修改"
            });
          }
        }

      }

      setPulishItemFormSelected({
        onlineEnv: await loadOnlineEnvSelect(),
        pulishItem: await loadPulishItemSelect(),
        isApiDbUpgrade: await loadIsApiAndDbUpgradeSelect()
      });

    };

    // 发布接口弹出窗口进行修改和新增
    const showUpgradeApiForm = async (type: any, params: any) => {
      if (type === "add") {
        upgradeIntForm.resetFields();
        setUpgradeIntModal({
          shown: true,
          title: "新增"
        });
      } else {
        const apiid = params.api_id;
        upgradeIntForm.setFieldsValue({
          onlineEnv: params.online_environment === undefined ? undefined : (params.online_environment).split(","),
          upInterface: params.update_api,
          interService: params.api_name,
          hotUpdate: params.hot_update,
          method: params.api_method,
          URL: params.api_url,
          renter: params.related_tenant,
          remark: params.remarks,
          apiId: apiid
        });
        lockedInfo = `${currentListNo}-step2-api-${apiid}`;
        const lockInfo = await getLockStatus(lockedInfo);

        if (lockInfo.errMessage) {
          message.error({
            content: `${lockInfo.errMessage}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          setUpgradeIntModal({
            shown: true,
            title: "修改"
          });
        }
      }

      setUpgradeApiFormSelected({
        onlineEnv: await loadOnlineEnvSelect(),
        upgradeApi: await loadUpgradeApiSelect(),
        apiService: await loadApiServiceSelect(),
        apiMethod: await loadApiMethodSelect()
      });

    };

    // 数据修复review弹出窗口进行修改和新增
    const showDataReviewForm = async (type: any, params: any) => {

      if (type === "add") {
        dataReviewForm.resetFields();
        setDataReviewModal({
          shown: true,
          title: "新增"
        });
      } else {
        const reviewid = params.review_id;
        dataReviewForm.setFieldsValue({
          repaireContent: params.repair_data_content,
          relatedRenter: params.related_tenant,
          types: params.type,
          repaireCommiter: `${params.commit_user_id}&${params.commit_user_name}`,
          branch: params.branch,
          EvalResult: params.review_result,
          repeatExecute: params.is_repeat,
          reviewId: reviewid
        });

        lockedInfo = `${currentListNo}-step3-review-${reviewid}`;
        const lockInfo = await getLockStatus(lockedInfo);

        if (lockInfo.errMessage) {
          message.error({
            content: `${lockInfo.errMessage}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          setDataReviewModal({
            shown: true,
            title: "修改"
          });
        }
      }

      setDataReviewFormSelected({
        category: await loadCategorySelect(),
        repairCommiter: await loadCommiterSelect(),

      });

    };

    // 上线分支弹出窗口进行修改和新增
    const showOnlineBranchForm = async (type: any, params: any) => {

      if (type === "add") {
        formForOnlineBranch.resetFields();
        formForOnlineBranch.setFieldsValue({
          verson_check: "1",
          branchcheck: "1"
        });
        setOnlineBranchModal({
          shown: true,
          title: "新增",
          loading: false
        });
        const result = await getCheckNumForOnlineBranch();
        newOnlineBranchNum = result.data?.check_num;
      } else {
        newOnlineBranchNum = params.check_num;
        const oraData = await getModifiedData(newOnlineBranchNum);

        // 服务
        let servers = oraData.versonCheck?.server;
        if (servers) {
          if (servers.length === 1 && servers.includes("")) {
            servers = undefined;
          }
        }

        // 时间
        let mainSince;
        if (oraData.branchCheck?.branch_mainSince) {
          mainSince = moment(oraData.branchCheck?.branch_mainSince);
        }

        // 上线前的检查类型
        let beforeType = oraData.beforeOnlineCheck?.beforeCheckType;
        if (oraData.beforeOnlineCheck?.beforeCheckType) {
          if ((oraData.beforeOnlineCheck?.beforeCheckType).length === 1 && (oraData.beforeOnlineCheck?.beforeCheckType).includes("9")) {
            beforeType = undefined;
          }
        }

        // 上线后的检查类型
        let afterType = oraData.afterOnlineCheck?.afterCheckType;
        if (oraData.afterOnlineCheck?.afterCheckType) {
          if ((oraData.afterOnlineCheck?.afterCheckType).length === 1 && (oraData.afterOnlineCheck?.afterCheckType).includes("9")) {
            afterType = undefined;
          }
        }

        formForOnlineBranch.setFieldsValue({
          // 表头设置
          branchName: oraData.checkHead.branchName,
          ignoreFrontCheck: oraData.checkHead.ignoreFrontCheck,
          module: oraData.checkHead.module,
          ignoreBackendCheck: oraData.checkHead.ignoreBackendCheck,

          // 版本检查设置
          verson_check: oraData.versonCheck?.verson_check,
          server: servers,
          imageevn: oraData.versonCheck?.imageevn,

          // 对比分支
          branchcheck: oraData.branchCheck?.branchcheck,
          branch_mainBranch: oraData.branchCheck?.branch_mainBranch,
          branch_teachnicalSide: oraData.branchCheck?.branch_teachnicalSide,
          branch_mainSince: mainSince,

          // 环境一致性检查
          ignoreCheck: oraData.envCheck.ignoreCheck,
          checkEnv: oraData.envCheck.checkEnv,

          // 上线前自动化检查
          autoBeforeIgnoreCheck: oraData.beforeOnlineCheck?.autoBeforeIgnoreCheck,
          beforeCheckType: beforeType,
          beforeTestEnv: oraData.beforeOnlineCheck?.beforeTestEnv,
          beforeBrowser: oraData.beforeOnlineCheck?.beforeBrowser,

          //  上线后自动化检查
          autoAfterIgnoreCheck: oraData.afterOnlineCheck?.autoAfterIgnoreCheck,
          afterCheckType: afterType,
          afterTestEnv: oraData.afterOnlineCheck?.afterTestEnv,
          afterBrowser: oraData.afterOnlineCheck?.afterBrowser,


          //   隐藏字段，修改时需要使用
          branchCheckId: oraData.checkHead?.branchCheckId,
          versionCheckId: oraData.versonCheck?.versionCheckId,
          envCheckId: oraData.envCheck?.checkId,
          beforeAutomationId: oraData.beforeOnlineCheck?.automationId,
          afterAutomationId: oraData.afterOnlineCheck?.automationId
        });

        lockedInfo = `${currentListNo}-step4-onlineBranch-${oraData.checkHead?.branchCheckId}`;
        const lockInfo = await getLockStatus(lockedInfo);

        if (lockInfo.errMessage) {
          message.error({
            content: `${lockInfo.errMessage}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          setOnlineBranchModal({
            shown: true,
            title: "修改",
            loading: false
          });
        }
      }

      setOnlineBranchFormSelected({
        branchName: await loadBranchNameSelect(),
        techSide: await loadTechSideSelect(),
        server: await loadServiceSelect(),
        imgEnv: await loadImgEnvSelect(),
        checkType: await loadCheckTypeSelect(),
        browser: await loadBrowserTypeSelect()

      });

    };

    // 新增行
    (window as any).addRows = (types: any) => {

      switch (types) {
        case 1:
          showPulishItemForm("add", {});
          break;

        case 2:
          showUpgradeApiForm("add", {});
          break;

        case 3:
          showDataReviewForm("add", {});
          break;
        case 4:
          showOnlineBranchForm("add", {});
          break;
        default:
          break;
      }

    };
    // 修改行
    (window as any).modifyRows = (types: any, params: any) => {
      //  显示数据
      switch (types) {
        case 1:
          showPulishItemForm("modify", params);
          break;
        case 2:
          showUpgradeApiForm("modify", params);
          break;
        case 3:
          showDataReviewForm("modify", params);
          break;
        case 4:
          showOnlineBranchForm("modify", params)
          break;
        default:
          break;
      }
    };
    /* endregion  */

    /* region 删除功能 */

    // 取消删除
    const delCancel = () => {
      setDelModal({
        shown: false,
        type: -1,
        datas: {}
      });
    };

    // 显示一键部署ID
    const setReleasedIdForm = async (releasedData: any) => {
      const ids = await showReleasedId(releasedData);
      releaseIdArray = ids.idStrArray;
      formUpgradeService.setFieldsValue({
        deployID: ids.idArray
      });
    };

    // 显示删除后的数据
    const showdeletedNewData = async () => {

      const {type} = delModal;
      switch (type) {
        case 1: {
          const newDatas = await alalysisInitData("pulishItem", currentListNo);
          firstUpSerGridApi.current?.setRowData(newDatas.upService_releaseItem);
          setReleasedIdForm(newDatas?.upService_releaseItem);       // 也要刷新一键部署ID
        }
          break;
        case 2: {
          const newData: any = await alalysisInitData("pulishApi", currentListNo);
          secondUpSerGridApi.current?.setRowData(newData.upService_interface);
          setGridHeight({
            ...gridHeight,
            upgradeApiGrid: getGridHeight((newData?.upService_interface).length),
          });
        }
          break;
        case 3: {
          const newData: any = await alalysisInitData("dataReview", currentListNo);
          firstDataReviewGridApi.current?.setRowData(newData.reviewData_repaire);
        }
          break;
        case 4: {
          const newData: any = await alalysisInitData("onlineBranch", currentListNo);
          firstOnlineBranchGridApi.current?.setRowData(newData.onlineBranch);
        }
          break;
        default:
          break;
      }

    }

    // 数据删除
    const delDetailsInfo = async () => {

      const lockInfo = await getLockStatus(getLockedId(delModal.type, currentListNo, delModal.datas));

      if (lockInfo.errMessage) {
        message.error({
          content: `删除失败：${lockInfo.errMessage}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        return;
      }
      // 删除数据
      const result: string = await delUpgradeItems(delModal.type, delModal.datas);
      if (result === "") {
        message.info({
          content: "删除成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        showdeletedNewData();
      } else {
        message.error({
          content: `${result}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }

      setDelModal({
        shown: false,
        type: -1,
        datas: {}
      });
    };

    // 删除事件
    (window as any).deleteRows = (item: any, params: any) => {
      setDelModal({
        type: item,
        shown: true,
        datas: params
      });
    };

    /* endregion */

    /* region 进度条相关 */
    // 获取当前页面的进度数据
    const getProcessStatus = async () => {
      const process = await getPageCHeckProcess(currentListNo);
      setProcessStatus(showProgressData(process.data));
    };
    /* endregion */

    /* region 表格相关定义和事件 */

    /* region 升级服务 一  发布项 */
    const onFirstGridReady = (params: GridReadyEvent) => {
      firstUpSerGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };
    const onChangeFirstGridReady = (params: GridReadyEvent) => {
      firstUpSerGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };
    // 保存发布项结果
    const savePulishResult = async () => {

      const formData = pulishItemForm.getFieldsValue();
      const result = await upgradePulishItem(formData, currentListNo);
      if (result === "") {
        message.info({
          content: "修改成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        setPulishItemModal({
          ...pulishItemModal,
          shown: false
        });

        const newData: any = await alalysisInitData("pulishItem", currentListNo);
        firstUpSerGridApi.current?.setRowData(newData.upService_releaseItem);
        // 也要刷新一键部署ID
        setReleasedIdForm(newData?.upService_releaseItem)
        //   发布项结果保存成功之后，需要刷新发布项中的服务确认完成
        const newData_confirm: any = await alalysisInitData("pulishConfirm", currentListNo);
        thirdUpSerGridApi.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认设置一行空值
        setGridHeight({
          ...gridHeight,
          pulishItemGrid: getGridHeight((newData.upService_releaseItem).length),
          upConfirm: getGridHeight((newData_confirm.upService_confirm).length)
        });

        // 保存后需要解解锁
        if (formData.appId) {
          deleteLockStatus(lockedInfo);
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

    // 取消发布项弹出窗
    const pulishItemModalCancle = () => {
      setPulishItemModal({
        ...pulishItemModal,
        shown: false
      });

      const formData = pulishItemForm.getFieldsValue();
      if (formData.appId) {
        deleteLockStatus(lockedInfo);
      }
    };
    /* endregion  */

    /* region 升级服务 二  */

    const onSecondGridReady = (params: GridReadyEvent) => {
      secondUpSerGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    const onChangeSecondGridReady = (params: GridReadyEvent) => {
      secondUpSerGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    // 保存数据
    const saveUpgradeInterResult = async () => {
      const formData = upgradeIntForm.getFieldsValue();
      const result = await addPulishApi(formData, currentListNo, upgradeIntModal.title);
      if (result === "") {
        message.info({
          content: "保存成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        setUpgradeIntModal({
          ...upgradeIntModal,
          shown: false,

        });

        const newData: any = await alalysisInitData("pulishApi", currentListNo);
        secondUpSerGridApi.current?.setRowData(newData.upService_interface);

        setGridHeight({
          ...gridHeight,
          upgradeApiGrid: getGridHeight((newData?.upService_interface).length),
        });

        if (upgradeIntModal.title === "修改") {
          //   释放锁
          deleteLockStatus(lockedInfo);
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
// 取消事件
    const upgradeIntModalCancle = () => {
      setUpgradeIntModal({
        ...upgradeIntModal,
        shown: false,

      });

      if (upgradeIntModal.title === "修改") {
        //   释放锁
        deleteLockStatus(lockedInfo);
      }

    };
    /* endregion   */

    /* region 升级服务 三  */

    const onthirdGridReady = (params: GridReadyEvent) => {
      thirdUpSerGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    const onChangeThirdGridReady = (params: GridReadyEvent) => {
      thirdUpSerGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    // 下拉框选择是否确认事件
    const saveUperConfirmInfo = async (newValue: string, props: any) => {

      const datas = {
        "user_name": usersInfo.name,
        "user_id": usersInfo.userid,
        "person_type": "",
        "ready_release_num": currentListNo,
        "confirm_status": ""
      };

      switch (props.column.colId) {
        case "front_confirm_status":  // 前端
          datas.person_type = "front";
          break;
        case "back_end_confirm_status": // 后端
          datas.person_type = "back";
          break;
        case "process_confirm_status":  // 流程
          datas.person_type = "process";
          break;
        case "test_confirm_status": // 测试
          datas.person_type = "test";
          break;
        default:
          break;
      }

      datas.confirm_status = newValue;
      const result = await confirmUpgradeService(datas);
      if (result === "") {
        message.info({
          content: "保存成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        //   刷新表格
        const newData_confirm: any = await alalysisInitData("pulishConfirm", currentListNo);
        thirdUpSerGridApi.current?.setRowData(newData_confirm.upService_confirm); // 需要给服务确认设置一行空值

        await getProcessStatus();
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

    /* endregion   */

    /*  region 数据修复 Review 一 */
    const onfirstDataReviewGridReady = (params: GridReadyEvent) => {
      firstDataReviewGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    const onChangefirstDataReviewGridReady = (params: GridReadyEvent) => {
      firstDataReviewGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    const dataReviewModalCancle = () => {
      setDataReviewModal({
        shown: false,
        title: "新增"
      });

      if (dataReviewtModal.title === "修改") {
        //   删除锁
        deleteLockStatus(lockedInfo);
      }
    };

    // 保存数据修复review
    const saveDataReviewResult = async () => {
      const formData = dataReviewForm.getFieldsValue();
      const result = await dataRepaireReview(dataReviewtModal.title, currentListNo, formData);
      if (result === "") {
        message.info({
          content: "保存成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        setDataReviewModal({
          shown: false,
          title: "新增"
        });

        // 刷新
        const newData: any = await alalysisInitData("dataReview", currentListNo);
        firstDataReviewGridApi.current?.setRowData(newData.reviewData_repaire);

        if (dataReviewtModal.title === "修改") {
          // 删除锁
          deleteLockStatus(lockedInfo);
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

    /*  region 数据修复 Review 二 */
    const secondDataReviewGridApi = useRef<GridApi>();
    const onsecondDataReviewGridReady = (params: GridReadyEvent) => {
      secondDataReviewGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    const onChangesecondDataReviewGridReady = (params: GridReadyEvent) => {
      secondDataReviewGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };
    // 下拉框选择是否确认事件
    const saveDataRepaireConfirmInfo = async (newValue: string, oldData: any) => {

      //  如果前后两个值不同，则需要更新
      if (newValue !== oldData.confirm_status) {

        const datas = {
          "user_name": usersInfo.name,
          "user_id": usersInfo.userid,
          "confirm_id": oldData.confirm_id,
          "ready_release_num": currentListNo,
          "confirm_result": newValue
        };

        const result = await confirmDataRepairService(datas);
        if (result === "") {
          message.info({
            content: "保存成功！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });

          //   刷新表格
          const newData_confirm: any = await alalysisInitData("dataReviewConfirm", currentListNo);
          secondDataReviewGridApi.current?.setRowData(newData_confirm.reviewData_confirm);
          // 进度
          await getProcessStatus();
        } else {
          message.error({
            content: `${result}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }

      }
    };
    /* endregion */

    /*  region 上线分支 */

    // 执行上线前检查：上线前版本检查、环境检查，自动化检查
    (window as any).excuteDataCheck = async (type: string, checkNum: string) => {

      setExecuteStatus(true);
      const result = await executeOnlineCheck(type, checkNum);
      if (result === "") {
        message.info({
          content: "执行成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else {
        message.error({
          content: `${result}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
      setExecuteStatus(false);
    };

    // 自动化URL跳转
    (window as any).urlClick = (checkType: string, logUrl: string) => {

      let ui_url = "";
      let api_url = "";
      if (checkType && logUrl) {
        const typeArray = checkType.split(",");
        const logArray = logUrl.split(",");

        if (typeArray.length === 1 && logArray.length === 1) { // 仅有一个检查和一个日志
          if (typeArray[0] === "1") { // 是UI，2是接口
            ui_url = logArray[0].toString();

          } else if (typeArray[0] === "2") {
            api_url = logArray[0].toString();
          }
        } else if (typeArray.length === 2 && logArray.length === 2) {
          if (typeArray[0] === "1") { // 是UI，2是接口
            ui_url = logArray[0].toString();

          } else if (typeArray[0] === "2") {
            api_url = logArray[0].toString();
          }

          if (typeArray[1] === "1") { // 是UI，2是接口
            ui_url = logArray[1].toString();

          } else if (typeArray[1] === "2") {
            api_url = logArray[1].toString();
          }

        }
      }

      setAutoLogModal(
        {
          show: true,
          url: {
            ui: ui_url,
            api: api_url
          }
        }
      );
    };

    const onfirstOnlineBranchGridReady = (params: GridReadyEvent) => {
      firstOnlineBranchGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    const onChangefirstOnlineBranchGridReady = (params: GridReadyEvent) => {
      firstOnlineBranchGridApi.current = params.api;
      params.api.sizeColumnsToFit();
    };

    // 取消
    const onlineBranchCancle = () => {
      setOnlineBranchModal({
        shown: false,
        title: "新增",
        loading: false
      });

      if (onlineBranchModal.title === "修改") {
        deleteLockStatus(lockedInfo);
      }
    };

    // 保存
    const saveOnlineBranchResult = async () => {

      setOnlineBranchModal({
        ...onlineBranchModal,
        loading: true
      });

      const formData = formForOnlineBranch.getFieldsValue();
      const result = await saveOnlineBranchData(onlineBranchModal.title, currentListNo, newOnlineBranchNum, formData);

      if (result === "") {
        message.info({
          content: "保存成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
        setOnlineBranchModal({
          shown: false,
          title: "新增",
          loading: false
        });

        const newData: any = await alalysisInitData("onlineBranch", currentListNo);
        firstOnlineBranchGridApi.current?.setRowData(newData.onlineBranch);

        setGridHeight({
          ...gridHeight,
          onlineBranchGrid: getGridHeight((newData?.onlineBranch).length, true),
        });

        if (onlineBranchModal.title === "修改") {
          deleteLockStatus(lockedInfo);
        }

      } else {
        message.error({
          content: result,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        setOnlineBranchModal({
          ...onlineBranchModal,
          loading: false
        });
      }
    };

    /* endregion */

    /*  region 对应工单 */
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

    /* region 发布结果 */
    const pulishResulttChanged = async (params: any) => {

      // 需要验证前面的检查是否全部成功。

      if (processStatus.releaseProject === "Gainsboro" || processStatus.upgradeService === "Gainsboro" ||
        processStatus.dataReview === "Gainsboro" || processStatus.onliineCheck === "Gainsboro") {

        message.error({
          content: "检查未全部完成，不能保存发布结果！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        return;
      }
      const result = await saveProcessResult(currentListNo, params);
      if (result === "") {
        message.info({
          content: "保存成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        setProcessStatus({
          ...processStatus,
          releaseResult: params
        })
      } else {
        message.error({
          content: result,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
    };
    /* endregion */

    /* region  预发布项目 */

    const projectsArray = useRequest(() => loadPrjNameSelect()).data;
    const releaseTypeArray = useRequest(() => loadReleaseTypeSelect()).data;
    const releaseWayArray = useRequest(() => loadReleaseWaySelect()).data;

    // 保存预发布项目
    const savePreRelaseProjects = async () => {

      const datas = formForPreReleaseProject.getFieldsValue();
      const result = await savePreProjects(datas, currentListNo);

      if (result.errorMessage === "") {

        message.info({
          content: "保存成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
        const modifyTime: any = result.datas;
        formForPreReleaseProject.setFieldsValue({
          editor: modifyTime.editor,
          editTime: modifyTime.editTime,
        });
        // 保存成功后需要刷新状态
        await getProcessStatus();
      } else {
        message.error({
          content: result.errorMessage,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
      deleteLockStatus(lockedInfo);
    };

    /* endregion */

    /* region 升级服务 */
    const releaseIDArray = useRequest(() => loadReleaseIDSelect()).data;
    const onReleaseIdChanges = (selectedId: any, params: any) => {
      if (params && params.length > 0) {
        const queryCondition: any = [];
        params.forEach((ele: any) => {
          queryCondition.push({
            "deployment_id": ele.key,
            "automation_check": ele.automation_test,
            "service": (ele.service).split(",")
          });

        });
        releaseIdArray = queryCondition;
      } else {
        releaseIdArray = [];
      }
    }

    const inquireServiceClick = async () => {
      const result = await inquireService(releaseIdArray);
      if (result.message !== "") {
        message.error({
          content: result.message,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else {

        // 有数据之后进行表格的赋值操作(需要把之前表格的数据一并追加进来)   获取之前的数据
        const newData: any = await alalysisInitData("pulishItem", currentListNo);
        let gridData = result.data;
        if (newData.upService_releaseItem) {
          gridData = (newData.upService_releaseItem).concat(gridData);
        }

        firstUpSerGridApi.current?.setRowData(gridData);
        // 需要判断升级接口内容是否有值，如果没有的话，则需要新增一个空行
        const apidata: any = await alalysisInitData("pulishApi", currentListNo);
        if (!apidata.upService_interface || (apidata.upService_interface) <= 0) {
          secondUpSerGridApi.current?.setRowData([{}]); // 需要给升级接口设置一行空值
        }

        setGridHeight({
          ...gridHeight,
          pulishItemGrid: getGridHeight(gridData.length),
          upgradeApiGrid: getGridHeight(1),
        });
      }
    };

    /* endregion */

    /* region Tabs 标签页事件 */

    const showNoneDataPage = () => {
      setProcessStatus({
        releaseProject: "Gainsboro",  // #2BF541
        upgradeService: "Gainsboro",
        dataReview: "Gainsboro",
        onliineCheck: "Gainsboro",
        releaseResult: "9",
        processPercent: 0
      });
      formUpgradeService.resetFields();
      // 预发布项目
      formForPreReleaseProject.resetFields();

      // 升级服务 一
      firstUpSerGridApi.current?.setRowData([]);

      // 升级服务 二
      secondUpSerGridApi.current?.setRowData([]);
      // 升级服务 三
      thirdUpSerGridApi.current?.setRowData([]);
      // 数据修复Review 一
      firstDataReviewGridApi.current?.setRowData([]);
      // 数据修复Review 二
      secondDataReviewGridApi.current?.setRowData([]);
      // 上线分支
      firstOnlineBranchGridApi.current?.setRowData([{}]);
      // 对应工单
      firstListGridApi.current?.setRowData([]);

      setGridHeight({
        pulishItemGrid: 120,
        upgradeApiGrid: 120,
        upConfirm: 120,
        dataRepaireReviewGrid: 120,
        onlineBranchGrid: 120,
        reviewConfirm: 120,
        orderList: 120
      });

    };
    const showPagesContent = async (source: any) => {

      if (!source || JSON.stringify(source) === "{}") {
        return;
      }

      // 预发布项目
      const preReleaseProject = source?.preProject;
      currentListNo = preReleaseProject.ready_release_num;
      const lockedData = await getAllLockedData(currentListNo);
      allLockedArray = lockedData.data;
      await getProcessStatus();
      formForPreReleaseProject.setFieldsValue({
        projectsName: preReleaseProject.projectId,
        pulishType: preReleaseProject.release_type,
        pulishMethod: preReleaseProject.release_way,
        pulishTime: moment(preReleaseProject.plan_release_time),
        editor: preReleaseProject.edit_user_name,
        editTime: preReleaseProject.edit_time,
        proid: preReleaseProject.pro_id
      });

      // 升级服务 一
      setReleasedIdForm(source?.upService_releaseItem)
      firstUpSerGridApi.current?.setRowData(source?.upService_releaseItem);
      // 升级服务 二
      secondUpSerGridApi.current?.setRowData(source?.upService_interface);
      // 升级服务 三
      thirdUpSerGridApi.current?.setRowData(source?.upService_confirm);
      // 数据修复Review 一
      firstDataReviewGridApi.current?.setRowData(source?.reviewData_repaire);
      // 数据修复Review 二
      secondDataReviewGridApi.current?.setRowData(source?.reviewData_confirm);
      // 上线分支
      firstOnlineBranchGridApi.current?.setRowData(source?.onlineBranch);
      // 对应工单
      firstListGridApi.current?.setRowData(source?.correspondOrder);
      setGridHeight({
        pulishItemGrid: getGridHeight((source?.upService_releaseItem).length),
        upgradeApiGrid: getGridHeight((source?.upService_interface).length),
        upConfirm: getGridHeight((source?.upService_confirm).length),
        dataRepaireReviewGrid: getGridHeight((source?.reviewData_repaire).length),
        reviewConfirm: getGridHeight((source?.reviewData_confirm).length),
        onlineBranchGrid: getGridHeight((source?.onlineBranch).length, true),
        orderList: getGridHeight((source?.correspondOrder).length),

      });

    };

    // 新增tab
    const add = async () => {
      // 获取新的pageNum
      const newNum = await getNewNum();
      currentListNo = newNum.data?.ready_release_num;
      const {panes}: any = tabContent;
      panes.push({
        title: `${currentListNo}灰度预发布`,
        content: "",
        key: currentListNo
      });
      setTabContent({panes, activeKey: currentListNo});
      showNoneDataPage();
    };
    // 删除tab
    const remove = (targetKeys: any) => {
      setShowTabs({
        shown: true,
        targetKey: targetKeys
      });
    };

    const delTabsCancel = () => {
      setShowTabs({
        ...showTabs,
        shown: false
      });
    };

    // 删除tab
    const delTabsInfo = async () => {

      const {targetKey} = showTabs;
      setShowTabs({
        ...showTabs,
        shown: false
      });

      const {panes}: any = tabContent;
      const {activeKey}: any = tabContent;
      if (panes.length === 1) {
        message.error({
          content: "删除失败：页面需要至少保留一个预发布页面!",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });

        return;
      }
      let newActiveKey = activeKey;
      let lastIndex = 0;
      panes.forEach((pane: any, i: number) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const newPanes = panes.filter((pane: any) => pane.key !== targetKey);
      if (newPanes.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
          newActiveKey = newPanes[lastIndex].key;
        } else {
          newActiveKey = newPanes[0].key;
        }
      }

      const deleteInfo = await deleteReleaseItem(targetKey);

      if (deleteInfo === "") {
        message.info({
          content: "删除成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          }
        });
        setTabContent({
          panes: newPanes,
          activeKey: newActiveKey,
        });

      } else {
        message.error({
          content: deleteInfo,
          duration: 1,
          style: {
            marginTop: '50vh',
          }
        });
      }

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
    const onChange = async (activeKeys: any) => {

      setTabContent({
        ...tabContent,
        activeKey: activeKeys
      });

      // 根据标签页获取数据,然后再赋予值
      const newTabData = await alalysisInitData("", activeKeys);
      showPagesContent(newTabData);
    };

    // 修改tab
    const tabsChangeName = (params: any) => {

      const currentName = params.target.innerText;
      console.log(currentName);

    };
    /* endregion */

    /* region 释放锁 */
    // 刷新释放正锁住的锁
    window.onbeforeunload = () => {

      deleteLockStatus(lockedInfo);
    };

    // 窗口关闭释放锁
    window.onunload = () => {
      deleteLockStatus(lockedInfo);
    };

    // 页面报错时释放锁
    window.addEventListener('error', () => {
      deleteLockStatus(lockedInfo);

    }, true);

    /* endregion */

    // 编辑框聚焦时检查是否可以编辑
    const releaseItemFocus = async () => {

      const formData = formForPreReleaseProject.getFieldsValue();
      const proId = formData.proid;
      lockedInfo = `${currentListNo}-step1-project-${proId}`
      const lockInfo = await getLockStatus(lockedInfo);
      if (lockInfo.errMessage) {
        const userInfo: any = lockInfo.data;
        if (userInfo.user_id !== usersInfo.userid) {
          message.error({
            content: `${lockInfo.errMessage}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          setSaveButtonDisable(true);
        } else {
          setSaveButtonDisable(false);
        }
      } else {
        setSaveButtonDisable(false);
      }
    };
    // 初始化显示tab
    const showTabsPage = async () => {
      if (releasedNumStr === "") {
        const source = await alalysisInitData();
        const tabsInfo = source?.tabPageInfo;

        if (tabsInfo) {
          setTabContent({
            activeKey: tabsInfo[0].key,
            panes: tabsInfo
          });
        } else if (initData === undefined) {
          const newNum = await getNewPageNum();
          const releaseNum = newNum.data?.ready_release_num;
          currentListNo = releaseNum;
          const panesArray: any = [{
            title: `${releaseNum}灰度预发布`,
            content: "",
            key: releaseNum,
          }];

          setTabContent({
            activeKey: releaseNum,
            panes: panesArray
          });
        }

      } else {
        const newPage: any = [{
          title: `${releasedNumStr}灰度预发布`,
          content: "",
          key: releasedNumStr,
        }];
        setTabContent({
          activeKey: releasedNumStr,
          panes: newPage
        });
      }
    };

    // 刷新页面定时任务
    const timeTaskForPageRefresh = async () => {
      if (!interValRef.current) {
        let count = 0;

        const id = setInterval(async () => {
          count += 1;
          console.log(`刷新数据${count},定时任务id${id}`);
          // 刷新
          const datas = await alalysisInitData("", releasedNumStr);

          showPagesContent(datas);
        }, 30 * 1000);

        interValRef.current = id;
      }
    };

    // 自动化日志显示弹窗取消
    const autoCancle = () => {
      setAutoLogModal(
        {
          ...autoLogModal,
          show: false
        }
      );
    };

    useEffect(() => {
      showPagesContent(initData);
      showTabsPage();
      //   定时刷新数据review的数据
      // timeTaskForPageRefresh();
    }, [initData]);

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
            onDoubleClick={tabsChangeName}
          >
            {tabContent.panes.map((pane: any) => (
              <TabPane tab={pane.title} key={pane.key} closable={pane.closable}> </TabPane>
            ))}
          </Tabs>
        </div>

        {/* 其他控件 */}
        <div style={{marginTop: -10, backgroundColor: "white"}}>
          {/* 用于占位 */}
          <div style={{height: 5}}></div>

          {/* 检查进度 */}
          <div>
            <div>
              <Row>
                <label style={{marginLeft: 5, fontWeight: "bold"}}>检查进度：</label>
                <Progress strokeColor={"#2BF541"} style={{width: 800}} percent={processStatus.processPercent}/>
              </Row>

            </div>

            {/* 检查总览 */}
            <div style={{marginTop: 10, marginLeft: 5}}>

              <label style={{fontWeight: "bold"}}>检查总览：</label>
              <label>
                <button
                  style={{height: 13, width: 13, border: "none", backgroundColor: processStatus.releaseProject}}></button>
                &nbsp;预发布项目已填写完成
              </label>

              <label style={{marginLeft: 10}}>
                <button
                  style={{height: 13, width: 13, border: "none", backgroundColor: processStatus.upgradeService}}></button>
                &nbsp;升级服务已确认完成
              </label>

              <label style={{marginLeft: 10}}>
                <button
                  style={{height: 13, width: 13, border: "none", backgroundColor: processStatus.dataReview}}></button>
                &nbsp;数据Review确认完成
              </label>

              <label style={{marginLeft: 10}}>
                <button
                  style={{height: 13, width: 13, border: "none", backgroundColor: processStatus.onliineCheck}}></button>
                &nbsp;上线前检查已完成
              </label>

              <label style={{marginLeft: 10}}>
                <label style={{fontWeight: "bold"}}>发布结果：</label>
                <Select size={"small"} style={{width: 100}} onChange={pulishResulttChanged}
                        value={processStatus.releaseResult}>
                  <Option key={"1"} value={"1"}>发布成功</Option>
                  <Option key={"2"} value={"2"}>发布失败</Option>
                  <Option key={"9"} value={"9"}> </Option>
                </Select>
              </label>

            </div>


          </div>

          {/* 预发布项目 */}
          <div>
            <fieldset className={"fieldStyle"}>
              <legend className={"legendStyle"}>Step1 预发布项目</legend>

              <div style={{marginBottom: -20, marginTop: -5}}>

                <div style={{float: "right"}}>
                  <Button type="primary" disabled={saveButtonDisable}
                          style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5, marginLeft: 10}}
                          onClick={savePreRelaseProjects}>点击保存 </Button>
                </div>

                <div>
                  <Form form={formForPreReleaseProject}>
                    <Row>
                      <Col span={8}>

                        {/* 项目名称 */}
                        <Form.Item label="项目名称:" name="projectsName">
                          <Select showSearch mode="multiple" onFocus={releaseItemFocus}>
                            {projectsArray}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={5}>

                        {/* 发布类型 */}
                        <Form.Item label="发布类型:" name="pulishType" style={{marginLeft: 5}}>
                          <Select onFocus={releaseItemFocus}>
                            {releaseTypeArray}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={5}>

                        {/* 发布方式 */}
                        <Form.Item label="发布方式:" name="pulishMethod" style={{marginLeft: 5}}>
                          <Select onFocus={releaseItemFocus}>
                            {releaseWayArray}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        {/* 发布时间 */}
                        <Form.Item label="发布时间:" name="pulishTime" style={{marginLeft: 5}}>
                          <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{width: "100%"}}
                                      onFocus={releaseItemFocus}/>
                        </Form.Item>
                      </Col>

                    </Row>

                    <Row style={{marginTop: -20}}>
                      <Col span={3}>    {/* 编辑人信息 */}
                        {/* 编辑人 */}
                        <Form.Item label="编辑人:" name="editor">
                          <Input style={{border: "none", backgroundColor: "white", color: "black", marginLeft: -5}}
                                 disabled/>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        {/* 编辑时间 */}
                        <Form.Item label="编辑时间:" name="editTime" style={{marginLeft: 5}}>
                          <Input style={{border: "none", backgroundColor: "white", color: "black", marginLeft: -5}}
                                 disabled/>
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        {/* 隐藏的pro_id，对数据的操作需要 */}
                        <Form.Item name="proid">
                          <Input style={{display: "none"}}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                  </Form>
                </div>
              </div>


            </fieldset>
          </div>

          {/* 升级服务 */}
          <div>
            <fieldset className={"fieldStyle"}>
              <legend className={"legendStyle"}>Step2 升级服务</legend>
              <div>
                {/* 条件查询 */}
                <div style={{height: 35, marginTop: -15, overflow: "hidden"}}>
                  <Form form={formUpgradeService}>
                    <Row>
                      <Col span={12}>

                        {/* 一键部署ID */}
                        <Form.Item label="一键部署ID:" name="deployID" required style={{marginLeft: 10}}>
                          <Select mode="multiple" size={"small"} style={{width: '100%'}} showSearch
                                  onChange={onReleaseIdChanges}>
                            {releaseIDArray}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={12}>

                        <Button size={"small"} type="primary"
                                style={{
                                  color: '#46A0FC',
                                  backgroundColor: "#ECF5FF",
                                  borderRadius: 5,
                                  marginLeft: 10,
                                  marginTop: 3
                                }}
                                onClick={inquireServiceClick}
                        >点击查询</Button>
                      </Col>

                    </Row>
                  </Form>

                </div>
                {/* 两个表格 */}
                <div>

                  {/* 表格一 */}
                  <div className="ag-theme-alpine" style={{height: gridHeight.pulishItemGrid, width: '100%'}}>
                    <AgGridReact

                      columnDefs={getReleasedItemColumns()} // 定义列
                      // rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        suppressMenu: true,
                        minWidth: 90,
                        cellStyle: {"line-height": "25px"},
                      }}
                      getRowStyle={(params: any) => {
                        return releaseAppChangRowColor(allLockedArray, "step2-app", params.data?.app_id);
                      }}
                      headerHeight={25}
                      rowHeight={25}
                      onGridReady={onFirstGridReady}
                      onGridSizeChanged={onChangeFirstGridReady}
                      onColumnEverythingChanged={onChangeFirstGridReady}
                    >
                    </AgGridReact>
                  </div>

                  {/* 表格二 */}
                  <div className="ag-theme-alpine" style={{height: gridHeight.upgradeApiGrid, width: '100%'}}>

                    <AgGridReact
                      columnDefs={getReleasedApiColumns()} // 定义列
                      // rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                        minWidth: 90
                      }}
                      headerHeight={25}
                      rowHeight={25}
                      getRowStyle={(params: any) => {
                        return releaseAppChangRowColor(allLockedArray, "step2-api", params.data?.api_id);
                      }}
                      onGridReady={onSecondGridReady}
                      onGridSizeChanged={onChangeSecondGridReady}
                      onColumnEverythingChanged={onChangeSecondGridReady}
                    >
                    </AgGridReact>

                  </div>

                </div>


                {/* 服务确认完成 */}
                <div>
                  <div style={{fontWeight: "bold"}}> 服务确认完成</div>

                  <div className="ag-theme-alpine" style={{height: gridHeight.upConfirm, width: '100%'}}>

                    <AgGridReact
                      columnDefs={getReleaseServiceComfirmColumns()} // 定义列
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                        minWidth: 90
                      }}
                      headerHeight={25}
                      rowHeight={25}
                      onGridReady={onthirdGridReady}
                      onGridSizeChanged={onChangeThirdGridReady}
                      onColumnEverythingChanged={onChangeThirdGridReady}
                      frameworkComponents={{
                        confirmSelectChoice: (props: any) => {
                          const currentValue = props.value === '9' ? "" : props.value;
                          let Color = "black";
                          if (currentValue === "1") {
                            Color = "#2BF541"
                          } else if (currentValue === "2") {
                            Color = "orange";
                          }

                          return <Select size={"small"} defaultValue={currentValue} bordered={false}
                                         style={{width: '100%', color: Color}}
                                         onChange={
                                           (newValue: any) => {
                                             saveUperConfirmInfo(newValue, props);
                                           }
                                         }>

                            <Option key={"1"} value={"1"}>是</Option>
                            <Option key={"2"} value={"2"}>否</Option>
                            <Option key={"9"} value={"9"}> </Option>

                          </Select>;
                        },
                      }}
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
                {/* 表格 一 */}
                <div>
                  <div className="ag-theme-alpine" style={{height: gridHeight.dataRepaireReviewGrid, width: '100%'}}>
                    <AgGridReact

                      columnDefs={getReviewColumns()} // 定义列
                      // rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                        minWidth: 90
                      }}
                      headerHeight={25}
                      rowHeight={25}
                      getRowStyle={(params: any) => {
                        return releaseAppChangRowColor(allLockedArray, "step3-review", params.data?.review_id);
                      }}
                      onGridReady={onfirstDataReviewGridReady}
                      onGridSizeChanged={onChangefirstDataReviewGridReady}
                      onColumnEverythingChanged={onChangefirstDataReviewGridReady}
                    >
                    </AgGridReact>
                  </div>
                </div>

                {/* 表格 二 */}
                <div>
                  <div style={{fontWeight: "bold"}}> Review确认完成</div>
                  <div className="ag-theme-alpine" style={{height: gridHeight.reviewConfirm, width: '100%'}}>

                    <AgGridReact
                      columnDefs={getReviewConfirmColums()} // 定义列
                      // rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                      }}
                      frameworkComponents={{
                        selectChoice: (props: any) => {

                          const currentValue = props.value === "9" ? "" : props.value;
                          let Color = "black";
                          if (currentValue === "1") {
                            Color = "#2BF541"
                          } else if (currentValue === "2") {
                            Color = "orange";
                          }

                          return <Select size={"small"} defaultValue={currentValue} bordered={false}
                                         style={{width: '100%', color: Color}}
                                         onChange={
                                           (newValue: any) => {
                                             saveDataRepaireConfirmInfo(newValue, props.data);
                                           }
                                         }>

                            <Option key={"1"} value={"1"}>是</Option>
                            <Option key={"2"} value={"2"}>否</Option>
                            <Option key={"9"} value={"9"}> </Option>
                          </Select>;
                        },
                      }}
                      headerHeight={25}
                      rowHeight={25}
                      onGridReady={onsecondDataReviewGridReady}
                      onGridSizeChanged={onChangesecondDataReviewGridReady}
                      onColumnEverythingChanged={onChangesecondDataReviewGridReady}
                      // onCellEditingStopped={saveDataRepaireConfirmInfo}
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
                  <Spin spinning={executeStatus} tip="执行中...">

                    <div className="ag-theme-alpine" style={{height: gridHeight.onlineBranchGrid, width: '100%'}}>
                      <AgGridReact

                        columnDefs={getOnlineBranchColumns()} // 定义列
                        // rowData={[]} // 数据绑定
                        defaultColDef={{
                          resizable: true,
                          sortable: true,
                          suppressMenu: true,
                          autoHeight: true,
                          minWidth: 90
                        }}
                        headerHeight={25}
                        getRowStyle={(params: any) => {
                          return releaseAppChangRowColor(allLockedArray, "step4-onlineBranch", params.data?.branch_check_id);
                        }}
                        onGridReady={onfirstOnlineBranchGridReady}
                        onGridSizeChanged={onChangefirstOnlineBranchGridReady}
                        onColumnEverythingChanged={onChangefirstOnlineBranchGridReady}
                      >
                      </AgGridReact>
                    </div>

                  </Spin>

                </div>
                <div style={{fontSize: "smaller", marginTop: 10}}>
                  1、版本检查、环境一致性检查、自动化检查，在需要的时间节点，点击手动触发按钮，进行按需检查；
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
                    <div className="ag-theme-alpine" style={{height: gridHeight.orderList, width: '100%'}}>
                      <AgGridReact

                        columnDefs={getWorkOrderColumns()} // 定义列
                        // rowData={[]} // 数据绑定
                        defaultColDef={{
                          resizable: true,
                          sortable: true,
                          suppressMenu: true,
                          cellStyle: {"line-height": "25px"},
                          minWidth: 90
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

        {/* ------------------------各类弹窗--------------------------- */}

        {/* Tabs删除确认 */}
        <Modal
          title={'删除'}
          visible={showTabs.shown}
          onCancel={delTabsCancel}
          centered={true}
          footer={null}
          width={400}
          bodyStyle={{height: 140}}
        >
          <Form>
            <Form.Item>
              <label style={{marginLeft: 25}}>是否需要删除该批次发布过程，删除后下次发布需重新填写相关信息?</label>
            </Form.Item>

            <Form.Item>
              <Button
                style={{borderRadius: 5, marginLeft: 20, float: "right"}} onClick={delTabsCancel}>取消
              </Button>
              <Button type="primary"
                      style={{
                        color: '#46A0FC',
                        backgroundColor: "#ECF5FF",
                        borderRadius: 5,
                        marginLeft: 100,
                        float: "right"
                      }}
                      onClick={delTabsInfo}>确定
              </Button>

            </Form.Item>

            <Form.Item name="groupId" style={{display: "none", width: "32px", marginTop: "-55px", marginLeft: "270px"}}>
              <Input/>
            </Form.Item>
          </Form>
        </Modal>

        {/* 表格明细删除确认 */}
        <Modal
          title={'删除'}
          visible={delModal.shown}
          onCancel={delCancel}
          centered={true}
          footer={null}
          width={400}
          bodyStyle={{height: 130}}
        >
          <Form>
            <Form.Item>
              <label style={{marginLeft: '100px'}}>确定删除本条数据吗？</label>
            </Form.Item>

            <Form.Item>
              <Button
                style={{borderRadius: 5, marginLeft: 20, float: "right"}} onClick={delCancel}>取消
              </Button>

              <Button type="primary"
                      style={{
                        color: '#46A0FC',
                        backgroundColor: "#ECF5FF",
                        borderRadius: 5,
                        marginLeft: 100,
                        float: "right"
                      }}
                      onClick={delDetailsInfo}>确定
              </Button>

            </Form.Item>

            <Form.Item name="groupId" style={{display: "none", width: "32px", marginTop: "-55px", marginLeft: "270px"}}>
              <Input/>
            </Form.Item>
          </Form>
        </Modal>

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
                <Form.Item name="onlineEnv" label="上线环境:" required style={{marginTop: -15}}>
                  <Select showSearch mode="multiple">
                    {pulishItemFormSelected.onlineEnv}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="pulishItem" label="发布项：" required style={{marginTop: -15, marginLeft: 10}}>
                  <Select showSearch style={{marginLeft: 27, width: 183}}>
                    {pulishItemFormSelected.pulishItem}
                  </Select>
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col span={12}>
                <Form.Item name="application" label="应用：" required style={{marginTop: -15}}>
                  <Input autoComplete="off" style={{marginLeft: 28, width: 206, color: "black"}} disabled/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="branchAndEnv" label="分支和环境：" required style={{marginTop: -15, marginLeft: 10}}>
                  <Input autoComplete="off" disabled style={{color: "black"}}/>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="interAndDbUpgrade" label="是否涉及接口与数据库升级：" required style={{marginTop: -15}}>
              <Select>
                {pulishItemFormSelected.isApiDbUpgrade}
              </Select>
            </Form.Item>

            <Form.Item name="hotUpdate" label="是否支持热更新：" required style={{marginTop: -15}}>
              <Select>
                <Option key={"1"} value={"1"}>{"是"}</Option>
                <Option key={"2"} value={"2"}>{"否"}</Option>
              </Select>
            </Form.Item>

            <Form.Item name="description" label="说明：" style={{marginTop: -15}}>
              <TextArea/>
            </Form.Item>
            <Form.Item name="remark" label="备注：" style={{marginTop: -15}}>
              <TextArea/>
            </Form.Item>
            <Form.Item>
              <Button
                style={{borderRadius: 5, marginLeft: 20, float: "right"}} onClick={pulishItemModalCancle}>取消
              </Button>
              <Button type="primary"
                      style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5, float: "right"}}
                      onClick={savePulishResult}>确定 </Button>

            </Form.Item>

            {/* 隐藏字段，进行修改需要的字段 */}
            <Row style={{marginTop: -60}}>
              <Col span={2}>
                <Form.Item name="appId">
                  <Input style={{width: 50, display: "none"}}/>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="automationTest">
                  <Input style={{width: 50, display: "none"}}/>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="deploymentId">
                  <Input style={{width: 50, display: "none"}}/>
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
          width={630}

        >
          <Form form={upgradeIntForm}>

            <Row>
              <Col span={12}>
                <Form.Item name="onlineEnv" label="上线环境:" required style={{marginTop: -15}}>
                  <Select showSearch mode="multiple" style={{marginLeft: 20, width: 185}}>
                    {upgradeApiFormSelected.onlineEnv}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="upInterface" label="升级接口：" required style={{marginLeft: 10, marginTop: -15}}>
                  <Select showSearch style={{}}>
                    {upgradeApiFormSelected.upgradeApi}
                  </Select>
                </Form.Item>
              </Col>

            </Row>

            <Row>
              <Col span={12}>
                <Form.Item name="interService" label="接口服务：" required style={{marginTop: -15}}>
                  <Select showSearch style={{marginLeft: 21, width: 185}}>
                    {upgradeApiFormSelected.apiService}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="renter" label="涉及租户：" required style={{marginLeft: 10, marginTop: -15}}>
                  <Input/>
                </Form.Item>
              </Col>

            </Row>

            <Row>
              <Col span={12}>
                <Form.Item name="method" label="接口Method：" required style={{marginTop: -15}}>
                  <Select showSearch style={{}}>
                    {upgradeApiFormSelected.apiMethod}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="URL" label="接口URL：" required style={{marginLeft: 10, marginTop: -15}}>
                  <Input/>
                </Form.Item>
              </Col>

            </Row>

            <Form.Item name="hotUpdate" label="是否支持热更新：" required style={{marginTop: -15}}>
              <Select>
                <Option key={"1"} value={"1"}>{"是"}</Option>
                <Option key={"2"} value={"2"}>{"否"}</Option>
              </Select>
            </Form.Item>

            <Form.Item name="remark" label="备注：" style={{marginTop: -15}}>
              <TextArea/>
            </Form.Item>

            <Form.Item>
              <Button
                style={{borderRadius: 5, marginLeft: 20, float: "right"}} onClick={upgradeIntModalCancle}>取消
              </Button>
              <Button type="primary"
                      style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5, float: "right"}}
                      onClick={saveUpgradeInterResult}>确定 </Button>

            </Form.Item>
            {/* 隐藏字段，进行修改需要的字段 */}
            <Row style={{marginTop: -60}}>
              <Col span={2}>
                <Form.Item name="apiId">
                  <Input style={{width: 50, display: "none"}}/>
                </Form.Item>
              </Col>

            </Row>

          </Form>
        </Modal>

        {/* 数据修复review */}
        <Modal
          title={dataReviewtModal.title}
          visible={dataReviewtModal.shown}
          onCancel={dataReviewModalCancle}
          centered={true}
          footer={null}
          width={630}
        >
          <Form form={dataReviewForm}>

            <Form.Item name="repaireContent" label="数据修复内容:" required style={{marginTop: -15}}>
              <TextArea/>
            </Form.Item>
            <Row>
              <Col span={12}>
                <Form.Item name="relatedRenter" label="涉及租户：" required style={{marginTop: -15}}>
                  <Input style={{marginLeft: 14, width: 191}}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="types" label="类型：" required style={{marginLeft: 10, marginTop: -15}}>
                  <Select showSearch>
                    {dataReviewFormSelected.category}
                  </Select>
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col span={12}>
                <Form.Item name="repaireCommiter" label="修复提交人：" required style={{marginTop: -15}}>
                  <Select showSearch>
                    {dataReviewFormSelected.repairCommiter}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="branch" label="分支：" required style={{marginLeft: 10, marginTop: -15}}>
                  <Input/>
                </Form.Item>
              </Col>

            </Row>

            <Row>
              <Col span={12}>
                <Form.Item name="EvalResult" label="评审结果：" required style={{marginTop: -15}}>
                  <Select style={{width: 191, marginLeft: 14}}>
                    <Option key={"1"} value={"1"}>{"通过"}</Option>
                    <Option key={"2"} value={"2"}>{"不通过"}</Option>
                    <Option key={"9"} value={"9"}>{""}</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="repeatExecute" label="是否可重复执行：" required style={{marginLeft: 10, marginTop: -15}}>
                  <Select>
                    <Option key={"1"} value={"1"}>{"是"}</Option>
                    <Option key={"2"} value={"2"}>{"否"}</Option>
                    <Option key={"9"} value={"9"}>{""}</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                style={{borderRadius: 5, marginLeft: 20, float: "right"}} onClick={dataReviewModalCancle}>取消
              </Button>
              <Button type="primary"
                      style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5, float: "right"}}
                      onClick={saveDataReviewResult}>确定 </Button>

            </Form.Item>
            {/* 隐藏字段，进行修改需要的字段 */}
            <Row style={{marginTop: -60}}>
              <Col span={2}>
                <Form.Item name="reviewId">
                  <Input style={{width: 50, display: "none"}}/>
                </Form.Item>
              </Col>

            </Row>

          </Form>
        </Modal>

        {/* 自动化日志的弹窗确认 */}
        <Modal
          title={'自动化日志窗'}
          visible={autoLogModal.show}
          onCancel={autoCancle}
          centered={true}
          footer={null}
          width={400}
          bodyStyle={{height: 145}}
        >
          <Form>
            <Form.Item name="UiLog" label="UI日志:" style={{marginTop: -15}}>
              <a href={`{autoLogModal.url.ui}`}
                 target={"_black"}>{autoLogModal.url.ui}</a>
            </Form.Item>

            <Form.Item name="interfaceLog" label="接口日志:" style={{marginTop: -15}}>
              <a href={`${autoLogModal.url.api}`}
                 target={"_black"}>{autoLogModal.url.api}</a>
            </Form.Item>

            <Form.Item>
              <Button
                style={{float: "right"}} onClick={autoCancle}>关闭
              </Button>
            </Form.Item>


          </Form>
        </Modal>

        {/* 上线分支设置  */}
        <Modal
          title={`上线分支设置-${onlineBranchModal.title}`}
          visible={onlineBranchModal.shown}
          onCancel={onlineBranchCancle}
          maskClosable={false}
          centered={true}
          footer={null}
          width={652}

        >

          <Form form={formForOnlineBranch}>

            {/* 总设置 */}
            <div>
              <Row>
                <Col span={16}>

                  {/* 分支名称 */}
                  <Form.Item label="分支名称:" name="branchName" required={true}>
                    <Select style={{width: '100%'}} showSearch>
                      {onlineBranchFormSelected.branchName}
                    </Select>
                  </Form.Item>
                  {/* 忽略前端单元测试检查 */}
                  <Form.Item name="ignoreFrontCheck" style={{marginLeft: 0, marginTop: -20}}>
                    <Checkbox.Group>
                      <Checkbox value={"1"}>忽略前端单元测试检查</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>

                  {/* 技术侧 */}
                  <Form.Item label="技术侧:" name="module" style={{marginLeft: 10}} required={true}>
                    <Select style={{width: '100%'}} showSearch>
                      {onlineBranchFormSelected.techSide}
                    </Select>
                  </Form.Item>
                  {/* 忽略后端单元测试检查 */}
                  <Form.Item name="ignoreBackendCheck" style={{marginLeft: 0, marginTop: -20}}>
                    <Checkbox.Group>
                      <Checkbox value={"1"}>忽略后端单元测试检查</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
              </Row>

            </div>

            {/* ① 版本检查设置 */}
            <div style={{marginTop: -35}}>
              <Divider plain>① 版本检查设置</Divider>

              <div>
                <Card size="small" title="版本检查" style={{width: "100%", marginTop: -10, height: 150}}>
                  <Form.Item name="verson_check" label="是否开启：" valuePropName="checked" style={{marginTop: -10}}>
                    <Switch checkedChildren="是" unCheckedChildren="否" style={{marginLeft: 40}}/>
                  </Form.Item>
                  <Form.Item name="server" label="服务" style={{marginTop: -22}}>
                    <Select mode="multiple" placeholder="请选择相应的服务！" style={{marginLeft: 68, width: 415}}>
                      {onlineBranchFormSelected.server}
                    </Select>
                  </Form.Item>
                  <Form.Item name="imageevn" label="镜像环境" style={{marginTop: -20}}>
                    <Select placeholder="请选择对应的环境！" style={{marginLeft: 40, width: 415}} showSearch>
                      {onlineBranchFormSelected.imgEnv}
                    </Select>
                  </Form.Item>
                </Card>
              </div>

              <div>
                <Card size="small" title="检查上线分支是否包含对比分支的提交" style={{width: "100%", height: 200}}>
                  <Form.Item name="branchcheck" label="是否开启：" valuePropName="checked" style={{marginTop: -10}}>
                    <Switch checkedChildren="是" unCheckedChildren="否" style={{marginLeft: 40}}/>
                  </Form.Item>

                  <Form.Item label="被对比的主分支" name="branch_mainBranch" style={{marginTop: -25}}>
                    <Checkbox.Group>
                      <Checkbox value={"stage"}>stage</Checkbox>
                      <Checkbox value={"master"}>master</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item label="技术侧" name="branch_teachnicalSide" style={{marginTop: -25}}>
                    <Checkbox.Group style={{marginLeft: 56}}>
                      <Checkbox value={"front"}>前端</Checkbox>
                      <Checkbox value={"backend"}>后端</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item label="对比起始时间" name="branch_mainSince" style={{marginTop: -20}}>
                    <DatePicker style={{marginLeft: 13, width: 415}}/>
                  </Form.Item>
                  <div style={{color: "gray", marginTop: -25, marginLeft: 110}}>默认时间代表查询近一周的数据</div>
                </Card>
              </div>
            </div>

            {/* ② 环境一致性检查 */}
            <div style={{marginTop: -10}}>
              <Divider plain>② 环境一致性检查</Divider>
              <div>
                <Row>
                  <Col span={9}>
                    {/* 忽略检查 */}
                    <Form.Item label="是否忽略检查" name="ignoreCheck" style={{marginTop: -10}}>
                      <Checkbox.Group>
                        <Checkbox value={"1"}>忽略检查</Checkbox>
                      </Checkbox.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>

                    {/* 检查环境 */}
                    <Form.Item label="检查环境:" name="checkEnv" style={{marginTop: -10}}>
                      <Select style={{width: '100%'}} showSearch>
                        {onlineBranchFormSelected.imgEnv}
                      </Select>
                    </Form.Item>

                  </Col>
                </Row>
              </div>
            </div>

            {/* ③ 上线前自动化检查设置 */}
            <div style={{marginTop: -30}}>
              <Divider plain>③ 上线前自动化检查设置</Divider>
              <Row style={{marginTop: -10}}>
                <Col>
                  {/* 忽略检查 */}
                  <Form.Item label="是否忽略检查" name="autoBeforeIgnoreCheck" style={{marginTop: -10}}>
                    <Checkbox.Group>
                      <Checkbox value={"1"}>忽略检查</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{marginTop: -10}}>
                <Col span={8}>
                  {/* 检查类型 */}
                  <Form.Item label="检查类型:" name="beforeCheckType" style={{marginTop: -10}}>
                    <Select mode="multiple" style={{width: '100%'}} showSearch>
                      {onlineBranchFormSelected.checkType}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={9}>
                  {/* 测试环境 */}
                  <Form.Item label="测试环境:" name="beforeTestEnv" style={{marginTop: -10, marginLeft: 10}}>
                    <Select style={{width: '100%'}} showSearch>
                      {onlineBranchFormSelected.imgEnv}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  {/* 浏览器 */}
                  <Form.Item label="浏览器:" name="beforeBrowser" style={{marginTop: -10, marginLeft: 10}}>
                    <Select style={{width: '100%'}} showSearch>
                      {onlineBranchFormSelected.browser}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* ④ 上线后自动化检查设置 */}
            <div style={{marginTop: -30}}>
              <Divider plain>④ 上线后自动化检查设置</Divider>
              <Row style={{marginTop: -10}}>
                <Col>
                  {/* 忽略检查 */}
                  <Form.Item label="是否忽略检查" name="autoAfterIgnoreCheck" style={{marginTop: -10}}>
                    <Checkbox.Group>
                      <Checkbox value={"1"}>忽略检查</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{marginTop: -10}}>
                <Col span={8}>
                  {/* 检查类型 */}
                  <Form.Item label="检查类型:" name="afterCheckType" style={{marginTop: -10}}>
                    <Select mode="multiple" style={{width: '100%'}} showSearch>
                      {onlineBranchFormSelected.checkType}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={9}>
                  {/* 测试环境 */}
                  <Form.Item label="测试环境:" name="afterTestEnv" style={{marginTop: -10, marginLeft: 10}}>
                    <Select style={{width: '100%'}} showSearch>
                      {onlineBranchFormSelected.imgEnv}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  {/* 浏览器 */}
                  <Form.Item label="浏览器:" name="afterBrowser" style={{marginTop: -10, marginLeft: 10}}>
                    <Select style={{width: '100%'}} showSearch>
                      {onlineBranchFormSelected.browser}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Spin spinning={onlineBranchModal.loading} tip="保存中...">
              <Form.Item>
                <Button
                  style={{borderRadius: 5, marginLeft: 20, float: "right"}} onClick={() => {
                  formForOnlineBranch.resetFields();
                }}>清空
                </Button>

                <Button type="primary"
                        style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5, float: "right"}}
                        onClick={saveOnlineBranchResult}>保存 </Button>
              </Form.Item>
            </Spin>

            {/* 隐藏字段，进行修改需要的字段 */}
            <Row style={{marginTop: -60}}>
              <Col span={2}>
                <Form.Item name="branchCheckId">
                  <Input style={{width: 50, display: "none"}}/>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="versionCheckId">
                  <Input style={{width: 50, display: "none"}}/>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="envCheckId">
                  <Input style={{width: 50, display: "none"}}/>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="beforeAutomationId">
                  <Input style={{width: 50, display: "none"}}/>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="afterAutomationId">
                  <Input style={{width: 50, display: "none"}}/>
                </Form.Item>
              </Col>
            </Row>

          </Form>

        </Modal>


      </PageContainer>
    );
  }
;


export default PreRelease;
