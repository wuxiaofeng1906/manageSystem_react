// 工单信息
export const releaseColumns: any = [
  {
    headerName: '集群',
    field: 'release_env',
    cellClass: 'cell-span',
    rowSpan: (params: any) => params.data?.rowSpan || 1,
    cellRenderer: "releaseEnvRenderer"
  },
  {
    headerName: '发布项目',
    field: 'project',
  },
  {
    headerName: '灰度发布日期',
    field: 'plan_release_time',
  },
  {
    headerName: '工单编号',
    field: 'order_num',
  },
  {
    headerName: '编辑人',
    field: 'edit_user_name',
  },
  {
    headerName: '编辑时间',
    field: 'edit_time',
  },
];


