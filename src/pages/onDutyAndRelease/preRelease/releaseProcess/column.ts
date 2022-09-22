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
    field: 'name',
    minWidth: 110,
    cellRenderer: (p) =>
      `<a href="/onDutyAndRelease/preRelease?releasedNum=${p.data.id}&history=${
        type == 'history'
      }">${p.value}</a>`,
  },
  {
    headerName: '发布项目',
    field: 'project',
    minWidth: 120,
  },
  {
    headerName: '工单编号',
    field: 'number',
    minWidth: 130,
  },
  {
    headerName: '发布服务',
    field: 'services',
    minWidth: 130,
  },
  {
    headerName: '项目负责人',
    field: 'pm',
    minWidth: 130,
  },
  {
    headerName: '发布分支',
    field: 'branch',
    minWidth: 130,
  },
  {
    headerName: '发布类型',
    field: 'type',
    minWidth: 120,
    maxWidth: 140,
  },
  {
    headerName: '发布结果',
    field: 'result',
    minWidth: 120,
    maxWidth: 130,
    hide: type == 'pre',
  },
  {
    headerName: '发布方式',
    field: 'method',
    minWidth: 120,
  },
  {
    headerName: '发布环境',
    field: 'env',
    minWidth: 120,
  },
  {
    headerName: '计划发布时间',
    field: 'time',
    minWidth: 100,
    hide: type == 'history',
  },
  {
    headerName: '发布时间',
    field: 'time',
    minWidth: 100,
    hide: type == 'pre',
  },
  {
    headerName: '操作',
    cellRenderer: 'drag',
    width: 90,
    maxWidth: 90,
    hide: type == 'history',
  },
];
