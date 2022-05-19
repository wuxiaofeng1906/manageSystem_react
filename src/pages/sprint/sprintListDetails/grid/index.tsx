import {
  linkToZentaoPage,
  numberRenderToCurrentStage,
  numberRenderToCurrentStageForColor,
  numberRenderTopass,
  numberRenderToSource,
  numberRenderToYesNo,
  numberRenderToZentaoStatusForRed,
  numberRenderToZentaoTypeFilter,
  numRenderForSevAndpriForLine,
  numRenderToTypeForLineAndFromBug,
  proposedTestRender,
  relatedNumberAndIdRender,
  relatedNumberRender,
  stageForLineThrough,
  testerRender,
  timeForLineThrough,
  timestampChanges,
  isOrNotValueGetter
} from "@/publicMethods/cellRenderer";


import {textDecorateRender, stageValueGetter, stageRenderer} from "./columnRenderer";

import {history} from "@@/core/history";
// 定义列名
const getColums = (prjNames: any) => {

  // 获取缓存的字段
  const fields = localStorage.getItem("sp_details_filed");
  const oraFields: any = [
    {
      headerName: '选择',
      pinned: 'left',
      filter: false,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 35,
    },
    {
      headerName: '序号',
      maxWidth: 80,
      filter: false,
      pinned: 'left',
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '阶段',
      field: 'stage',
      pinned: 'left',
      valueGetter: stageValueGetter,
      cellRenderer: stageRenderer,
      minWidth: 120,
    },
    {
      headerName: '测试',
      field: 'tester',
      pinned: 'left',
      minWidth: 80,
      suppressMenu: false,
      valueGetter: (params: any) => {
        const testArray = params.data?.tester;
        if (testArray && testArray.length > 0) {
          let testers = "";
          testArray.forEach((tester: any) => {
            testers = testers === "" ? tester.name : `${testers},${tester.name}`;
          });

          return testers
        }
        return "NA";
      },
      cellRenderer: (params: any) => {
        const testArray = params.value;
        let myColor = "gray"; // 测试验证：已验证为黑色，没验证为灰色
        const testConfirm = params.data?.testConfirmed;
        if (testConfirm === "1") {
          myColor = "black";
        }
        // if (!testArray || testArray.length === 0) {
        //   return `<span style="color: ${myColor}"> NA </span>`;
        // }
        // let testers = "";
        // testArray.forEach((tester: any) => {
        //   testers = testers === "" ? tester.name : `${testers},${tester.name}`;
        // });
        if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
          return `<span style="color: ${myColor};text-decoration:line-through"> ${testArray} </span>`;
        }
        return `<span style="color: ${myColor}"> ${testArray} </span>`;

      },
    },
    {
      headerName: '测试确认',
      field: 'testConfirmed',
      pinned: 'left',
      minWidth: 105,
      suppressMenu: false,
      valueGetter: (params: any) => {
        const testConfirme = params.data?.testConfirmed;
        if (testConfirme === "0" || testConfirme === null || testConfirme === undefined) {
          return "否";
        }
        return "是";
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '类型',
      field: 'category',
      cellRenderer: numRenderToTypeForLineAndFromBug,
      pinned: 'left',
      minWidth: 95,
      suppressMenu: false,
      filterParams: {cellRenderer: numberRenderToZentaoTypeFilter}
    },
    {
      headerName: '编号',
      field: 'ztNo',
      cellRenderer: linkToZentaoPage,
      pinned: 'left',
      minWidth: 90,
    },
    {
      headerName: '标题内容',
      field: 'title',
      pinned: 'left',
      minWidth: 235,
      cellRenderer: stageForLineThrough,
      tooltipField: "title"
    },
    {
      headerName: '所属计划',
      field: 'planName',
      minWidth: 100,
      suppressMenu: false,
    },
    {
      headerName: '严重等级',
      field: 'severity',
      suppressMenu: false,
      valueGetter: (params: any) => {
        let severity = "";
        if (params.data?.severity !== null && params.data?.severity !== undefined) {
          switch (params.value.toString()) {
            case "1":
              severity = "P0-";
              break;
            case "2":
              severity = "P1-";
              break;
            case "3":
              severity = "P2-";
              break;
            case "4":
              severity = "P3-";
              break;
            default:
              break;
          }
        }

        const pri = params.data.priority === null ? "" : params.data.priority;
        if (pri === "" && severity === "") {
          return "";
        }
        return `${severity}${pri}级`;
      },
      cellRenderer: textDecorateRender,
      minWidth: 90,
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
      tooltipField: "moduleName",
      suppressMenu: false,
    },
    {
      headerName: '状态',
      field: 'ztStatus',
      suppressMenu: false,
      cellRenderer: numberRenderToZentaoStatusForRed,
      minWidth: 80,

    },
    {
      headerName: '指派给',
      field: 'assignedTo',
      minWidth: 80,
      suppressMenu: false,
      valueGetter: (params: any) => {
        const assignedInfo = params.data?.assignedTo;
        if (assignedInfo) {
          return params.data?.assignedTo.name
        }
        return "";
      },
      cellRenderer: (params: any) => {
        const assignedPerson = params.value;
        if (!assignedPerson) {
          return "";
        }
        if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
          return `<span style="text-decoration:line-through"> ${assignedPerson} </span>`;
        }
        return assignedPerson;
      }
    },
    {
      headerName: '解决/完成人',
      field: 'finishedBy',
      minWidth: 80,
      suppressMenu: false,
      valueGetter: (params: any) => {

        const finishedBy = params.data?.finishedBy;
        if (finishedBy && finishedBy.length > 0) {
          let finishedBys = "";
          finishedBy.forEach((finisher: any) => {
            finishedBys = finishedBys === "" ? finisher.name : `${finishedBys},${finisher.name}`;
          });
          return finishedBys;
        }

        return "";
      },
      cellRenderer: (params: any) => {
        const finishedPerson = params.value;
        if (!finishedPerson) {
          return "";
        }
        if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
          return `<span style="text-decoration:line-through"> ${finishedPerson} </span>`;
        }
        return finishedPerson;
      },
    },
    {
      headerName: '相关需求',
      field: 'relatedStories',
      minWidth: 80,
      cellRenderer: relatedNumberAndIdRender,
      onCellClicked: (params: any) => {
        // BUG = 1,
        // TASK = 2,
        // STORY = 3,
        if (Number(params.value) < 500 && Number(params.value) > 0) {
          history.push(`/sprint/dt_details?kind=${params.data.category}&ztNo=${params.data.ztNo}&relatedType=3&count=${params.value}`);
        }
      },
    },
    {
      headerName: '相关任务',
      field: 'relatedTasks',
      minWidth: 80,
      cellRenderer: relatedNumberAndIdRender,
      onCellClicked: (params: any) => {
        if (Number(params.value) < 500 && Number(params.value) > 0) {
          history.push(`/sprint/dt_details?kind=${params.data.category}&ztNo=${params.data.ztNo}&relatedType=2&count=${params.value}`);
        }
      },
    },
    {
      headerName: '相关bug',
      field: 'relatedBugs',
      minWidth: 80,
      cellRenderer: relatedNumberRender,
      onCellClicked: (params: any) => {
        if (Number(params.value) > 0) {
          history.push(`/sprint/dt_details?kind=${params.data.category}&ztNo=${params.data.ztNo}&relatedType=1&count=${params.value}`);
        }
      },
    },
    {
      headerName: '截止日期',
      field: 'deadline',
      cellRenderer: timestampChanges,
    },
    {
      headerName: '是否涉及页面调整',
      field: 'pageAdjust',
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.pageAdjust)
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '是否可热更',
      field: 'hotUpdate',
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.hotUpdate)
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '是否有数据升级',
      field: 'dataUpdate',
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.dataUpdate)
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '是否有接口升级',
      field: 'interUpdate',
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.interUpdate)
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '是否有预置数据修改',
      field: 'presetData',
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.presetData)
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '是否需要测试验证',
      field: 'testCheck',
      headerTooltip: "自动生成’是‘为黑色；自动生成‘否’为红色；手动修改‘是’为紫色；手动修改‘否’为黄色",
      tooltipValueGetter: (params: any) => {
        const values = params.value;
        if (!values) {
          return "";
        }
        if (values === "-1") { // 手动：是
          return "手动生成";
        }
        if (values === "-0") { // 手动：否
          return "手动生成";
        }
        if (values === "0") { // 自动：否
          return "自动生成";
        }
        if (values === "1") { // 自动：是
          return "自动生成";
        }
        return values;
      },
      cellRenderer: (params: any) => {
        // testCheck: 手动修改标识: "-1"、"-0";自动的是：0 ，1
        // 自动规则生成的‘是’默认黑色，自动规则生成的‘否’默认红色
        // 手动修改的‘是’默认紫色，手动修改的‘否’默认黄色
        const values = params.value;
        if (!values) {
          return "";
        }

        let result = "";
        let my_color = "";
        if (values === "-1") { // 手动：是
          result = "是";
          my_color = "purple";// 紫色
        } else if (values === "-0") { // 手动：否
          result = "否";
          my_color = "orange";// 黄色
        } else if (values === "0") { // 自动：否
          result = "否";
          my_color = "red";// 红色
        } else if (values === "1") { // 自动：是
          result = "是";
          my_color = "black";// 黑色
        }
        if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
          return `<span style="text-decoration:line-through"> ${result} </span>`;
        }
        return `<span style="color: ${my_color}"> ${result}  </span>`;
      },

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
      headerName: '关闭人',
      field: 'closedBy',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
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
      headerName: '验证范围建议',
      field: 'scopeLimit',
      cellRenderer: stageForLineThrough,
    },
    {
      headerName: 'UED',
      field: 'uedName',
      cellRenderer: stageForLineThrough,
      suppressMenu: false,
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
      headerName: '来源',
      field: 'source',
      cellRenderer: numberRenderToSource,
    },
    {
      headerName: '反馈人',
      field: 'feedback',
      cellRenderer: stageForLineThrough,
      suppressMenu: false,
    }
  ];

  if (prjNames === "多组织阻塞bug跟踪") {
    oraFields.splice(11, 0, {
      headerName: '创建时间',
      field: 'openedAt',
      minWidth: 150,
      cellRenderer: timeForLineThrough,
      suppressMenu: false
    });

    oraFields.splice(12, 0, {
      headerName: '解决时间',
      field: 'resolvedAt',
      minWidth: 150,
      cellRenderer: timeForLineThrough,
      suppressMenu: false
    });
  }

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

// 设置行的颜色
const setRowColor = (params: any) => {
  if (params.data.baseline === '0') {  // 如果基线为0，则整行都渲染颜色
    return {'background-color': '#FFF6F6'};
  }
  return {'background-color': 'white'};
};

export {getColums, setRowColor};
