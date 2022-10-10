import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';

export const releaseListColumn = (type: 'history' | 'pre'): (ColDef | ColGroupDef)[] => [
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
    headerName: '预发布批次名',
    field: 'release_name',
    minWidth: 110,
    cellRenderer: (p) => {
      let href = `/onDutyAndRelease/preRelease?releasedNum=${p.data.release_num}`;
      if (p.data.release_type == 'backlog_release') {
        href = `/onDutyAndRelease/releaseOrder/${p.data.release_num}`;
      }
      return `<a href="${href}">${p.value}</a>`;
    },
  },
  {
    headerName: '发布项目',
    field: 'project',
    minWidth: 120,
  },
  {
    headerName: '工单编号',
    field: 'repair_order',
    minWidth: 130,
  },
  {
    headerName: '发布服务',
    field: 'apps',
    minWidth: 130,
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
  },
  {
    headerName: '发布类型',
    field: 'release_type',
    minWidth: 120,
    maxWidth: 140,
    cellRenderer: (p) =>
      p.value == 'ready_release' ? '非积压发布' : p.value == 'backlog_release' ? '灰度推线上' : '',
  },
  {
    headerName: '发布结果',
    field: 'release_result',
    minWidth: 120,
    maxWidth: 130,
    hide: type == 'pre',
    cellRenderer: (p: any) =>
      `<span style="color:${
        p.value == 'success' ? '#2BF541' : p.value == 'failure' ? 'red' : 'initial'
      }">${p.value == 'success' ? '发布成功' : p.value == 'failure' ? '发布失败' : ''}</span>`,
  },
  {
    headerName: '发布方式',
    field: 'release_way',
    minWidth: 120,
    cellRenderer: (p) =>
      p.value == 'stop_server' ? '停服' : p.value == 'keep_server' ? '不停服' : '',
  },
  {
    headerName: '发布环境',
    field: 'release_env',
    minWidth: 120,
  },
  {
    headerName: type == 'history' ? '发布时间' : '计划发布时间',
    field: 'plan_release_time',
    minWidth: 150,
  },
  {
    headerName: '操作',
    cellRenderer: 'drag',
    minWidth: 90,
    maxWidth: 90,
    hide: type == 'history',
  },
];
export const historyOrderColumn = [
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
  },
  {
    headerName: '关联工单编号',
    field: 'repair_order',
  },
  {
    headerName: '关联项目列表',
    field: 'project',
  },
  {
    headerName: '已发布集群',
    field: 'cluster',
  },
  {
    headerName: '操作',
    cellRenderer: 'deleteOrder',
    width: 130,
    maxWidth: 140,
    hide: false,
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
