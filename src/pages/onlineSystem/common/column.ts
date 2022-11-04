import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';

export const calendarColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '上线分支',
    field: 'branch',
    minWidth: 150,
    tooltipField: 'branch',
    cellRenderer: 'link',
  },
  {
    headerName: '项目名称',
    field: 'project_name',
    minWidth: 150,
    tooltipField: 'project_name',
  },
  {
    headerName: '项目负责人',
    field: 'pro_name',
    minWidth: 140,
  },
  {
    headerName: '应用服务',
    field: 'appservice',
    minWidth: 130,
    tooltipField: 'project_name',
  },
  {
    headerName: '状态',
    field: 'status',
    minWidth: 110,
  },
];
// 发布过程列表
export const preProcessColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '发布批次名',
    field: 'name',
    minWidth: 150,
    tooltipField: 'name',
    cellRenderer: 'link',
  },
  {
    headerName: '项目名称',
    field: 'project_name',
    minWidth: 150,
    tooltipField: 'project_name',
  },
  {
    headerName: '发布集群',
    field: 'env',
    minWidth: 140,
  },
  {
    headerName: '上线分支',
    field: 'branch',
    minWidth: 130,
    tooltipField: 'branch',
  },
  {
    headerName: '发布服务',
    field: 'appservice',
    minWidth: 110,
  },
  {
    headerName: '创建人',
    field: 'creater',
    minWidth: 110,
  },
  {
    headerName: '创建时间',
    field: 'create_time',
    minWidth: 110,
  },
  {
    headerName: '发布单状态',
    field: 'status',
    minWidth: 110,
  },
  {
    headerName: '工单部署结束时间',
    field: 'end_time',
    minWidth: 110,
  },
];

export const preServerColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '应用',
    field: 'applicant',
    minWidth: 100,
    rowSpan: (p) => (p.data.applicant == 'h5' ? 2 : 1),
    cellClassRules: {
      'row-span': 'value == h5',
    },
  },
  {
    headerName: '项目名称',
    field: 'project_name',
    minWidth: 150,
    tooltipField: 'project_name',
  },
  {
    headerName: '是否封板',
    field: 'env',
    minWidth: 100,
  },
  {
    headerName: '封板/封板人',
    field: 'branch',
    minWidth: 130,
    tooltipField: 'branch',
  },
  {
    headerName: '封板/封板时间',
    field: 'time',
    minWidth: 110,
  },
  {
    headerName: '需求编号',
    field: 'num',
    minWidth: 110,
  },
  {
    headerName: '需求标题',
    field: 'title',
    minWidth: 110,
  },
  {
    headerName: '是否涉及数据update',
    field: 'update',
    minWidth: 110,
  },
  {
    headerName: '是否涉及数据Recovery',
    field: 'recovery',
    minWidth: 110,
  },
  {
    headerName: '是否可热更',
    field: 'hot',
    minWidth: 110,
  },
  {
    headerName: '需求创建人',
    field: 'create_pm',
    minWidth: 110,
  },
  {
    headerName: '需求指派人',
    field: 'point_pm',
    minWidth: 110,
  },
];
