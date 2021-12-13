import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './style.css';
import {Button, Form, Input, message, Modal, Select, Tabs, Row, Col, DatePicker} from 'antd';
import dayjs from "dayjs";
import {AgGridReact} from "ag-grid-react";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {getAllProject} from "@/publicMethods/verifyAxios";
import {useRequest} from "ahooks";
import {savePreProjects, inquireService} from "./logic";

const {TabPane} = Tabs;
const {Option} = Select;

const currentDate = dayjs().format("YYYYMMDD");

const loadPrjNameSelect = async () => {
  const prjNames = await getAllProject();
  const prjData: any = [];

  if (prjNames.message !== "") {
    message.error({
      content: prjNames.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (prjNames.data) {
    const datas = prjNames.data;
    datas.forEach((project: any) => {
      prjData.push(
        <Option key={project.project_id} value={`${project.project_id}`}>{project.project_name}</Option>);
    });
  }

  return prjData;

};


const PreRelease: React.FC<any> = () => {

  // 新增和修改的共同modal显示
  const [pulishItemModal, setpulishItemModal] = useState({
    shown: false,
    title: "新增",
    type: -1
  });

  const pulishItemModalCancle = () => {
    setpulishItemModal({
      shown: false,
      title: "新增",
      type: -1
    });
  };

  /* region 新增行 */

  // 新增行
  (window as any).addRows = (params: any) => {
    //  显示数据
    console.log(params);
    setpulishItemModal({
      shown: true,
      title: "新增",
      type: -1
    });

  };

  /* endregion  */

  /* region 修改行 */

  // 修改行
  (window as any).modifyRows = (params: any) => {
    //  显示数据
    console.log(params);
    setpulishItemModal({
      shown: true,
      title: "修改",
      type: -1
    });
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
    const values = params.value;
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
      field: 'onlineDev'
    },
    {
      headerName: '发布项',
      field: 'pulishItem',
      minWidth: 75
    },
    {
      headerName: '应用',
      field: 'application',
      minWidth: 65
    },
    {
      headerName: '是否支持热更新',
      field: 'hotUpdate',
    },
    {
      headerName: '是否涉及接口与数据库升级',
      field: 'upGrade',
    },
    {
      headerName: '分支和环境',
      field: 'branchAndDev',
    },
    {
      headerName: '编辑人',
      field: 'editor',
      minWidth: 75
    },
    {
      headerName: '编辑时间',
      field: 'editeTime',
    },
    {
      headerName: '说明',
      field: 'desc',
    },
    {
      headerName: '备注',
      field: 'remark',
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

  /* endregion  */

  /* region 升级服务 二  */
  const secondUpSerColumn: any = [
    {
      headerName: '上线环境',
      field: 'onlineDev',
    },
    {
      headerName: '升级接口',
      field: 'upgradeInte',
    },
    {
      headerName: '接口服务',
      field: 'intService',
    },
    {
      headerName: '是否支持热更新',
      field: 'hotUpdate',
    },
    {
      headerName: '接口Method',
      field: 'intMethod',
    },
    {
      headerName: '接口URL',
      field: 'intURL',
    },
    {
      headerName: '编辑人',
      field: 'editor',
      minWidth: 75
    },
    {
      headerName: '编辑时间',
      field: 'editeTime',
    },
    {
      headerName: '涉及租户',
      field: 'relateRenter',
    },
    {
      headerName: '备注',
      field: 'remark',
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

  /* endregion   */

  /* region 升级服务 三  */

  const thirdUpSerColumn = [
    {
      headerName: '前端值班',
      field: 'frontDuty',
      minWidth: 90,
    },
    {
      headerName: '服务确认完成',
      field: 'frontConfirm',
      minWidth: 110,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: selectColorRenderer
    },
    {
      headerName: '确认时间',
      field: 'frontConfirmTime',
    },
    {
      headerName: '后端值班',
      field: 'backendDuty',
    },
    {
      headerName: '服务确认完成',
      field: 'backendConfirm',
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: selectColorRenderer
    },
    {
      headerName: '确认时间',
      field: 'backendConfirmTime',
    },
    {
      headerName: '流程确认',
      field: 'flowConfirm',
    },
    {
      headerName: '服务确认完成',
      field: 'flowConfirmOk',
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: selectColorRenderer
    },
    {
      headerName: '确认时间',
      field: 'flowConfirmTime',
    },
    {
      headerName: '测试值班',
      field: 'testDuty',
    },
    {
      headerName: '服务确认完成',
      field: 'testConfirm',
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: selectColorRenderer
    },
    {
      headerName: '确认时间',
      field: 'testConfirmTime',
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
      headerName: '把数据修复内容',
      field: 'repaireContent',
    },
    {
      headerName: '涉及租户',
      field: 'relateRenter',
    },
    {
      headerName: '类型',
      field: 'type',
      minWidth: 65
    },
    {
      headerName: '修复提交人',
      field: 'repaireCommiter',
    },
    {
      headerName: '分支',
      field: 'branch',
    },
    {
      headerName: '编辑人',
      field: 'editor',
      minWidth: 75
    },
    {
      headerName: '编辑时间',
      field: 'editeTime',
    },
    {
      headerName: '评审结果',
      field: 'reviewResult',
    },
    {
      headerName: '是否可重复执行',
      field: 'repeatExcute',
    },
    {
      headerName: '操作',
      cellRenderer: (params: any) => {
        return operateRenderer(3, params)
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

  /* endregion */

  /*  region 数据修复 Review 二 */

  const secondDataReviewColumn = [
    {
      headerName: '后端值班',
      field: 'backendDuty',
    },
    {
      headerName: '服务确认完成',
      field: 'backendComfirm',
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: selectColorRenderer
    },
    {
      headerName: '确认时间',
      field: 'backendComfirmTime',
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
    const frontValue = (values["前端"])[0];
    const frontTime = (values["前端"])[1];
    const backendValue = (values["后端"])[0];
    const backendTime = (values["后端"])[1];
    // 前端的颜色
    let frontColor = "#8B4513";
    if (frontValue === "是") {
      frontColor = "#2BF541";
    } else if (frontValue === "忽略") {
      frontColor = "blue";
    }

    // 后端的颜色
    let bacnkendColor = "#8B4513";
    if (backendValue === "是") {
      bacnkendColor = "#2BF541";
    } else if (backendValue === "忽略") {
      bacnkendColor = "blue";
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


    const values = params.value;
    const frontValue = (values["前端"])[0];
    const frontTime = (values["前端"])[1];
    const backendValue = (values["后端"])[0];
    const backendTime = (values["后端"])[1];
    // 前端的颜色
    let frontColor = "#8B4513";
    if (frontValue === "是") {
      frontColor = "#2BF541";
    } else if (frontValue === "检查中") {
      frontColor = "#46A0FC";
    }

    // 后端的颜色
    let bacnkendColor = "#8B4513";
    if (backendValue === "是") {
      bacnkendColor = "#2BF541";
    } else if (backendValue === "检查中") {
      bacnkendColor = "#46A0FC";
    }

    if (params.data?.module === "仅前端") {

      return `
        ${commonDiv}
        <div style="margin-top: -20px">
            <div style="font-size: 10px">
                <div>前端： <button style="color: ${frontColor};width: 40px;border: none;background-color: transparent"> ${frontValue}</button> &nbsp;${frontTime}</div>
            </div>

        </div>
    `;

    }
    if (params.data?.module === "仅后端") {
      return `
        ${commonDiv}
        <div style="margin-top: -20px">
            <div style="font-size: 10px">
                <div> 后端：<button style="color: ${bacnkendColor};width: 40px;border: none;background-color: transparent"> ${backendValue}</button>
                &nbsp;${backendTime}</div>
            </div>
        </div>
    `;
    }
    return `
          ${commonDiv}
        <div style="margin-top: -20px">
            <div style="font-size: 10px">
                <div>前端： <button style="color: ${frontColor};width: 40px;border: none;background-color: transparent"> ${frontValue}</button> &nbsp;${frontTime}</div>
                <div style="margin-top: -20px"> 后端：
                <button style=" color: ${bacnkendColor};width: 40px;border: none;background-color: transparent"> ${backendValue}</button>
                &nbsp;${backendTime}</div>
            </div>

        </div>
    `;

  };

  // 上线前环境检查
  const beforeOnlineEnvCheck = (params: any) => {

    const value = (params.value)[0];
    const time = (params.value)[1];

    // 前端的颜色
    let Color = "#8B4513";
    if (value === "是") {
      Color = "#2BF541";
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
                <div><label style="color: ${Color}"> ${value}</label> &nbsp;${time}</div>
            </div>

        </div>
    `;

  };

  // 上线前数据库检查
  const beforeOnlineAutoCheck = (params: any) => {

    const value = (params.value)[0];
    const time = (params.value)[1];

    // 前端的颜色
    let Color = "black";
    if (value === "检查中") {
      Color = "#46A0FC";
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
            <div style=" margin-top: -20px;font-size: 10px;width: 200px">
                <div><label style="color: ${Color}"> ${value}</label> &nbsp;${time}</div>
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
      field: 'branchName',
      maxWidth: 115,
    },
    {
      headerName: '技术侧',
      field: 'module',
      maxWidth: 100,
    },
    {
      headerName: '单元测试运行是否通过',
      field: 'passUnitTest',
      cellRenderer: rendererUnitTest,
      minWidth: 190,
    },
    {
      headerName: '上线前版本检查是否通过',
      field: 'passVersionCheck',
      cellRenderer: beforeOnlineVersionCheck,
      minWidth: 190,
    },
    {
      headerName: '上线前环境检查是否通过',
      field: 'passEnvCheck',
      cellRenderer: beforeOnlineEnvCheck,
    },
    {
      headerName: '上线前自动化检查是否通过',
      field: 'passAutoCheckbf',
      cellRenderer: beforeOnlineAutoCheck,
    },
    {
      headerName: '升级后自动化检查是否通过',
      field: 'passAutoCheckaf',
      cellRenderer: beforeOnlineAutoCheck,
    },
    {
      headerName: '封板状态',
      field: 'sealStatus',
      cellRenderer: sealStatusRenderer
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
      field: 'listType',
    },
    {
      headerName: '工单编号',
      field: 'listNo',
    },
    {
      headerName: '审批名称',
      field: 'approveName',
    },
    {
      headerName: '审批说明',
      field: 'approveDesc',
    },
    {
      headerName: '申请人',
      field: 'applier',
    },
    {
      headerName: '创建时间',
      field: 'createTime',
    },
    {
      headerName: '更新时间',
      field: 'updateTime',
    },
    {
      headerName: '工单状态',
      field: 'listStatus',
    },
    {
      headerName: '上步已审批人',
      field: 'lastApprover',
    }, {
      headerName: '当前待审批人',
      field: 'currentApprover',
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
  const [formForDutyNameModify] = Form.useForm();
  const projectsArray = useRequest(() => loadPrjNameSelect()).data;
  // 保存预发布项目
  const savePreRelaseProjects = async () => {

    const datas = formForDutyNameModify.getFieldsValue();
    const result = await savePreProjects(datas);
    if (result === "") {
      message.info({
        content: result,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

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

  /* region 查询 */
  const [formUpgradeService] = Form.useForm();
  const inquireServiceClick = async () => {
    const data = formUpgradeService.getFieldsValue();
    const result = await inquireService(data);
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
    }
  };
  /* endregion */

  /* region Tabs 标签页事件 */

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
  const remove = (targetKey: any) => {
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
    formForDutyNameModify.setFieldsValue({
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

  /* endregion */

  const showProject = () => {

    // 升级服务 一
    firstUpSerGridApi.current?.setRowData([{
      onlineDev: "集群1",
      pulishItem: "前端",
      application: "web",
      hotUpdate: "是",
      upGrade: "否",
      branchAndDev: "emergency_nx-hotfix",
      editor: "吴晓风",
      editeTime: "2021-12-09 13:10:10",
      desc: "测试数据",
      remark: "测试数据"
    }]);
    // 升级服务 二
    secondUpSerGridApi.current?.setRowData([{
      onlineDev: "集群1",
      upgradeInte: "前端接口",
      intService: "basebi",
      hotUpdate: "是",
      intMethod: "get",
      intURL: "/basebi/Evaluate/......",
      editor: "吴晓风",
      editeTime: "2021-12-09 12:12:12",
      relateRenter: "全量用户",
      remark: "测试数据"
    }]);
    // 升级服务 三
    thirdUpSerGridApi.current?.setRowData([{
      frontDuty: "欧兴杨",
      frontConfirm: "是",
      frontConfirmTime: "2021-12-08 10:10:10",
      backendDuty: "刘云鹏",
      backendConfirm: "是",
      backendConfirmTime: "2021-12-08 10:10:17",
      flowConfirm: "杨期成",
      flowConfirmOk: "否",
      flowConfirmTime: "",
      testDuty: "徐超",
      testConfirm: "否",
      testConfirmTime: ""
    }]);
    // 数据修复Review 一
    firstDataReviewGridApi.current?.setRowData([{
      repaireContent: "测试数据一条",
      relateRenter: "all",
      type: "after",
      repaireCommiter: "任毅",
      branch: "hotfix",
      editor: "欧治成",
      editeTime: "2021-12-09 12:12:12",
      reviewResult: "通过",
      repeatExcute: "是",
    }]);
    // 数据修复Review 二
    secondDataReviewGridApi.current?.setRowData([{
      backendDuty: "刘云鹏",
      backendComfirm: "是",
      backendComfirmTime: "2021-12-09 14:12:12",
    }]);
    // 上线分支
    firstOnlineBranchGridApi.current?.setRowData([{
      branchName: "release",
      module: "前后端",
      passUnitTest: {"前端": ["是", "2021-01-01 12:11:22"], "后端": ["否", "2021-01-01 12:11:22"]},
      passVersionCheck: {"前端": ["是", "2021-01-01 12:11:22"], "后端": ["否", "2021-01-01 12:11:22"]},
      passEnvCheck: ["否", "2021-01-01 12:11:22"],
      passAutoCheckbf: ["未开始", ""],
      passAutoCheckaf: ["未开始", ""],
      sealStatus: {"前端": ["已封版", "2021-01-01 12:11:22"], "后端": ["未封版", ""]},
    }, {
      branchName: "release-report",
      module: "仅后端",
      passUnitTest: {"前端": ["是", "2021-01-01 12:11:22"], "后端": ["忽略", ""]},
      passVersionCheck: {"前端": ["是", "2021-01-01 12:11:22"], "后端": ["检查中", "2021-01-01 12:11:22"]},
      passEnvCheck: ["是", "2021-01-01 12:11:22"],
      passAutoCheckbf: ["检查中", "12:12:12~18:19:33"],
      passAutoCheckaf: ["未开始", ""],
      sealStatus: {"前端": ["未封版", ""], "后端": ["已封版", "2021-01-01 12:11:22"]},
    }]);
    // 对应工单
    firstListGridApi.current?.setRowData([{
      listType: "蓝绿发布",
      listNo: "3124",
      approveName: "emergency20211126发布",
      approveDesc: "emergency20211126发布",
      applier: "徐超",
      createTime: "2021-11-25 07:50:11",
      updateTime: "2021-11-25 07:50:11",
      listStatus: "验证通过后审批",
      lastApprover: "黄义森",
      currentApprover: "徐超"
    }]);

    // 先显示第一个界面的数据
    formForDutyNameModify.setFieldsValue({
      // projectsName: ""
    });
  };

  useEffect(() => {
    showProject();

  }, [projectsArray]);

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

        {/* 检查总览 */}
        <div style={{marginLeft: 5}}>

          <label style={{fontWeight: "bold"}}>检查总览：</label>
          <label>
            <button style={{height: 13, width: 13, border: "none", backgroundColor: "#2BF541"}}></button>
            &nbsp;预发布项目已填写完成
          </label>

          <label style={{marginLeft: 15}}>
            <button style={{height: 13, width: 13, border: "none", backgroundColor: "#2BF541"}}></button>
            &nbsp;升级服务已确认完成
          </label>

          <label style={{marginLeft: 15}}>
            <button style={{height: 13, width: 13, border: "none", backgroundColor: "#2BF541"}}></button>
            &nbsp;数据Review确认完成
          </label>

          <label style={{marginLeft: 15}}>
            <button style={{height: 13, width: 13, border: "none", backgroundColor: "Gainsboro"}}></button>
            &nbsp;上线前检查已完成
          </label>

          <label style={{marginLeft: 15}}>
            <label style={{fontWeight: "bold"}}>发布状态总览：</label>
            未完成
          </label>

          <label style={{marginLeft: 15}}>
            <label style={{fontWeight: "bold"}}>发布结果：</label>
            <Select size={"small"} style={{width: 100}} onChange={pulishResulttChanged}>
              <Option value="">空</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
          </label>

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
                <Form form={formForDutyNameModify}>
                  <Row>
                    <Col span={9}>

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

                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={5}>

                      {/* 发布方式 */}
                      <Form.Item label="发布方式:" name="pulishMethod" style={{marginLeft: 5}}>
                        <Select>

                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={5}>
                      {/* 发布时间 */}
                      <Form.Item label="发布时间:" name="pulishTime" style={{marginLeft: 5}}>
                        <DatePicker style={{width: "100%"}}/>
                      </Form.Item>
                    </Col>

                  </Row>

                </Form>
              </div>
            </div>

            {/* 编辑人信息 */}
            <div style={{marginTop: 5}}>
              <label> 编辑人：罗天刚</label>
              <label style={{marginLeft: 20}}> 编辑时间：2021-12-08 16：10：40</label>
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
                    <Col span={9}>

                      {/* 测试环境 */}
                      <Form.Item label="测试环境:" name="testEnv">
                        <Select showSearch mode="multiple" size={"small"} style={{width: '100%'}}>

                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>

                      {/* 一键部署ID */}
                      <Form.Item label="一键部署ID:" name="deployID" style={{marginLeft: 10}}>
                        <Select mode="multiple" size={"small"} style={{width: '100%'}} showSearch>

                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={7}>

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
                <div className="ag-theme-alpine" style={{height: 100, width: '100%'}}>
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
                1、版本检查、环境一致性检查、自动化检查，默认开启自动检查，每个小时检查1次，可关闭自动检查，在需要的时间节点，点击手动触发按钮，进行按需检查；
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


      {/* 删除确认 */}
      <Modal
        title={'删除'}
        visible={delModal.shown}
        onCancel={delCancel}
        centered={true}
        footer={null}
        width={400}
      >
        <Form>
          <Form.Item>
            <label style={{marginLeft: '90px'}}>确定删除该数据吗？</label>
          </Form.Item>

          <Form.Item>
            <Button type="primary" style={{marginLeft: '100px'}} onClick={delDetailsInfo}>
              确定
            </Button>
            <Button type="primary" style={{marginLeft: '20px'}} onClick={delCancel}>
              取消
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
        width={400}
      >
        <Form>
          <Form.Item name="onlineEnv" label="上线环境">
            <Select showSearch style={{}}>
            </Select>
          </Form.Item>
          <Form.Item name="onlineEnv" label="上线环境">
            <Select showSearch style={{}}>
            </Select>
          </Form.Item>
          <Form.Item name="onlineEnv" label="上线环境">
            <Select showSearch style={{}}>
            </Select>
          </Form.Item>
          <Form.Item name="onlineEnv" label="上线环境">
            <Select showSearch style={{}}>
            </Select>
          </Form.Item>
          <Form.Item name="onlineEnv" label="上线环境">
            <Select showSearch style={{}}>
            </Select>
          </Form.Item>
          <Form.Item name="onlineEnv" label="上线环境">
            <Select showSearch style={{}}>
            </Select>
          </Form.Item>
          <Form.Item name="onlineEnv" label="上线环境">
            <Select showSearch style={{}}>
            </Select>
          </Form.Item>
          <Form.Item name="onlineEnv" label="上线环境">
            <Select showSearch style={{}}>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" style={{marginLeft: '100px'}} onClick={delDetailsInfo}>
              确定
            </Button>
            <Button type="primary" style={{marginLeft: '20px'}} onClick={delCancel}>
              取消
            </Button>
          </Form.Item>

        </Form>
      </Modal>

    </PageContainer>
  );
};

export default PreRelease;
