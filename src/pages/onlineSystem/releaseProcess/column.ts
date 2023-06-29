import type {ColDef, ColGroupDef} from 'ag-grid-community/dist/lib/entities/colDef';
import {style} from "./index.less";

export const releaseListColumn = (type: 'history' | 'pre'): (ColDef | ColGroupDef)[] => [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 80,
    maxWidth: 80,
    filter: false,
    pinned: 'left',
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '预发布批次名',
    field: 'release_name',
    minWidth: 150,
    cellRenderer: 'link',
    tooltipField: 'release_name',
    pinned: 'left',
  },
  {
    headerName: '发布项目',
    field: 'project',
    minWidth: 120,
  },
  {
    headerName: '工单编号',
    field: 'repair_order',
    minWidth: 110,
  },
  {
    headerName: '发布服务',
    field: 'apps',
    minWidth: 130,
    tooltipField: 'apps',
  },
  {
    headerName: '项目负责人',
    field: 'project_manager',
    minWidth: 130,
  },
  {
    headerName: '发布分支',
    field: 'branch',
    minWidth: 130,
    tooltipField: 'branch',
  },
  {
    headerName: '发布类型',
    field: 'release_type',
    minWidth: 120,
    cellRenderer: (p) =>
      p.value == 'ready_release' ? '非积压发布' : p.value == 'backlog_release' ? '灰度推线上' : '',
  },
  {
    headerName: '发布结果',
    field: 'release_result',
    minWidth: 120,
    hide: type == 'pre',
    cellRenderer: (p: any) => {
      if (p.data.is_delete) {
        return `<span style="color:${"gray"}">取消发布</span>`
      }
      return `<span style="color:${
        p.value === 'success' ? '#2BF541' : p.value === 'failure' ? 'red' : 'initial'
      }">${
        p.value === 'success' ? '发布成功' : p.value === 'failure' ? '发布失败' : ''
      }</span>`;
    }
    ,
  },
  {
    headerName: '发布方式',
    field: 'release_way',
    minWidth: 100,
    cellRenderer: (p) =>
      p.value == 'stop_server' ? '停服' : p.value == 'keep_server' ? '不停服' : '',
  },
  {
    headerName: '发布环境',
    field: 'release_env',
    minWidth: 120,
  },
  {
    headerName: '计划发布时间',
    field: 'plan_release_time',
    minWidth: 190,
    tooltipField: 'plan_release_time',
    cellStyle: (p) => ({color: p.data?.tip ? 'red' : 'initial', lineHeight: '28px'}),
  },
  {
    headerName: '操作',
    cellRenderer: 'drag',
    minWidth: 90,
    maxWidth: 90,
    hide: type == 'history',
    pinned: 'right',
  },
];

const rowSpanRender = {
  rowSpan: (params: any) => params.data.rowSpan ?? 1,
  cellClassRules: {
    'history-cell-span': "value !== undefined"
  },
  cellRenderer: (param: any) => {
    debugger
    if (param.data?.rowSpan === 2) {
      return `<div style="margin-top: 15px;margin-left: -5px">${param.value}</div>`
    }
    return `<div>${param.value}</div>`
  }
}
export const historyReleaseListColumn = () => [
  {
    headerName: '序号',
    field: 'sortNo',
    minWidth: 80,
    maxWidth: 80,
    filter: false,
    pinned: 'left',
    ...rowSpanRender,
  },
  // {
  //   headerName: '预发布批次名',
  //   field: 'release_name',
  //   minWidth: 150,
  //   cellRenderer: 'link',
  //   tooltipField: 'release_name',
  //   pinned: 'left',
  //   ...rowSpanRender,
  // },
  {
    headerName: '发布项目',
    field: 'project',
    minWidth: 130,
    ...rowSpanRender,
  },
  {
    headerName: '工单编号',
    field: 'repair_order',
    minWidth: 110,
    ...rowSpanRender,
  },
  // {
  //   headerName: '发布服务',
  //   field: 'apps',
  //   minWidth: 130,
  //   tooltipField: 'apps',
  //   ...rowSpanRender,
  // },
  // {
  //   headerName: '项目负责人',
  //   field: 'project_manager',
  //   minWidth: 130,
  //   ...rowSpanRender,
  // },
  // {
  //   headerName: '发布分支',
  //   field: 'branch',
  //   minWidth: 130,
  //   tooltipField: 'branch',
  //   ...rowSpanRender,
  // },
  // {
  //   headerName: '发布类型',
  //   field: 'release_type',
  //   minWidth: 120,
  //   cellRenderer: (p) =>
  //     p.value == 'ready_release' ? '非积压发布' : p.value == 'backlog_release' ? '灰度推线上' : '',
  //   ...rowSpanRender,
  // },
  // {
  //   headerName: '发布方式',
  //   field: 'release_way',
  //   minWidth: 100,
  //   cellRenderer: (p) =>
  //     p.value == 'stop_server' ? '停服' : p.value == 'keep_server' ? '不停服' : '',
  //   ...rowSpanRender,
  // },
  // {
  //   headerName: '计划发布时间',
  //   field: 'plan_release_time',
  //   minWidth: 170,
  //   tooltipField: 'plan_release_time',
  //   cellStyle: (p) => ({color: p.data?.tip ? 'red' : 'initial', lineHeight: '28px'}),
  //   ...rowSpanRender,
  // },
  // {
  //   headerName: '发布结果',
  //   field: 'release_result',
  //   minWidth: 100,
  //   cellRenderer: (p: any) => {
  //     if (p.data.is_delete) {
  //       return `<span style="color:${"gray"}">取消发布</span>`
  //     }
  //     return `<span style="color:${
  //       p.value === 'success' ? '#2BF541' : p.value === 'failure' ? 'red' : 'initial'
  //     }">${
  //       p.value === 'success' ? '发布成功' : p.value === 'failure' ? '发布失败' : ''
  //     }</span>`;
  //   }
  //   ,
  // },
  // {
  //   headerName: '发布环境',
  //   field: 'release_env',
  //   minWidth: 120,
  // },
];

export const historyOrderColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    width: 70,
    minWidth: 90,
    maxWidth: 110,
    filter: false,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '推送类型',
    field: 'repair_order_type',
    width: 130,
    minWidth: 130,
    cellRenderer: 'pushType',
  },
  {
    headerName: '关联工单编号',
    field: 'repair_order',
    width: 120,
    minWidth: 120,
  },
  {
    headerName: '发布批次名称',
    field: 'ready_release_name',
    cellRenderer: 'linkOrSelect',
    tooltipField: 'ready_release_name',
    width: 200,
    minWidth: 200,
  },
  {
    headerName: '关联项目列表',
    field: 'project',
    minWidth: 200,
  },
  {
    headerName: '部署结束时间',
    field: 'repair_order_fish_time',
    width: 150,
    minWidth: 150,
  },
  {
    headerName: '已发布集群',
    field: 'cluster',
    cellRenderer: 'ICluster',
    width: 350,
    minWidth: 350,
  },
  {
    headerName: '操作',
    cellRenderer: 'operations',
    width: 130,
    minWidth: 130,
    maxWidth: 150,
    pinned: 'right',
  },
];
export const historyCompareColumn = [
  {
    headerName: '序号',
    field: 'num',
    width: 70,
    minWidth: 90,
    maxWidth: 110,
    filter: false,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: 'rd平台工单',
    field: 'rdTitle',
  },
  {
    headerName: 'ops平台工单',
    field: 'opsTitle',
  },
];
