import {
  textDecorateRender,
  stageValueGetter,
  stageRenderer,
  testerValueGetter,
  testerRenderer,
  testConfirmValueGetter,
  catagoryValueGetter,
  linkToZentaoPage,
  servertyValueGetter,
  statusValueGetter,
  statusRenderer,
  assignedToValueGetter,
  solvedByValueGetter,
  relatedNumberRender,
  timestampRenderer,
  isOrNotValueGetter,
  testConfirmTooltipValueGetter,
  testConfirmedRenderer,
  proposedTestValueGetter,
  testVertifyFilter,
  clearCacheRenderer,
  vertifyResultValueGetter,
  sourceValueGetter,
  timeRenderer,
  isDelayTextDecorateRender,
} from './columnRenderer';

import { history } from '@@/core/history';
import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
// 定义列名
const getColums = (prjNames: any) => {
  // 获取缓存的字段
  const fields = localStorage.getItem('sp_details_filed');
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
      minWidth: 70,
      suppressMenu: true,
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
      minWidth: 155,
    },
    {
      headerName: '测试',
      field: 'tester',
      pinned: 'left',
      minWidth: 80,
      valueGetter: testerValueGetter,
      cellRenderer: testerRenderer,
    },
    {
      headerName: '测试确认',
      field: 'testConfirmed',
      pinned: 'left',
      minWidth: 105,
      valueGetter: testConfirmValueGetter,
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '测试验证?',
      field: 'testCheck',
      pinned: 'left',
      minWidth: 115,
      headerTooltip:
        '是否需要测试验证：自动生成’是‘为黑色；自动生成‘否’为红色；手动修改‘是’为紫色；手动修改‘否’为黄色',
      tooltipValueGetter: testConfirmTooltipValueGetter,
      cellRenderer: testConfirmedRenderer,
      filterParams: { cellRenderer: testVertifyFilter },
    },
    {
      headerName: '类型',
      field: 'category',
      pinned: 'left',
      minWidth: 90,
      valueGetter: catagoryValueGetter,
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '编号',
      field: 'ztNo',
      pinned: 'left',
      minWidth: 80,
      suppressMenu: true,
      cellRenderer: linkToZentaoPage,
    },
    {
      headerName: '标题内容',
      field: 'title',
      pinned: 'left',
      minWidth: 235,
      cellRenderer: textDecorateRender,
      tooltipField: 'title',
      filter: false,
    },
    {
      headerName: '所属计划',
      field: 'planName',
      minWidth: 150,
    },
    {
      headerName: '严重等级',
      field: 'severity',
      valueGetter: servertyValueGetter,
      cellRenderer: textDecorateRender,
      minWidth: 110,
    },
    // {
    //   headerName: '优先级',
    //   field: 'priority',
    // },
    {
      headerName: '模块',
      field: 'moduleName',
      minWidth: 100,
      cellRenderer: textDecorateRender,
      tooltipField: 'moduleName',
    },
    {
      headerName: '是否可热更',
      field: 'hotUpdate',
      minWidth: 120,
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.hotUpdate);
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '是否清缓存',
      field: 'clearCache',
      minWidth: 120,
      cellRenderer: clearCacheRenderer,
      filterParams: { cellRenderer: testVertifyFilter },
    },
    {
      headerName: '是否有数据升级',
      field: 'dataUpdate',
      minWidth: 150,
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.dataUpdate);
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '是否有接口升级',
      field: 'interUpdate',
      minWidth: 150,
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.interUpdate);
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '状态',
      field: 'ztStatus',
      valueGetter: statusValueGetter,
      cellRenderer: statusRenderer,
      minWidth: 80,
    },
    {
      headerName: '指派给',
      field: 'assignedTo',
      minWidth: 100,
      valueGetter: assignedToValueGetter,
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '解决/完成人',
      field: 'finishedBy',
      minWidth: 130,
      suppressMenu: false,
      valueGetter: solvedByValueGetter,
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '相关需求',
      field: 'relatedStories',
      minWidth: 90,
      suppressMenu: true,
      cellRenderer: relatedNumberRender,
      onCellClicked: (params: any) => {
        // BUG = 1,
        // TASK = 2,
        // STORY = 3,
        if (Number(params.value) < 500 && Number(params.value) > 0) {
          history.push(
            `/sprint/dt_details?kind=${
              params.data.category === '-3' ? '3' : params.data.category
            }&ztNo=${params.data.ztNo}&relatedType=3&count=${params.value}`,
          );
        }
      },
    },
    {
      headerName: '相关任务',
      field: 'relatedTasks',
      minWidth: 90,
      suppressMenu: true,
      cellRenderer: relatedNumberRender,
      onCellClicked: (params: any) => {
        if (Number(params.value) < 500 && Number(params.value) > 0) {
          history.push(
            `/sprint/dt_details?kind=${
              params.data.category === '-3' ? '3' : params.data.category
            }&ztNo=${params.data.ztNo}&relatedType=2&count=${params.value}`,
          );
        }
      },
    },
    {
      headerName: '相关bug',
      field: 'relatedBugs',
      minWidth: 90,
      suppressMenu: true,
      cellRenderer: relatedNumberRender,
      onCellClicked: (params: any) => {
        if (Number(params.value) > 0) {
          history.push(
            `/sprint/dt_details?kind=${
              params.data.category === '-3' ? '3' : params.data.category
            }&ztNo=${params.data.ztNo}&relatedType=1&count=${params.value}`,
          );
        }
      },
    },
    {
      headerName: '创建时间',
      field: 'openedAt',
      minWidth: 90,
      cellRenderer: timeRenderer,
      suppressMenu: true,
    },
    {
      headerName: '解决时间',
      field: 'resolvedAt',
      minWidth: 90,
      cellRenderer: timeRenderer,
      suppressMenu: true,
    },
    {
      headerName: '截止日期',
      field: 'deadline',
      cellRenderer: timestampRenderer,
      minWidth: 90,
      suppressMenu: true,
    },
    {
      headerName: '是否涉及页面调整',
      field: 'pageAdjust',
      minWidth: 160,
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.pageAdjust);
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '是否有预置数据修改',
      field: 'presetData',
      minWidth: 170,
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.presetData);
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '已提测',
      field: 'proposedTest',
      minWidth: 100,
      valueGetter: proposedTestValueGetter,
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '发布环境',
      field: 'publishEnv',
      minWidth: 110,
      cellRenderer: textDecorateRender,
      tooltipField: 'publishEnv',
    },
    {
      headerName: '是否延期',
      field: 'isDelay',
      minWidth: 110,
      valueGetter: (params: any) => {
        return isOrNotValueGetter(params.data?.isDelay);
      },

      cellRenderer: isDelayTextDecorateRender,
    },
    {
      headerName: '关闭人',
      field: 'closedBy',
      minWidth: 100,
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '备注',
      field: 'memo',
      minWidth: 150,
      cellRenderer: textDecorateRender,
      tooltipField: 'memo',
    },
    {
      headerName: '验证范围建议',
      field: 'scopeLimit',
      cellRenderer: textDecorateRender,
      suppressMenu: true,
      minWidth: 110,
    },
    {
      headerName: 'UED',
      field: 'uedName',
      cellRenderer: textDecorateRender,
    },
    {
      headerName: 'UED测试环境验证',
      field: 'uedEnvCheck',
      minWidth: 160,
      valueGetter: (params: any) => {
        return vertifyResultValueGetter(params.data?.uedEnvCheck);
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: 'UED线上验证',
      field: 'uedOnlineCheck',
      minWidth: 130,
      valueGetter: (params: any) => {
        return vertifyResultValueGetter(params.data?.uedOnlineCheck);
      },
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '来源',
      field: 'source',
      valueGetter: sourceValueGetter,
      cellRenderer: textDecorateRender,
    },
    {
      headerName: '反馈人',
      field: 'feedback',
      cellRenderer: textDecorateRender,
    },
  ];

  // if (prjNames === "多组织阻塞bug跟踪") {
  //   oraFields.splice(11, 0, {
  //     headerName: '创建时间',
  //     field: 'openedAt',
  //     minWidth: 150,
  //     cellRenderer: timeRenderer,
  //   });
  //
  //   oraFields.splice(12, 0, {
  //     headerName: '解决时间',
  //     field: 'resolvedAt',
  //     minWidth: 150,
  //     cellRenderer: timeRenderer,
  //   });
  // }

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
  let style: any = { background: 'white' };
  const isDelete = params.data.ztUnlinkedAt != null;
  // 超范围 + 禅道需求移除
  if (params.data.baseline === '0') {
    // 如果基线为0，则整行都渲染颜色 // ztUnlinkedAt: null 禅道需求未移除
    style = { background: '#FFF6F6', color: isDelete ? 'red' : 'initial' };
  }
  // 禅道需求移除 灰色背景
  else if (isDelete) {
    style = { background: '#e1e4ea80' };
  }
  return style;
};

