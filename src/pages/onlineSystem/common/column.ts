import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import type { ColumnsType } from 'antd/lib/table';
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

export const preServerColumn: ColumnsType<any> = [
  {
    title: '应用',
    dataIndex: 'applicant',
    onCell: (v) => ({ rowSpan: v?.rowSpan ?? 1 }),
  },
  {
    title: '项目名称',
    dataIndex: 'project_name',
  },
  {
    title: '是否封板',
    dataIndex: 'env',
  },
  {
    title: '封板/封板人',
    dataIndex: 'branch',
  },
  {
    title: '封板/封板时间',
    dataIndex: 'time',
  },
  {
    title: '需求编号',
    dataIndex: 'num',
  },
  {
    title: '需求标题',
    dataIndex: 'title',
  },
  {
    title: '是否涉及数据update',
    dataIndex: 'update',
  },
  {
    title: '是否涉及数据Recovery',
    dataIndex: 'recovery',
  },
  {
    title: '是否可热更',
    dataIndex: 'hot',
  },
  {
    title: '需求创建人',
    dataIndex: 'create_pm',
  },
  {
    title: '需求指派人',
    dataIndex: 'point_pm',
  },
];
