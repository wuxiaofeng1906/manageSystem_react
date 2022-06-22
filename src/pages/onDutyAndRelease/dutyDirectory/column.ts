import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';

const dutyColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: 'NO.',
    minWidth: 70,
    maxWidth: 110,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '值班名单',
    field: 'duty_name',
    cellRenderer: (data) =>
      `<a style="color:#1890ff;text-decoration: underline" href='/onDutyAndRelease/dutyCatalog/${data.data.person_duty_num}'>${data.value}</a>`,
    minWidth: 170,
  },
  {
    headerName: '项目名称',
    field: 'project_name',
    minWidth: 120,
  },
  {
    headerName: '值班日期',
    field: 'duty_date',
    minWidth: 130,
    maxWidth: 150,
  },
  {
    headerName: '发布环境',
    field: 'release_env',
    minWidth: 120,
  },
  {
    headerName: '发布方式',
    field: 'release_method',
    minWidth: 90,
    maxWidth: 110,
  },
  {
    headerName: '发布时间',
    field: 'release_time',
    minWidth: 120,
  },
  {
    headerName: '消息状态',
    field: 'push_status',
    minWidth: 90,
    valueFormatter: ({ data }) =>
      data.is_push_msg ? (data.is_push_msg == 'yes' ? '已发' : '未发') : '',
  },
  {
    headerName: '消息时间',
    field: 'push_time',
    minWidth: 150,
  },
  {
    headerName: '发送人',
    field: 'user_name',
    minWidth: 90,
  },
];
export default dutyColumn;
