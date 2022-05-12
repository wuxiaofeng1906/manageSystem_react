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
  timestampChanges
} from "@/publicMethods/cellRenderer";

import {history} from "@@/core/history";
// 定义列名
const getColums = (prjNames: any) => {

  // 获取缓存的字段
  const fields = localStorage.getItem("sp_details_filed");
  const oraFields: any = [
    {
      headerName: '选择',
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 35,
    },
    {
      headerName: '阶段',
      field: 'stage',
      pinned: 'left',
      cellRenderer: numberRenderToCurrentStageForColor,
      minWidth: 120,
      suppressMenu: false,
      filterParams: {cellRenderer: numberRenderToCurrentStage}
    },
    {
      headerName: '测试',
      field: 'tester',
      pinned: 'left',
      minWidth: 80,
      tooltipField: "tester",
      suppressMenu: false,
      cellRenderer: (params: any) => {
        const testArray = params.value;
        let myColor = "gray"; // 测试验证：已验证为黑色，没验证为灰色
        const testConfirm = params.data?.testConfirmed;
        if (testConfirm === "1") {
          myColor = "black";
        }
        if (!testArray || testArray.length === 0) {
          return `<span style="color: ${myColor}"> NA </span>`;
        }
        let testers = "";
        testArray.forEach((tester: any) => {
          testers = testers === "" ? tester.name : `${testers},${tester.name}`;
        });
        if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
          return `<span style="color: ${myColor};text-decoration:line-through"> ${testers} </span>`;
        }
        return `<span style="color: ${myColor}"> ${testers} </span>`;

      },
    },
    {
      headerName: '测试验证',
      field: 'testConfirmed',
      pinned: 'left',
      minWidth: 105,
      suppressMenu: false,
      cellRenderer: (params: any) => {
        // 默认全部为：否
        if (params.value === "0" || params.value === null || params.value === undefined) {
          if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
            return `<span style="text-decoration:line-through"> 否 </span>`;
          }
          return "否";
        }
        if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
          return `<span style="text-decoration:line-through"> 是 </span>`;
        }
        return "是";
      },
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
    },
    {
      headerName: '严重等级',
      field: 'severity',
      cellRenderer: numRenderForSevAndpriForLine,
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
      tooltipField: "moduleName"
    },
    {
      headerName: '状态',
      field: 'ztStatus',
      cellRenderer: numberRenderToZentaoStatusForRed,
      minWidth: 80,
    }, {
      headerName: '指派给',
      field: 'assignedTo',
      minWidth: 80,
      cellRenderer: (params: any) => {
        const assignedPerson = params.value;
        if (!assignedPerson || !assignedPerson.name) {
          return "";
        }
        if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
          return `<span style="text-decoration:line-through"> ${assignedPerson.name} </span>`;
        }
        return assignedPerson.name;
      },
      tooltipField: "assignedTo",
      suppressMenu: false,
    },
    {
      headerName: '解决/完成人',
      field: 'finishedBy',
      minWidth: 80,
      tooltipField: "finishedBy",
      suppressMenu: false,
      cellRenderer: (params: any) => {
        const assignedPerson = params.value;
        if (!assignedPerson || !assignedPerson.name) {
          return "";
        }
        if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
          return `<span style="text-decoration:line-through"> ${assignedPerson.name} </span>`;
        }
        return assignedPerson.name;
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
      // tooltipField: "relatedTasks"

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
      cellRenderer: numberRenderToYesNo,
    },
    {
      headerName: '是否可热更',
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
      pinned: "right",
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
