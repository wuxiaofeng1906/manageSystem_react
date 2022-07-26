import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
// import { isEmpty } from 'lodash';

const dutyColumn: (ColDef | ColGroupDef)[] = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: false,
    maxWidth: 35,
    minWidth: 35,
  },
  {
    headerName: 'NO.',
    minWidth: 70,
    maxWidth: 90,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '值班名单',
    field: 'duty_name',
    cellRenderer: 'dutyCatalog',
    tooltipField: 'duty_name',
    minWidth: 220,
  },
  {
    headerName: '项目名称',
    field: 'project_name',
    minWidth: 140,
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
    minWidth: 100,
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
    maxWidth: 110,
    valueFormatter: ({ data }) =>
      data.is_push_msg ? (data.is_push_msg == 'yes' ? '已发' : '未发') : '',
  },
  {
    headerName: '消息时间',
    field: 'push_time',
    minWidth: 100,
  },
  {
    headerName: '发送人',
    field: 'user_name',
    minWidth: 90,
    maxWidth: 110,
  },
];
export default dutyColumn;
