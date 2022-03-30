
import {
  linkToZentaoPage, numberRenderToCurrentStage, numberRenderToCurrentStageForColor,
  numberRenderTopass, numberRenderToSource, numberRenderToYesNo, numberRenderToZentaoStatusForRed, numberRenderToZentaoTypeFilter,
  numRenderForSevAndpriForLine, numRenderToTypeForLineAndFromBug, proposedTestRender, relatedNumberAndIdRender,
  relatedNumberRender, stageForLineThrough, testerRender, timeForLineThrough, timestampChanges
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
      suppressMenu: false,
      // filter: "agSetColumnFilter",
      filterParams: {cellRenderer: numberRenderToCurrentStage}
    },
    {
      headerName: '测试',
      field: 'tester',
      pinned: 'left',
      minWidth: 80,
      cellRenderer: testerRender,
      tooltipField: "tester",
      suppressMenu: false
    },
    {
      headerName: '类型',
      field: 'category',
      cellRenderer: numRenderToTypeForLineAndFromBug,
      pinned: 'left',
      minWidth: 95,
      suppressMenu: false,
      filterParams: {cellRenderer: numberRenderToZentaoTypeFilter}

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
      minWidth: 235,
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
    }, {
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
      // tooltipField: "relatedStories"
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
      // tooltipField: "relatedBugs"

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
      // tooltipField: "hotUpdate"
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
    },
    // {
    //   headerName: '基线',
    //   field: 'baseline',
    //   suppressMenu: false,
    // }
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

export {getColums,setRowColor};
