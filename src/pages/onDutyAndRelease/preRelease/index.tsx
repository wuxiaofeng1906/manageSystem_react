import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './supplementFile/style.css';
import {
  Button, Form, Input, message, Modal, Select, Tabs,
  Row, Col, DatePicker, Checkbox, Divider, Card, Switch, Progress
} from 'antd';
import dayjs from "dayjs";
import {AgGridReact} from "ag-grid-react";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {
  loadPrjNameSelect, loadReleaseTypeSelect, loadReleaseWaySelect, loadReleaseIDSelect
} from "./supplementFile/controler";
import {useRequest} from "ahooks";
import {savePreProjects, inquireService} from "./supplementFile/logic";
import {alalysisInitData} from "./supplementFile/dataAnalyze";
import {
  getReleaseItem, getIfOrNot, getDatabseAndApiUpgrade, getApiMethod, getUpgradeApi, getOnlineDev,
  getRepaireType, getPassOrNot, getTechSide
} from "./supplementFile/converse";

const {TabPane} = Tabs;
const {Option} = Select;
const {TextArea} = Input;
const currentDate = dayjs().format("YYYYMMDD");
let currentListNo = "";
let releaseIdArray: any;

const PreRelease: React.FC<any> = () => {
  const [pulishItemForm] = Form.useForm();
  const [upgradeIntForm] = Form.useForm();
  const [dataReviewForm] = Form.useForm();
  const [formForOnlineBranch] = Form.useForm();

  // 发布项新增和修改的共同modal显示
  const [pulishItemModal, setPulishItemModal] = useState({shown: false, title: "新增"});

  // 发布项新增和修改的共同modal显示
  const [upgradeIntModal, setUpgradeIntModal] = useState({shown: false, title: "新增"});
  // 发布项新增和修改的共同modal显示
  const [dataReviewtModal, setDataReviewModal] = useState({shown: false, title: "新增"});

  // 自动化测试日志弹窗
  const [autoLogModal, setAutoLogModal] = useState(false);
  const autoCancle = () => {
    setAutoLogModal(false);
  };

  // 上线分支设置
  const [onlineBranchModal, setOnlineBranchModal] = useState({shown: false, title: "新增"});

  const initData = useRequest(() => alalysisInitData()).data;

  /* region 新增行 */

  // 新增行
  (window as any).addRows = (types: any) => {

    switch (types) {
      case 1:
        pulishItemForm.resetFields();
        setPulishItemModal({
          shown: true,
          title: "新增"
        });
        break;

      case 2:
        upgradeIntForm.resetFields();
        setUpgradeIntModal({
          shown: true,
          title: "新增"
        });
        break;

      case 3:
        dataReviewForm.resetFields();
        setDataReviewModal({
          shown: true,
          title: "新增"
        });
        break;
      case 4:
        // dataReviewForm.resetFields();
        setOnlineBranchModal({
          shown: true,
          title: "新增"
        });
        break;
      default:
        break;
    }

  };

  /* endregion  */

  /* region 修改行 */

  // 修改行
  (window as any).modifyRows = (types: any, params: any) => {
    //  显示数据
    switch (types) {
      case 1:
        pulishItemForm.setFieldsValue({
          onlineEnv: params.onlineDev,
          pulishItem: params.pulishItem,
          application: params.application,
          hotUpdate: params.hotUpdate,
          interAndDbUpgrade: params.upGrade,
          branchAndEnv: params.branchAndDev,
          description: params.desc,
          remark: params.remark
        });
        setPulishItemModal({
          shown: true,
          title: "修改"
        });
        break;
      case 2:
        upgradeIntForm.setFieldsValue({
          onlineEnv: params.onlineDev,
          upInterface: params.upgradeInte,
          interService: params.intService,
          hotUpdate: params.hotUpdate,
          method: params.intMethod,
          URL: params.intURL,
          renter: params.relateRenter,
          remark: params.remark
        });
        setUpgradeIntModal({
          shown: true,
          title: "修改"
        });
        break;
      case 3:

        dataReviewForm.setFieldsValue({
          repaireContent: params.repaireContent,
          relatedRenter: params.relateRenter,
          types: params.type,
          repaireCommiter: params.repaireCommiter,
          branch: params.branch,
          EvalResult: params.reviewResult,
          repeatExecute: params.repeatExcute
        });
        setDataReviewModal({
          shown: true,
          title: "修改"
        });
        break;

      case 4:
        setOnlineBranchModal({
          shown: true,
          title: "修改"
        });
        break;
      default:
        break;
    }


  };


  /* endregion  */

  /* region 删除功能 */
  const [delModal, setDelModal] = useState({
    shown: false,
    type: -1,
    datas: {}
  });
  // 取消删除
  const delCancel = () => {
    setDelModal({
      shown: false,
      type: -1,
      datas: {}
    });
  };

  const delDetailsInfo = () => {

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

  /* region 表格相关定义和事件 */

  // 操作按钮渲染
  const operateRenderer = (type: number, params: any) => {
    const typeStr = JSON.stringify(type);
    const paramData = JSON.stringify(params.data);

    return `
        <div style="margin-top: -5px">
            <Button  style="border: none; background-color: transparent; " onclick='addRows(${typeStr},${paramData})'>
              <img src="../add_1.png" width="15" height="15" alt="新增" title="新增">
            </Button>
             <Button  style="border: none; background-color: transparent;  margin-left: -10px; " onclick='modifyRows(${typeStr},${paramData})'>
              <img src="../edit.png" width="15" height="15" alt="修改" title="修改">
            </Button>
            <Button  style="border: none; background-color: transparent; margin-left: -10px ; " onclick='deleteRows(${typeStr},${paramData})'>
              <img src="../delete_2.png" width="15" height="15" alt="删除" title="删除">
            </Button>
        </div>
           `;

  };

  // 改变行的颜色（正在编辑的行颜色）
  const ChangRowColor = (params: any) => {
    if (params.data?.onlineDev === "集群1") {

      // 上下设置颜色
      return {'background-color': '#FFF6F6'};

    }
    return {'background-color': 'transparent'};
  };

  // 下拉框相关字段的颜色渲染
  const selectColorRenderer = (params: any) => {
    let Color = "orange";
    const values = getIfOrNot(params.value);
    if (values === "是") {
      Color = "#2BF541"
    }

    return `<span style="color: ${Color}"> ${values}</span>`
  };

  /* region 升级服务 一 */
  const firstUpSerGridApi = useRef<GridApi>();
  const firstUpSerColumn: any = [
    {
      headerName: '上线环境',
      field: 'online_environment',
      cellRenderer: (params: any) => {
        return `<span>${getOnlineDev(params.value)}</span>`
      }

    },
    {
      headerName: '发布项',
      field: 'release_item',
      minWidth: 95,
      cellRenderer: (params: any) => {
        const item = getReleaseItem(params.value);
        return `<span>${item}</span>`
      }
    },
    {
      headerName: '应用',
      field: 'app',
      minWidth: 65
    },
    {
      headerName: '是否支持热更新',
      field: 'hot_update',
      minWidth: 130,
      cellRenderer: (params: any) => {
        return `<span>${getIfOrNot(params.value)}</span>`
      }
    },
    {
      headerName: '是否涉及接口与数据库升级',
      field: 'is_upgrade_api_database',
      minWidth: 196,
      cellRenderer: (params: any) => {
        return `<span>${getDatabseAndApiUpgrade(params.value)}</span>`
      }
    },
    {
      headerName: '分支和环境',
      field: 'branch_environment',
      minWidth: 105,
    },
    {
      headerName: '编辑人',
      field: 'edit_user_name',
      minWidth: 75
    },
    {
      headerName: '编辑时间',
      field: 'edit_time',
    },
    {
      headerName: '说明',
      field: 'instructions',
    },
    {
      headerName: '备注',
      field: 'remarks',
    },
    {
      headerName: '操作',
      cellRenderer: (params: any) => {
        return operateRenderer(1, params)
      }
    }];

  const onFirstGridReady = (params: GridReadyEvent) => {
    firstUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onChangeFirstGridReady = (params: GridReadyEvent) => {
    firstUpSerGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 保存发布项结果
  const savePulishResult = () => {

  };

  // 取消发布项弹出窗
  const pulishItemModalCancle = () => {
    setPulishItemModal({
      ...pulishItemModal,
      shown: false
    });
  };
  /* endregion  */

  /* region 升级服务 二  */
  const secondUpSerColumn: any = [
    {
      headerName: '上线环境',
      field: 'online_environment',
      cellRenderer: (params: any) => {
        return `<span>${getOnlineDev(params.value)}</span>`
      }
    },
    {
      headerName: '升级接口',
      field: 'update_api',
      cellRenderer: (params: any) => {
        return `<span>${getUpgradeApi(params.value)}</span>`
      }

    },
    {
      headerName: '接口服务',
      field: 'api_name',
    },
    {
      headerName: '是否支持热更新',
      field: 'hot_update',
      cellRenderer: (params: any) => {
        return `<span>${getIfOrNot(params.value)}</span>`
      }
    },
    {
      headerName: '接口Method',
      field: 'api_method',
      cellRenderer: (params: any) => {
        return `<span>${getApiMethod(params.value)}</span>`
      }

    },
    {
      headerName: '接口URL',
      field: 'api_url',
    },
    {
      headerName: '编辑人',
      field: 'edit_user_name',
      minWidth: 75
    },
    {
      headerName: '编辑时间',
      field: 'edit_time',
    },
    {
      headerName: '涉及租户',
      field: 'related_tenant',
    },
    {
      headerName: '备注',
      field: 'remarks',
    },
    {
      headerName: '操作',
      cellRenderer: (params: any) => {
        return operateRenderer(2, params)
      }
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

  // 保存数据
  const saveUpgradeInterResult = () => {

  };
  // 取消事件
  const upgradeIntModalCancle = () => {
    setUpgradeIntModal({
      ...upgradeIntModal,
      shown: false,

    });
  };
  /* endregion   */

  /* region 升级服务 三  */

  const thirdUpSerColumn = [
    {
      headerName: '前端值班',
      field: 'front_user_name',
      minWidth: 90,
    },
    {
      headerName: '服务确认完成',
      field: 'front_confirm_status',
      minWidth: 115,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: selectColorRenderer
    },
    {
      headerName: '确认时间',
      field: 'front_confirm_time',
    },
    {
      headerName: '后端值班',
      field: 'back_end_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'back_end_confirm_status',
      minWidth: 115,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: selectColorRenderer
    },
    {
      headerName: '确认时间',
      field: 'back_end_confirm_time',
    },
    {
      headerName: '流程确认',
      field: 'process_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'process_confirm_status',
      minWidth: 115,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: selectColorRenderer
    },
    {
      headerName: '确认时间',
      field: 'process_confirm_time',
    },
    {
      headerName: '测试值班',
      field: 'test_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'test_confirm_status',
      minWidth: 115,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: selectColorRenderer
    },
    {
      headerName: '确认时间',
      field: 'test_confirm_time',
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

  // 下拉框选择是否确认事件
  const saveUperConfirmInfo = (params: any) => {
    switch (params.column.colId) {
      case "frontConfirm":  // 前端
        break;
      case "backendConfirm": // 后端
        break;
      case "flowConfirmOk":  // 流程
        break;
      case "testConfirm": // 测试
        break;
      default:
        break;
    }
    //  如果前后两个值不同，则需要更新
    if (params.newValue !== params.oldValue) {
      //   选择从否变是的话，需要更新确认时间；如果之前就是是，就不用更新数据 了。
      if (params.newValue === "是") {
        console.log(params);

      }
    }


  };

  /* endregion   */

  /*  region 数据修复 Review 一 */

  const firstDataReviewColumn: any = [
    {
      headerName: '序号',
      field: 'No',
      minWidth: 65,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '数据修复内容',
      field: 'repair_data_content',
      minWidth: 120
    },
    {
      headerName: '涉及租户',
      field: 'related_tenant',
    },
    {
      headerName: '类型',
      field: 'type',
      minWidth: 80,
      cellRenderer: (params: any) => {
        return `<span>${getRepaireType(params.value)}</span>`
      }

    },
    {
      headerName: '修复提交人',
      field: 'commit_user_name',
      minWidth: 105
    },
    {
      headerName: '分支',
      field: 'branch',
    },
    {
      headerName: '编辑人',
      field: 'edit_user_name',
      minWidth: 75
    },
    {
      headerName: '编辑时间',
      field: 'edit_time',
    },
    {
      headerName: '评审结果',
      field: 'review_result',
      cellRenderer: (params: any) => {
        return `<span>${getPassOrNot(params.value)}</span>`
      }

    },
    {
      headerName: '是否可重复执行',
      field: 'is_repeat',
      minWidth: 130,
      cellRenderer: (params: any) => {
        return `<span>${getIfOrNot(params.value)}</span>`
      }
    },
    {
      headerName: '操作',
      cellRenderer: (params: any) => {

        return operateRenderer(3, params);
      }
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

  const dataReviewModalCancle = () => {
    setDataReviewModal({
      shown: false,
      title: "新增"
    });

  };
  const saveDataReviewResult = () => {

  };
  /* endregion */

  /*  region 数据修复 Review 二 */

  const secondDataReviewColumn = [
    {
      headerName: '后端值班',
      field: 'confirm_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'confirm_status',
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: selectColorRenderer
    },
    {
      headerName: '确认时间',
      field: 'confirm_time',
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
  // 下拉框选择是否确认事件
  const saveDataRepaireConfirmInfo = (params: any) => {

    //  如果前后两个值不同，则需要更新
    if (params.newValue !== params.oldValue) {
      //   选择从否变是的话，需要更新确认时间；如果之前就是是，就不用更新数据 了。
      if (params.newValue === "是") {
        console.log(params);

      }
    }
  };
  /* endregion */

  /*  region 上线分支 */

  // 渲染单元测试运行是否通过字段
  const rendererUnitTest = (params: any) => {

    const values = params.value;
    if (!values) {
      return "";
    }

    let frontValue = "";
    let frontTime = "";
    let backendValue = "";
    let backendTime = "";

    // 循环解析前后端的数据
    values.forEach((ele: any) => {

      // 解析是否成功
      let passFlag = "";
      if (ele.ignore_check === "1") {
        passFlag = "是";
      } else if (ele.test_case_status === "success") {
        passFlag = "是";
      } else if (ele.test_case_status === "error") {
        passFlag = "否";
      } else if (ele.test_case_status === "skip") {
        passFlag = "忽略";
      } else if (ele.test_case_status === "running") {
        passFlag = "运行中";
      }

      // 解析时间
      const start = ele.test_case_start_time === "" ? "" : dayjs(ele.test_case_start_time).format("HH:mm:ss");
      const end = ele.test_case_end_time === "" ? "" : dayjs(ele.test_case_end_time).format("HH:mm:ss");
      let timeRange = "";
      if (start) {
        timeRange = `${start}~${end}`;
      }
      if (ele.test_case_technical_side === "1") { // 前端
        frontValue = passFlag;
        frontTime = timeRange;
      } else {  // 后端
        backendValue = passFlag;
        backendTime = timeRange;
      }

    });

    // 前端的颜色
    let frontColor = "black";
    if (frontValue === "是") {
      frontColor = "#2BF541";
    } else if (frontValue === "否") {
      frontColor = "#8B4513";
    } else if (frontValue === "忽略") {
      frontColor = "blue";
    }

    // 后端的颜色
    let bacnkendColor = "black";
    if (backendValue === "是") {
      bacnkendColor = "#2BF541";
    } else if (backendValue === "否") {
      bacnkendColor = "#8B4513";
    } else if (backendValue === "忽略") {
      bacnkendColor = "blue";
    }

    if (params.data?.technical_side === "1") {  // 前端

      return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>前端： <label style="color: ${frontColor}"> ${frontValue}</label> &nbsp;${frontTime}</div>
            </div>

        </div>
    `;

    }
    if (params.data?.technical_side === "2") {   // 后端
      return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div> 后端：<label style="color: ${bacnkendColor}"> ${backendValue}</label>
                &nbsp;${backendTime}</div>
            </div>
        </div>
    `;
    }
    return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>前端： <label style="color: ${frontColor}"> ${frontValue}</label> &nbsp;${frontTime}</div>
                <div style="margin-top: -20px"> 后端：
                <label style="color: ${bacnkendColor}"> ${backendValue}</label>
                &nbsp;${backendTime}</div>
            </div>

        </div>
    `;

  };

  // 渲染上线前版本检查是否通过
  const beforeOnlineVersionCheck = (params: any) => {

    const commonDiv = `
    <div style="margin-top: -10px">
        <div style="text-align: right" >

            <Button  style="margin-left: -10px; border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick=''>
              <img src="../执行.png" width="14" height="14" alt="执行参数" title="执行参数">
            </Button>
            <Button  style="margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick=''>
              <img src="../taskUrl.png" width="14" height="14" alt="执行参数" title="执行参数">
            </Button>
        </div>
    </div>
    `;

    if (!params.value) {
      return "";
    }
    const values: any = (params.value)[0];// 本数组只会有一条数据
    // 解析所属端
    let side = "";
    if (values.technical_side === "front") {
      side = "前端";
    } else if (values.technical_side === "backend") {
      side = "后端";
    } else if (values.technical_side === "front,backend") {
      side = "前后端";
    }


    // 解析时间
    const start = values.check_start_time === "-" ? "" : dayjs(values.check_start_time).format("HH:mm:ss");
    const end = values.check_end_time === "-" ? "" : dayjs(values.check_end_time).format("HH:mm:ss");
    let timeRange = "";
    if (start) {
      timeRange = `${start}~${end}`;
    }

    // 解析结果
    let result = "";
    let frontColor = "black";

    if (values.check_result === "9") {  // 9是未结束，然后就获取检查状态

      if (values.check_status === "1") {
        result = "未开始";
      } else if (values.check_status === "2") {
        result = "检查中";
      } else if (values.check_status === "3") {
        result = "已结束";
      }
      frontColor = "#8B4513";
    } else if (values.check_result === "1") {
      result = "是";
      frontColor = "#2BF541";
    } else if (values.check_result === "2") {
      result = "否";
      frontColor = "#46A0FC";
    }

    return `
        ${commonDiv}
        <div style="margin-top: -20px">
            <div style="font-size: 10px">
                <div>${side}： <button style="color: ${frontColor};width: 40px;border: none;background-color: transparent"> ${result}</button> &nbsp;${timeRange}</div>
            </div>

        </div>
    `;

  };

  // 上线前环境检查
  const beforeOnlineEnvCheck = (params: any) => {

    if ((params.value).length === 0) {
      return "";
    }
    const values = (params.value)[0]; // 也只会有一条数据

    // 显示结果和颜色
    let result = "";
    let Color = "black";
    if (values.ignore_check === "1") {// 忽略
      result = "忽略";
      Color = "blue";

    } else if (values.ignore_check === "2") {  // 不忽略
      if (values.check_result === "success") {
        result = "是";
        Color = "#2BF541";
      } else {
        result = "否";
        Color = "#8B4513";
      }
    }

    // 解析时间
    const start = values.check_start_time === "-" ? "" : dayjs(values.check_start_time).format("HH:mm:ss");
    const end = values.check_end_time === "-" ? "" : dayjs(values.check_end_time).format("HH:mm:ss");
    let timeRange = "";
    if (start) {
      timeRange = `${start}~${end}`;
    }

    return `
        <div style="margin-top: -10px">
            <div style="text-align: right" >
              <Button  style="margin-left: -10px; border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick=''>
                <img src="../执行.png" width="14" height="14" alt="执行参数" title="执行参数">
              </Button>
              <Button  style="margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick=''>
                <img src="../taskUrl.png" width="14" height="14" alt="执行参数" title="执行参数">
              </Button>
            </div>
            <div style=" margin-top: -20px;font-size: 10px">
                <div><label style="color: ${Color}"> ${result}</label> &nbsp;${timeRange}</div>
            </div>

        </div>
    `;

  };

  // 自动化URL跳转
  (window as any).urlClick = (params: any) => {
    console.log(params);
    setAutoLogModal(true);
  };
  // 上线前数据库检查
  const beforeOnlineAutoCheck = (params: any, type: string) => {
    const values = params.value;
    if (!values) {
      return "";
    }

    let value = "";
    let Color = "black";
    let timeRange = "";

    values.forEach((ele: any) => {
      if (ele.check_time === type) {  // 如果是1 ，则代表是上线前检查,如果是2 ，则代表是上线后检查

        // 解析结果和颜色
        if (ele.check_status === "1") {
          value = "未开始";
        } else if (ele.check_status === "2") {
          value = "检查中";
          Color = "#46A0FC";
        } else if (ele.check_status === "3") {
          value = "已结束";
          Color = "#2BF541";
        }

        // 解析时间
        const start = ele.check_start_time === "" ? "" : dayjs(ele.check_start_time).format("HH:mm:ss");
        const end = ele.check_end_time === "" ? "" : dayjs(ele.check_end_time).format("HH:mm:ss");
        if (start) {
          timeRange = `${start}~${end}`;
        }

      }

    });

    return `
        <div style="margin-top: -10px">
            <div style="text-align: right" >
              <Button  style="margin-left: -10px; border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick=''>
                <img src="../执行.png" width="14" height="14" alt="执行" title="执行">
              </Button>
              <Button  style="margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick='urlClick("")'>
                <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志">
              </Button>
            </div>
            <div style=" margin-top: -20px;font-size: 10px;width: 200px">
                <div><label style="color: ${Color}"> ${value}</label> &nbsp;${timeRange}</div>
            </div>

        </div>
    `;

  };

  // 封板状态
  const sealStatusRenderer = (params: any) => {
    const values = params.value;
    const frontValue = (values["前端"])[0];
    const frontTime = (values["前端"])[1];
    const backendValue = (values["后端"])[0];
    const backendTime = (values["后端"])[1];
    // 前端的颜色
    let frontColor = "orange";
    if (frontValue === "已封版") {
      frontColor = "#2BF541";
    }

    // 后端的颜色
    let bacnkendColor = "orange";
    if (backendValue === "已封版") {
      bacnkendColor = "#2BF541";
    }

    if (params.data?.module === "仅前端") {

      return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>前端： <label style="color: ${frontColor}"> ${frontValue}</label> &nbsp;${frontTime}</div>
            </div>

        </div>
    `;

    }
    if (params.data?.module === "仅后端") {
      return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div> 后端：<label style="color: ${bacnkendColor}"> ${backendValue}</label>
                &nbsp;${backendTime}</div>
            </div>
        </div>
    `;
    }
    return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>前端： <label style="color: ${frontColor}"> ${frontValue}</label> &nbsp;${frontTime}</div>
                <div style="margin-top: -20px"> 后端：
                <label style="color: ${bacnkendColor}"> ${backendValue}</label>
                &nbsp;${backendTime}</div>
            </div>

        </div>
    `;
  };

  const firstOnlineBranchColumn: any = [
    {
      headerName: '序号',
      field: 'No',
      minWidth: 65,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '分支名称',
      field: 'branch_name',
      maxWidth: 115,
    },
    {
      headerName: '技术侧',
      field: 'technical_side',
      cellRenderer: (params: any) => {
        return `<span>${getTechSide(params.value)}</span>`
      }
    },
    {
      headerName: '单元测试运行是否通过',
      field: 'test_unit',
      cellRenderer: rendererUnitTest,
      minWidth: 190,
    },
    {
      headerName: '上线前版本检查是否通过',
      field: 'version_check',
      cellRenderer: beforeOnlineVersionCheck,
      minWidth: 190,
    },
    {
      headerName: '上线前环境检查是否通过',
      field: 'env_check',
      minWidth: 190,
      cellRenderer: beforeOnlineEnvCheck,
    },
    {
      headerName: '上线前自动化检查是否通过',
      field: 'automation_check',
      minWidth: 200,
      cellRenderer: (param: any) => {
        return beforeOnlineAutoCheck(param, "1")
      },
    },
    {
      headerName: '升级后自动化检查是否通过',
      field: 'automation_check',
      minWidth: 200,
      cellRenderer: (param: any) => {
        return beforeOnlineAutoCheck(param, "2")
      },
    },
    {
      headerName: '封板状态',
      field: 'branch_sealing_check',
      // cellRenderer: sealStatusRenderer
    },
    {
      headerName: '操作',
      cellRenderer: (params: any) => {
        return operateRenderer(4, params)
      }
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

  // 取消
  const onlineBranchCancle = () => {
    setOnlineBranchModal({
      shown: false,
      title: "新增"
    });
  };
  // 保存
  const saveOnlineBranchResult = () => {

  };

  // 清空表中数据
  const onlineBranchClear = () => {

    formForOnlineBranch.resetFields();
  };
  /* endregion */

  /*  region 对应工单 */

  const firstListColumn: any = [
    {
      headerName: '序号',
      field: 'No',
      minWidth: 65,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '工单类型',
      field: 'repair_order_type',
    },
    {
      headerName: '工单编号',
      field: 'repair_order_num',
    },
    {
      headerName: '审批名称',
      field: 'approval_name',
    },
    {
      headerName: '审批说明',
      field: 'approval_instructions',
    },
    {
      headerName: '申请人',
      field: 'applicant_name',
    },
    {
      headerName: '创建时间',
      field: 'apply_create_time',
    },
    {
      headerName: '更新时间',
      field: 'apply_update_time',
    },
    {
      headerName: '工单状态',
      field: 'repair_order_status',
    },
    {
      headerName: '上步已审批人',
      field: 'before_approval_name',
      minWidth: 120
    }, {
      headerName: '当前待审批人',
      field: 'current_approval_name',
      minWidth: 120
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

  /* region 发布结果 */
  const pulishResulttChanged = (params: any) => {
    console.log(params);

  };
  /* endregion */

  /* region  预发布项目 */
  const [formForPreReleaseProject] = Form.useForm();
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
      debugger;
      formForPreReleaseProject.setFieldsValue({

        editor: modifyTime.editor,
        editTime: modifyTime.editTime,

      });

    } else {
      message.error({
        content: result.errorMessage,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  };

  /* endregion */

  /* region 升级服务 */
  const releaseIDArray = useRequest(() => loadReleaseIDSelect()).data;

  const [formUpgradeService] = Form.useForm();

  const onReleaseIdChanges = (selectedId: any, params: any) => {
    if (params) {
      const queryCondition: any = [];
      params.forEach((ele: any) => {

        queryCondition.push({
          "deployment_id": ele.key,
          "automation_test": ele.automation_test,
          "service": (ele.service).split(",")
        });

      });

      releaseIdArray = queryCondition;

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


      // 有数据之后进行表格的赋值操作

      firstUpSerGridApi.current?.setRowData(result.data);

    }
  };

  /* endregion */

  /* region Tabs 标签页事件 */
  const [showTabs, setShowTabs] = useState({
    shown: false,
    targetKey: ""
  });

  const initialPanes = [
    {
      title: `${currentDate}灰度预发布1`,
      content: "",
      key: '1',
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
    firstUpSerGridApi.current?.setRowData([]);
    secondUpSerGridApi.current?.setRowData([]);
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

  const delTabsInfo = () => {
    const {targetKey} = showTabs;
    setShowTabs({
      ...showTabs,
      shown: false
    });
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
      // 需要判断是否确定删除

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
    formForPreReleaseProject.setFieldsValue({
      projectsName: "测试切换"
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

  // 修改tab
  const tabsChangeName = (params: any) => {

    const currentName = params.target.innerText;
    console.log(currentName);

  };
  /* endregion */

  const showPagesContent = (source: any) => {

    if (!source) {
      return;
    }

    // 预发布项目
    const preReleaseProject = source?.preProject;

    currentListNo = preReleaseProject.ready_release_num;
    formForPreReleaseProject.setFieldsValue({
      projectsName: preReleaseProject.projectId,
      pulishType: preReleaseProject.release_type,
      pulishMethod: preReleaseProject.release_way,
      pulishTime: dayjs(preReleaseProject.plan_release_time),
      editor: preReleaseProject.edit_user_name,
      editTime: preReleaseProject.edit_time,
      proid: preReleaseProject.pro_id
    });

    // 升级服务 一
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

  };

  useEffect(() => {
    showPagesContent(initData);

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
          {tabContent.panes.map(pane => (
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
              <Progress strokeColor={"#2BF541"} style={{width: 800}} percent={70}/>
            </Row>

          </div>

          {/* 检查总览 */}
          <div style={{marginTop: 10, marginLeft: 5}}>

            <label style={{fontWeight: "bold"}}>检查总览：</label>
            <label>
              <button style={{height: 13, width: 13, border: "none", backgroundColor: "#2BF541"}}></button>
              &nbsp;预发布项目已填写完成
            </label>

            <label style={{marginLeft: 10}}>
              <button style={{height: 13, width: 13, border: "none", backgroundColor: "#2BF541"}}></button>
              &nbsp;升级服务已确认完成
            </label>

            <label style={{marginLeft: 10}}>
              <button style={{height: 13, width: 13, border: "none", backgroundColor: "#2BF541"}}></button>
              &nbsp;数据Review确认完成
            </label>

            <label style={{marginLeft: 10}}>
              <button style={{height: 13, width: 13, border: "none", backgroundColor: "Gainsboro"}}></button>
              &nbsp;上线前检查已完成
            </label>

            <label style={{marginLeft: 10}}>
              <label style={{fontWeight: "bold"}}>发布结果：</label>
              <Select size={"small"} style={{width: 100}} onChange={pulishResulttChanged}>
                <Option value="">空</Option>
                <Option value="lucy">Lucy</Option>
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
                <Button type="primary"
                        style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5, marginLeft: 10}}
                        onClick={savePreRelaseProjects}>点击保存 </Button>
              </div>

              <div>
                <Form form={formForPreReleaseProject}>
                  <Row>
                    <Col span={8}>

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
                          {releaseTypeArray}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={5}>

                      {/* 发布方式 */}
                      <Form.Item label="发布方式:" name="pulishMethod" style={{marginLeft: 5}}>
                        <Select>
                          {releaseWayArray}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      {/* 发布时间 */}
                      <Form.Item label="发布时间:" name="pulishTime" style={{marginLeft: 5}}>
                        <DatePicker showTime style={{width: "100%"}}/>
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
                      <Form.Item label="一键部署ID:" name="deployID" style={{marginLeft: 10}}>
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
                <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>
                  <AgGridReact

                    columnDefs={firstUpSerColumn} // 定义列
                    // rowData={[]} // 数据绑定
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      suppressMenu: true,
                      minWidth: 90,
                      cellStyle: {"line-height": "25px"},
                    }}
                    getRowStyle={ChangRowColor}
                    headerHeight={25}
                    rowHeight={25}
                    onGridReady={onFirstGridReady}
                    onGridSizeChanged={onChangeFirstGridReady}
                    onColumnEverythingChanged={onChangeFirstGridReady}
                  >
                  </AgGridReact>
                </div>

                {/* 表格二 */}
                <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>

                  <AgGridReact
                    columnDefs={secondUpSerColumn} // 定义列
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
                    getRowStyle={ChangRowColor}
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

                <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>

                  <AgGridReact
                    columnDefs={thirdUpSerColumn} // 定义列
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
                    onCellEditingStopped={saveUperConfirmInfo}
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
                <div className="ag-theme-alpine" style={{height: 300, width: '100%'}}>
                  <AgGridReact

                    columnDefs={firstDataReviewColumn} // 定义列
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
                    getRowStyle={ChangRowColor}
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
                    onCellEditingStopped={saveDataRepaireConfirmInfo}
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
                <div className="ag-theme-alpine" style={{height: 200, width: '100%'}}>
                  <AgGridReact

                    columnDefs={firstOnlineBranchColumn} // 定义列
                    // rowData={[]} // 数据绑定
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      suppressMenu: true,
                      autoHeight: true,
                      minWidth: 90
                    }}
                    headerHeight={25}
                    getRowStyle={ChangRowColor}
                    onGridReady={onfirstOnlineBranchGridReady}
                    onGridSizeChanged={onChangefirstOnlineBranchGridReady}
                    onColumnEverythingChanged={onChangefirstOnlineBranchGridReady}
                  >
                  </AgGridReact>
                </div>
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
                  <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>
                    <AgGridReact

                      columnDefs={firstListColumn} // 定义列
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
        width={600}
      >
        <Form form={pulishItemForm}>
          <Row>
            <Col span={12}>
              <Form.Item name="onlineEnv" label="上线环境:" style={{marginTop: -15}}>
                <Select showSearch>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pulishItem" label="发布项：" style={{marginTop: -15, marginLeft: 10}}>
                <Select showSearch style={{marginLeft: 27, width: 183}}>
                </Select>
              </Form.Item>
            </Col>

          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="application" label="应用：" style={{marginTop: -15}}>
                <Select showSearch style={{marginLeft: 28, width: 206}}>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="branchAndEnv" label="分支和环境：" style={{marginTop: -15, marginLeft: 10}}>
                <Input autoComplete="off"/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="interAndDbUpgrade" label="是否涉及接口与数据库升级：" style={{marginTop: -15}}>
            <Select showSearch style={{}}>
            </Select>
          </Form.Item>

          <Form.Item name="hotUpdate" label="是否支持热更新：" style={{marginTop: -15}}>
            <Select showSearch style={{}}>
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

        </Form>
      </Modal>

      {/* 接口服务 */}
      <Modal
        title={upgradeIntModal.title}
        visible={upgradeIntModal.shown}
        onCancel={upgradeIntModalCancle}
        centered={true}
        footer={null}
        width={600}

      >
        <Form form={upgradeIntForm}>

          <Row>
            <Col span={12}>
              <Form.Item name="onlineEnv" label="上线环境:" style={{marginTop: -15}}>
                <Select showSearch style={{marginLeft: 20, width: 185}}>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="upInterface" label="升级接口：" style={{marginLeft: 10, marginTop: -15}}>
                <Select showSearch style={{}}>
                </Select>
              </Form.Item>
            </Col>

          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="interService" label="接口服务：" style={{marginTop: -15}}>
                <Select showSearch style={{marginLeft: 21, width: 185}}>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="renter" label="涉及租户：" style={{marginLeft: 10, marginTop: -15}}>
                <Input/>
              </Form.Item>
            </Col>

          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="method" label="接口Method：" style={{marginTop: -15}}>
                <Select showSearch style={{}}>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="URL" label="接口URL：" style={{marginLeft: 10, marginTop: -15}}>
                <Input/>
              </Form.Item>
            </Col>

          </Row>

          <Form.Item name="hotUpdate" label="是否支持热更新：" style={{marginTop: -15}}>
            <Select showSearch style={{}}>
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

        </Form>
      </Modal>

      {/* 数据修复review */}
      <Modal
        title={dataReviewtModal.title}
        visible={dataReviewtModal.shown}
        onCancel={dataReviewModalCancle}
        centered={true}
        footer={null}
        width={600}
      >
        <Form form={dataReviewForm}>

          <Form.Item name="repaireContent" label="数据修复内容:" style={{marginTop: -15}}>
            <TextArea/>
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item name="relatedRenter" label="涉及租户：" style={{marginTop: -15}}>
                <Input style={{marginLeft: 14, width: 191}}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="types" label="类型：" style={{marginLeft: 10, marginTop: -15}}>
                <Select showSearch style={{}}>
                </Select>
              </Form.Item>
            </Col>

          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="repaireCommiter" label="修复提交人：" style={{marginTop: -15}}>
                <Select showSearch style={{}}>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="branch" label="分支：" style={{marginLeft: 10, marginTop: -15}}>
                <Input/>
              </Form.Item>
            </Col>

          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="EvalResult" label="评审结果：" style={{marginTop: -15}}>
                <Select showSearch style={{width: 191, marginLeft: 14}}>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="repeatExecute" label="是否可重复执行：" style={{marginLeft: 10, marginTop: -15}}>
                <Select showSearch style={{}}>
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

        </Form>
      </Modal>

      {/* 自动化日志的弹窗确认 */}
      <Modal
        title={'自动化日志窗'}
        visible={autoLogModal}
        onCancel={autoCancle}
        centered={true}
        footer={null}
        width={400}
        bodyStyle={{height: 145}}
      >
        <Form>
          <Form.Item name="UiLog" label="UI日志:" style={{marginTop: -15}}>
            <a href={"https://shimo.im/docs/66u6eGAMj6UVljrn"}
               target={"_black"}>https://shimo.im/docs/66u6eGAMj6UVljrn</a>
          </Form.Item>

          <Form.Item name="interfaceLog" label="接口日志:" style={{marginTop: -15}}>
            <a href={"https://shimo.im/docs/66u6eGAMj6UVljrn"}
               target={"_black"}>https://shimo.im/docs/66u6eGAMj6UVljrn</a>
          </Form.Item>

          <Form.Item>
            <Button
              style={{float: "right"}} onClick={autoCancle}>关闭
            </Button>
          </Form.Item>


        </Form>
      </Modal>


      {/* 上线分支设置 */}
      <Modal
        title={`上线分支设置-${onlineBranchModal.title}`}
        visible={onlineBranchModal.shown}
        onCancel={onlineBranchCancle}
        centered={true}
        footer={null}
        width={600}
        bodyStyle={{height: 810}}
      >
        <Form form={formForOnlineBranch}>

          {/* 总设置 */}
          <div>
            <Row>
              <Col span={12}>

                {/* 分支名称 */}
                <Form.Item label="分支名称:" name="branchName" required={true}>
                  <Select style={{width: '100%'}} showSearch>
                  </Select>
                </Form.Item>
                {/* 忽略前端单元测试检查 */}
                <Form.Item name="ignoreFrontCheck" style={{marginLeft: 0, marginTop: -20}}>
                  <Checkbox>忽略前端单元测试检查</Checkbox>
                </Form.Item>
              </Col>
              <Col span={12}>

                {/* 技术侧 */}
                <Form.Item label="技术侧:" name="module" style={{marginLeft: 10}} required={true}>
                  <Select style={{width: '100%'}} showSearch>
                  </Select>
                </Form.Item>
                {/* 忽略后端单元测试检查 */}
                <Form.Item name="ignoreBackendCheck" style={{marginLeft: 0, marginTop: -20}}>
                  <Checkbox>忽略后端单元测试检查</Checkbox>
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

                  </Select>
                </Form.Item>
                <Form.Item name="imageevn" label="镜像环境" style={{marginTop: -20}}>
                  <Select placeholder="请选择对应的环境！" style={{marginLeft: 40, width: 415}} showSearch>
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
                    <Checkbox>忽略检查</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>

                  {/* 检查环境 */}
                  <Form.Item label="检查环境:" name="checkEnv" style={{marginTop: -10}}>
                    <Select style={{width: '100%'}} showSearch>
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
                  <Checkbox>忽略检查</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{marginTop: -10}}>
              <Col span={8}>
                {/* 检查类型 */}
                <Form.Item label="检查类型:" name="beforeCheckType" style={{marginTop: -10}}>
                  <Select mode="multiple" style={{width: '100%'}} showSearch>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                {/* 测试环境 */}
                <Form.Item label="测试环境:" name="beforeTestEnv" style={{marginTop: -10, marginLeft: 10}}>
                  <Select style={{width: '100%'}} showSearch>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                {/* 浏览器 */}
                <Form.Item label="浏览器:" name="beforeBrowser" style={{marginTop: -10, marginLeft: 10}}>
                  <Select style={{width: '100%'}} showSearch>
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
                  <Checkbox>忽略检查</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{marginTop: -10}}>
              <Col span={8}>
                {/* 检查类型 */}
                <Form.Item label="检查类型:" name="afterCheckType" style={{marginTop: -10}}>
                  <Select mode="multiple" style={{width: '100%'}} showSearch>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                {/* 测试环境 */}
                <Form.Item label="测试环境:" name="afterTestEnv" style={{marginTop: -10, marginLeft: 10}}>
                  <Select style={{width: '100%'}} showSearch>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                {/* 浏览器 */}
                <Form.Item label="浏览器:" name="afterBrowser" style={{marginTop: -10, marginLeft: 10}}>
                  <Select style={{width: '100%'}} showSearch>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Form.Item>
            <Button
              style={{borderRadius: 5, marginLeft: 20, float: "right"}} onClick={onlineBranchClear}>清空
            </Button>
            <Button type="primary"
                    style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5, float: "right"}}
                    onClick={saveOnlineBranchResult}>保存 </Button>

          </Form.Item>

        </Form>
      </Modal>
    </PageContainer>
  );
};


export default PreRelease;