const attendanceMappings = { yes: '是', no: '否', '': '' };
const attendanceRender = () => Object.keys(attendanceMappings);
const removeColumns: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    cellRenderer: (params: any) => (Number(params.node.id) + 1).toString(),
  },
  {
    headerName: '编号',
    field: 'ztNo',
  },
  {
    headerName: '标题内容',
    field: 'title',
  },
  {
    headerName: '相关需求',
    field: 'relatedStories',
  },
  {
    headerName: '相关bug',
    field: 'relatedBugs',
  },
  {
    headerName: '测试',
    field: 'tester',
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: attendanceRender() },
    valueFormatter: (p: any) => attendanceMappings[p.value],
    filterParams: {
      valueFormatter: (p: any) => attendanceMappings[p.value],
    },
  },
  {
    headerName: '是否要测试验证',
    field: 'testCheck',
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: attendanceRender() },
    valueFormatter: (p: any) => attendanceMappings[p.value],
    filterParams: {
      valueFormatter: (p: any) => attendanceMappings[p.value],
    },
  },
  {
    headerName: '是否提交代码',
    field: 'commit',
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: attendanceRender() },
    valueFormatter: (p: any) => attendanceMappings[p.value],
    filterParams: {
      valueFormatter: (p: any) => attendanceMappings[p.value],
    },
  },
  {
    headerName: '代码是否Revert',
    field: 'revert',
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: attendanceRender() },
    valueFormatter: (p: any) => attendanceMappings[p.value],
    filterParams: {
      valueFormatter: (p: any) => attendanceMappings[p.value],
    },
  },
  {
    headerName: '免Revert原因',
    field: 'reason',
    minWidth: 300,
  },
];

export { getColums, setRowColor, removeColumns };
